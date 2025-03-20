import express from 'express';
import crypto from 'crypto';
import User from '../../models/user.js';
import { storeTokens } from '../../services/tokenManagementService.js';
import YouTubeMusicAdapter from '../../adapters/youtubeMusicAdapter.js';
import logger from '../../utils/logger.js';
import MusicPlatformService from '../../services/musicPlatformService.js';

const router = express.Router();

// YouTube Music OAuth configuration
const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL || 'https://melodymatch-production.up.railway.app';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://melody-match-flax.vercel.app';
const REDIRECT_URI = `${BACKEND_URL}/auth/youtube-music/callback`;

// OAuth scopes needed for YouTube Music
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtubepartner'
];

/**
 * GET /auth/youtube-music/login
 * Initiates YouTube Music OAuth flow
 */
router.get('/login', (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }
    
    // Generate state parameter for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');
    
    // Store state in session or temporary storage (you might want to use Redis)
    // For now, we'll encode userId in the state
    const stateData = Buffer.from(JSON.stringify({ 
      state, 
      userId,
      timestamp: Date.now()
    })).toString('base64');
    
    // Build Google OAuth URL
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + 
      new URLSearchParams({
        client_id: YOUTUBE_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: SCOPES.join(' '),
        state: stateData,
        access_type: 'offline', // Request refresh token
        prompt: 'consent' // Force consent screen to always get refresh token
      });
    
    logger.info(`[YouTube Music Auth] Redirecting user ${userId} to OAuth flow`);
    res.redirect(authUrl);
    
  } catch (error) {
    logger.error('Error initiating YouTube Music OAuth:', error);
    res.redirect(`${FRONTEND_URL}/error?message=youtube_auth_init_failed`);
  }
});

