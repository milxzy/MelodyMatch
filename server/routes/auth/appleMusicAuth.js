import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import User from '../../models/user.js';
import { storeTokens } from '../../services/tokenManagementService.js';
import logger from '../../utils/logger.js';
import AppleMusicAdapter from '../../adapters/appleMusicAdapter.js';
import MusicPlatformService from '../../services/musicPlatformService.js';

const router = express.Router();

// Apple Music configuration
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID;
const APPLE_KEY_ID = process.env.APPLE_KEY_ID;
const APPLE_PRIVATE_KEY_PATH = process.env.APPLE_PRIVATE_KEY_PATH;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://melody-match-flax.vercel.app';

/**
 * Generates Apple Music Developer Token (JWT)
 * Valid for up to 6 months
 */
function generateDeveloperToken() {
  if (!APPLE_TEAM_ID || !APPLE_KEY_ID || !APPLE_PRIVATE_KEY_PATH) {
    throw new Error('Apple Music credentials not configured. Please set APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY_PATH');
  }

  const privateKey = fs.readFileSync(APPLE_PRIVATE_KEY_PATH, 'utf8');
  
  const token = jwt.sign({}, privateKey, {
    algorithm: 'ES256',
    expiresIn: '180d', // 6 months (maximum allowed)
    issuer: APPLE_TEAM_ID,
    header: {
      alg: 'ES256',
      kid: APPLE_KEY_ID
    }
  });
  
  return token;
}

/**
 * GET /auth/apple-music/token
 * Returns developer token for MusicKit JS initialization
 */
router.get('/token', (req, res) => {
  try {
    const developerToken = generateDeveloperToken();
    res.json({ developerToken });
  } catch (error) {
    logger.error('Error generating Apple Music developer token:', error);
    res.status(500).json({ 
      error: 'Failed to generate developer token',
      message: error.message 
    });
  }
});

/**
 * POST /auth/apple-music/connect
 * Receives user token from frontend (obtained via MusicKit JS)
 * Stores the token and syncs user data
 */
router.post('/connect', async (req, res) => {
  try {
    const { musicUserToken, userId } = req.body;
    
    if (!musicUserToken || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: musicUserToken and userId' 
      });
    }
    
    // First, get user's storefront to obtain a platform user identifier
    const adapter = new AppleMusicAdapter();
    let platformUserId = userId; // Fallback to our userId
    let platformDisplayName = null;
    
    try {
      const storefront = await adapter.getUserStorefront(musicUserToken);
      if (storefront && storefront.id) {
        platformUserId = storefront.id;
      }
    } catch (error) {
      logger.warn('Could not fetch storefront, using userId as platformUserId:', error.message);
    }
    
    // Store the user token
    // Note: Apple Music user tokens don't have a refresh token
    // They expire after ~6 months and user must re-authenticate
    logger.debug('Storing tokens with platformUserId:', platformUserId);
    await storeTokens(userId, 'apple_music', {
      accessToken: musicUserToken,
      refreshToken: null,
      expiresIn: 15552000, // 180 days in seconds
      platformUserId: platformUserId,
      platformDisplayName: platformDisplayName
    });
    
    // Fetch user's music data using the adapter
    logger.info(`Fetching Apple Music data for user ${userId}`);
    const [artists, genres] = await Promise.all([
      adapter.getTopArtists(musicUserToken),
      adapter.getTopGenres(musicUserToken)
    ]);
    
    logger.info(`Found ${artists.length} artists and ${genres.length} genres`);
    
    // Update user's connected platforms
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add to connected platforms if not already present
    if (!user.connectedPlatforms.includes('apple_music')) {
      user.connectedPlatforms.push('apple_music');
      logger.info(`[Apple Music] Added apple_music to connectedPlatforms`);
    }

    // Set as primary platform if it's the first one
    if (!user.primaryPlatform) {
      user.primaryPlatform = 'apple_music';
      logger.info(`[Apple Music] Set apple_music as primaryPlatform`);
    }

    // Store the raw platform data
    if (!user.platformData) {
      user.platformData = {};
    }
    user.platformData.apple_music = {
      artists,
      genres,
      lastSyncedAt: new Date()
    };

    await user.save();

    logger.info(`[Apple Music] Successfully saved user ${userId}`);

    // Aggregate music data from all connected platforms
    logger.info(`[Apple Music] Aggregating music data for user ${userId}`);
    const aggregated = await MusicPlatformService.mergeUserMusicData(userId);
    logger.info(`[Apple Music] Aggregated ${aggregated.artists.length} artists and ${aggregated.genres.length} genres`);
    logger.info(`Successfully connected Apple Music for user ${userId}`);
    
    res.json({
      success: true,
      message: 'Apple Music connected successfully',
      data: {
        artistCount: artists.length,
        genreCount: genres.length,
        platform: 'apple_music'
      }
    });
    
  } catch (error) {
    console.error('Error connecting Apple Music:', error);
    res.status(500).json({ 
      error: 'Failed to connect Apple Music',
      message: error.message 
    });
  }
});