/**
 * GET /auth/youtube-music/callback
 * Handles OAuth callback from Google
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    // Handle OAuth errors
    if (error) {
      logger.error('YouTube Music OAuth error:', error);
      return res.redirect(`${FRONTEND_URL}/error?message=youtube_auth_denied`);
    }
    
    if (!code || !state) {
      logger.error('Missing code or state in callback');
      return res.redirect(`${FRONTEND_URL}/error?message=youtube_auth_invalid`);
    }
    
    // Decode and verify state
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
    } catch (e) {
      logger.error('Invalid state parameter:', e);
      return res.redirect(`${FRONTEND_URL}/error?message=youtube_auth_invalid_state`);
    }
    
    const { userId, timestamp } = stateData;
    
    // Verify state is not too old (10 minutes max)
    if (Date.now() - timestamp > 10 * 60 * 1000) {
      logger.error('State parameter expired');
      return res.redirect(`${FRONTEND_URL}/error?message=youtube_auth_expired`);
    }
    
    // Exchange authorization code for tokens
    logger.info(`[YouTube Music Auth] Exchanging code for tokens for user ${userId}`);
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: YOUTUBE_CLIENT_ID,
        client_secret: YOUTUBE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      logger.error('Token exchange failed:', errorData);
      return res.redirect(`${FRONTEND_URL}/error?message=youtube_token_exchange_failed`);
    }
    
    const tokenData = await tokenResponse.json();
    
    // Get user's channel/account ID from YouTube
    let platformUserId = userId; // Fallback
    let platformDisplayName = null;
    
    try {
      // Fetch user's YouTube channel info
      const channelResponse = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
        {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        }
      );
      
      if (channelResponse.ok) {
        const channelData = await channelResponse.json();
        if (channelData.items && channelData.items.length > 0) {
          platformUserId = channelData.items[0].id;
          platformDisplayName = channelData.items[0].snippet.title;
        }
      }
    } catch (error) {
      logger.warn('Could not fetch YouTube channel info:', error.message);
    }
    
    // Store tokens securely
    await storeTokens(userId, 'youtube_music', {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      platformUserId: platformUserId,
      platformDisplayName: platformDisplayName
    });
    
    logger.info(`[YouTube Music Auth] Tokens stored for user ${userId}`);
    
    // Fetch user's music data
    try {
      const adapter = new YouTubeMusicAdapter();
      const [artists, genres] = await Promise.all([
        adapter.getTopArtists(tokenData.access_token),
        adapter.getTopGenres(tokenData.access_token)
      ]);
      
      logger.info(`[YouTube Music] Found ${artists.length} artists and ${genres.length} genres`);
      
      // Update user's connected platforms
      const user = await User.findById(userId);
      if (!user) {
        logger.error('User not found:', userId);
        return res.redirect(`${FRONTEND_URL}/error?message=user_not_found`);
      }
      
      // Add to connected platforms
      if (!user.connectedPlatforms.includes('youtube_music')) {
        user.connectedPlatforms.push('youtube_music');
      }
      
      // Set as primary platform if it's the first one
      if (!user.primaryPlatform) {
        user.primaryPlatform = 'youtube_music';
      }
      
      // Store platform data
      if (!user.platformData) {
        user.platformData = {};
      }
      user.platformData.youtube_music = {
        artists,
        genres,
        lastSyncedAt: new Date()
      };
      
      await user.save();
      
      // Aggregate music data from all connected platforms
      logger.info(`[YouTube Music Auth] Aggregating music data for user ${userId}`);
      const aggregated = await MusicPlatformService.mergeUserMusicData(userId);
      logger.info(`[YouTube Music Auth] Aggregated ${aggregated.artists.length} artists and ${aggregated.genres.length} genres`);
      
      logger.info(`[YouTube Music Auth] Successfully connected for user ${userId}`);
      
      // Redirect to success page
      res.redirect(`${FRONTEND_URL}/connect-success?platform=youtube_music`);
      
    } catch (dataError) {
      logger.error('Error fetching YouTube Music data:', dataError);
      // Tokens are stored, but data fetch failed - user can retry sync
      res.redirect(`${FRONTEND_URL}/connect-success?platform=youtube_music&warning=sync_failed`);
    }
    
  } catch (error) {
    logger.error('Error in YouTube Music callback:', error);
    res.redirect(`${FRONTEND_URL}/error?message=youtube_callback_error`);
  }
});

/**
 * POST /auth/youtube-music/disconnect
 * Disconnects YouTube Music from user account
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
      p => p !== 'youtube_music'
    );
    
    // Clear primary platform if it was YouTube Music
    if (user.primaryPlatform === 'youtube_music') {
      user.primaryPlatform = user.connectedPlatforms[0] || null;
    }
    
    // Remove platform data
    if (user.platformData && user.platformData.youtube_music) {
      delete user.platformData.youtube_music;
    }
    
    await user.save();
    
    // Revoke token in database
    const { revokeConnection } = await import('../../services/tokenManagementService.js');
    await revokeConnection(userId, 'youtube_music');
    
    res.json({
      success: true,
      message: 'YouTube Music disconnected successfully'
    });
    
  } catch (error) {
    logger.error('Error disconnecting YouTube Music:', error);
    res.status(500).json({ 
      error: 'Failed to disconnect YouTube Music',
      message: error.message 
    });
  }
});

/**
 * POST /auth/youtube-music/sync
 * Re-syncs user's YouTube Music data
 */
router.post('/sync', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    // Get stored token (will auto-refresh if needed)
    const { getTokens } = await import('../../services/tokenManagementService.js');
    const tokens = await getTokens(userId, 'youtube_music');
    
    if (!tokens) {
      return res.status(401).json({ 
        error: 'YouTube Music not connected or token expired',
        requiresReauth: true 
      });
    }
    
    // Fetch fresh data
    const adapter = new YouTubeMusicAdapter();
    const [artists, genres] = await Promise.all([
      adapter.getTopArtists(tokens.accessToken),
      adapter.getTopGenres(tokens.accessToken)
    ]);
    
    // Update user data
    const user = await User.findById(userId);
    if (!user.platformData) {
      user.platformData = {};
    }
    user.platformData.youtube_music = {
      artists,
      genres,
      lastSyncedAt: new Date()
    };
    
    await user.save();
    
    // Aggregate music data from all connected platforms
    logger.info(`[YouTube Music Sync] Aggregating music data for user ${userId}`);
    const aggregated = await MusicPlatformService.mergeUserMusicData(userId);
    logger.info(`[YouTube Music Sync] Aggregated ${aggregated.artists.length} artists and ${aggregated.genres.length} genres`);
    
    res.json({
      success: true,
      message: 'YouTube Music data synced successfully',
      data: {
        artistCount: artists.length,
        genreCount: genres.length
      }
    });
    
  } catch (error) {
    logger.error('Error syncing YouTube Music:', error);
    res.status(500).json({ 
      error: 'Failed to sync YouTube Music data',
      message: error.message 
    });
  }
});

export default router;