/**
 * POST /auth/apple-music/disconnect
 * Disconnects Apple Music from user account
 */
router.post('/disconnect', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove from connected platforms
    user.connectedPlatforms = user.connectedPlatforms.filter(
      p => p !== 'apple_music'
    );
    
    // Clear primary platform if it was Apple Music
    if (user.primaryPlatform === 'apple_music') {
      user.primaryPlatform = user.connectedPlatforms[0] || null;
    }
    
    // Remove platform data
    if (user.platformData && user.platformData.apple_music) {
      delete user.platformData.apple_music;
    }
    
    await user.save();
    
    // Revoke token in database
    const { revokeConnection } = await import('../../services/tokenManagementService.js');
    await revokeConnection(userId, 'apple_music');
    
    res.json({
      success: true,
      message: 'Apple Music disconnected successfully'
    });
    
  } catch (error) {
    logger.error('Error disconnecting Apple Music:', error);
    res.status(500).json({ 
      error: 'Failed to disconnect Apple Music',
      message: error.message 
    });
  }
});

/**
 * POST /auth/apple-music/sync
 * Re-syncs user's Apple Music data
 */
router.post('/sync', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    // Get stored token
    const { getTokens } = await import('../../services/tokenManagementService.js');
    const tokens = await getTokens(userId, 'apple_music');
    
    if (!tokens) {
      return res.status(401).json({ 
        error: 'Apple Music not connected or token expired',
        requiresReauth: true 
      });
    }
    
    // Fetch fresh data
    const adapter = new AppleMusicAdapter();
    const [artists, genres] = await Promise.all([
      adapter.getTopArtists(tokens.accessToken),
      adapter.getTopGenres(tokens.accessToken)
    ]);
    
    // Update user data
    const user = await User.findById(userId);
    if (!user.platformData) {
      user.platformData = {};
    }
    user.platformData.apple_music = {
      artists,
      genres,
      lastSyncedAt: new Date()
    };
    
    await user.save();
    
    // Aggregate music data from all connected platforms
    logger.info(`[Apple Music Sync] Aggregating music data for user ${userId}`);
    const aggregated = await MusicPlatformService.mergeUserMusicData(userId);
    logger.info(`[Apple Music Sync] Aggregated ${aggregated.artists.length} artists and ${aggregated.genres.length} genres`);
    
    res.json({
      success: true,
      message: 'Apple Music data synced successfully',
      data: {
        artistCount: artists.length,
        genreCount: genres.length
      }
    });
    
  } catch (error) {
    logger.error('Error syncing Apple Music:', error);
    res.status(500).json({ 
      error: 'Failed to sync Apple Music data',
      message: error.message 
    });
  }
});

export default router;
