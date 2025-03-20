import express from 'express';
import User from '../../models/user.js';
import UserMusicPlatform from '../../models/userMusicPlatform.js';
import { getUserPlatforms, getTokens, revokeConnection } from '../../services/tokenManagementService.js';
import MusicPlatformService from '../../services/musicPlatformService.js';

const router = express.Router();

/**
 * GET /auth/platforms/connected
 * Returns all connected platforms for a user
 */
router.get('/connected', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }
    
    const user = await User.findById(userId).select('connectedPlatforms primaryPlatform platformData');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get platform details
    const platforms = await getUserPlatforms(userId);
    
    // Format response with additional metadata
    const platformDetails = platforms.map(p => {
      const platformData = user.platformData?.[p.platform];
      
      return {
        platform: p.platform,
        isPrimary: user.primaryPlatform === p.platform,
        lastSyncedAt: p.lastSynced,
        tokenExpiry: p.tokenExpiry,
        artistCount: platformData?.artists?.length || 0,
        genreCount: platformData?.genres?.length || 0,
        needsReauth: p.tokenExpiry ? p.tokenExpiry < new Date() : false
      };
    });
    
    res.json({
      success: true,
      platforms: platformDetails,
      primaryPlatform: user.primaryPlatform
    });
    
  } catch (error) {
    console.error('Error fetching connected platforms:', error);
    res.status(500).json({ 
      error: 'Failed to fetch connected platforms',
      message: error.message 
    });
  }
});

/**
 * POST /auth/platforms/set-primary
 * Sets a platform as the user's primary platform
 */
router.post('/set-primary', async (req, res) => {
  try {
    const { userId, platform } = req.body;
    
    if (!userId || !platform) {
      return res.status(400).json({ error: 'Missing userId or platform' });
    }
    
    // Validate platform
    const validPlatforms = ['apple_music', 'youtube_music', 'spotify'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ 
        error: 'Invalid platform',
        validPlatforms 
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log(`[Set Primary] User ${userId} has connected platforms:`, user.connectedPlatforms);
    console.log(`[Set Primary] Attempting to set ${platform} as primary`);
    
    // Check if platform is connected
    if (!user.connectedPlatforms.includes(platform)) {
      return res.status(400).json({ 
        error: 'Platform not connected',
        message: `You must connect ${platform} before setting it as primary`,
        currentPlatforms: user.connectedPlatforms
      });
    }
    
    user.primaryPlatform = platform;
    await user.save();
    
    console.log(`[Platform Manager] User ${userId} set ${platform} as primary`);
    
    res.json({
      success: true,
      message: 'Primary platform updated',
      primaryPlatform: platform
    });
    
  } catch (error) {
    console.error('Error setting primary platform:', error);
    res.status(500).json({ 
      error: 'Failed to set primary platform',
      message: error.message 
    });
  }
});

/**
 * POST /auth/platforms/sync
 * Re-syncs music data for one or all platforms
 */
router.post('/sync', async (req, res) => {
  try {
    const { userId, platform } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Determine which platforms to sync
    const platformsToSync = platform 
      ? [platform] 
      : user.connectedPlatforms;
    
    if (platformsToSync.length === 0) {
      return res.status(400).json({ 
        error: 'No platforms connected',
        message: 'Please connect at least one music platform' 
      });
    }
    
    const syncResults = [];
    const errors = [];
    
    // Sync each platform
    for (const platformName of platformsToSync) {
      try {
        console.log(`[Platform Manager] Syncing ${platformName} for user ${userId}`);
        
        // Get tokens (will auto-refresh if needed)
        const tokens = await getTokens(userId, platformName);
        
        if (!tokens) {
          errors.push({
            platform: platformName,
            error: 'Token not found or expired',
            requiresReauth: true
          });
          continue;
        }
        
        // Fetch fresh data using the platform service
        const [artists, genres] = await Promise.all([
          MusicPlatformService.fetchUserArtists(platformName, tokens.accessToken),
          MusicPlatformService.fetchUserGenres(platformName, tokens.accessToken)
        ]);
        
        console.log(`[Platform Manager] Fetched ${artists.length} artists and ${genres.length} genres for ${platformName}`);
        
        // Update user's platform data
        if (!user.platformData) {
          user.platformData = {};
        }
        
        user.platformData[platformName] = {
          artists,
          genres,
          lastSyncedAt: new Date()
        };
        
        console.log(`[Platform Manager] Saved to platformData.${platformName}: ${artists.length} artists, ${genres.length} genres`);
        
        // Update last synced timestamp in UserMusicPlatform
        await UserMusicPlatform.findOneAndUpdate(
          { userId, platform: platformName },
          { lastSynced: new Date() }
        );
        
        syncResults.push({
          platform: platformName,
          success: true,
          artistCount: artists.length,
          genreCount: genres.length
        });
        
      } catch (error) {
        console.error(`Error syncing ${platformName}:`, error);
        errors.push({
          platform: platformName,
          error: error.message,
          requiresReauth: error.message.includes('401') || error.message.includes('token')
        });
      }
    }
    
    // Aggregate data from all platforms
    console.log(`[Platform Manager] Aggregating data for user ${userId}...`);
    const aggregated = await MusicPlatformService.aggregateUserData(userId);
    console.log(`[Platform Manager] Aggregated ${aggregated.artists.length} artists and ${aggregated.genres.length} genres`);
    await user.save();
    console.log(`[Platform Manager] Saved user document`);
    
    console.log(`[Platform Manager] Sync completed for user ${userId}`);
    
    res.json({
      success: syncResults.length > 0,
      message: `Synced ${syncResults.length} platform(s)`,
      results: syncResults,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error syncing platforms:', error);
    res.status(500).json({ 
      error: 'Failed to sync platforms',
      message: error.message 
    });
  }
});

/**
 * DELETE /auth/platforms/:platform
 * Disconnects a specific platform from user account
 */
router.delete('/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if platform is connected
    if (!user.connectedPlatforms.includes(platform)) {
      return res.status(400).json({ 
        error: 'Platform not connected',
        message: `${platform} is not connected to this account` 
      });
    }
    
    // Remove from connected platforms
    user.connectedPlatforms = user.connectedPlatforms.filter(
      p => p !== platform
    );
    
    // Clear primary platform if it was the disconnected one
    if (user.primaryPlatform === platform) {
      user.primaryPlatform = user.connectedPlatforms[0] || null;
    }
    
    // Remove platform data
    if (user.platformData && user.platformData[platform]) {
      delete user.platformData[platform];
    }
    
    // If no platforms left, clear aggregated data
    if (user.connectedPlatforms.length === 0) {
      user.aggregatedArtists = [];
      user.aggregatedGenres = [];
      user.hasCompletedMigration = false;
    } else {
      // Re-aggregate data from remaining platforms
      await MusicPlatformService.aggregateUserData(userId);
    }
    
    await user.save();
    
    // Revoke token in database
    await revokeConnection(userId, platform);
    
    console.log(`[Platform Manager] Disconnected ${platform} for user ${userId}`);
    
    res.json({
      success: true,
      message: `${platform} disconnected successfully`,
      remainingPlatforms: user.connectedPlatforms,
      newPrimaryPlatform: user.primaryPlatform
    });
    
  } catch (error) {
    console.error('Error disconnecting platform:', error);
    res.status(500).json({ 
      error: 'Failed to disconnect platform',
      message: error.message 
    });
  }
});

/**
 * POST /auth/platforms/:platform/force-disconnect
 * Force disconnect a platform without validation (for debugging/cleanup)
 */
router.post('/:platform/force-disconnect', async (req, res) => {
  try {
    const { platform } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Force remove from connected platforms
    user.connectedPlatforms = user.connectedPlatforms.filter(
      p => p !== platform
    );
    
    // Clear primary platform if it was the disconnected one
    if (user.primaryPlatform === platform) {
      user.primaryPlatform = user.connectedPlatforms[0] || null;
    }
    
    // Remove platform data
    if (user.platformData && user.platformData[platform]) {
      delete user.platformData[platform];
    }
    
    // If no platforms left, clear aggregated data
    if (user.connectedPlatforms.length === 0) {
      user.aggregatedArtists = [];
      user.aggregatedGenres = [];
      user.hasCompletedMigration = false;
    }
    
    await user.save();
    
    // Try to revoke token (don't fail if it doesn't exist)
    try {
      await revokeConnection(userId, platform);
    } catch (err) {
      console.log(`Token revocation failed (may not exist): ${err.message}`);
    }
    
    console.log(`[Platform Manager] Force disconnected ${platform} for user ${userId}`);
    
    res.json({
      success: true,
      message: `${platform} force disconnected successfully`,
      remainingPlatforms: user.connectedPlatforms
    });
    
  } catch (error) {
    console.error('Error force disconnecting platform:', error);
    res.status(500).json({ 
      error: 'Failed to force disconnect platform',
      message: error.message 
    });
  }
});

/**
 * GET /auth/platforms/status
 * Returns overall platform connection status and migration status
 */
router.get('/status', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }
    
    const user = await User.findById(userId).select(
      'connectedPlatforms primaryPlatform hasCompletedMigration aggregatedArtists aggregatedGenres'
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const hasAnyPlatform = user.connectedPlatforms.length > 0;
    const needsMigration = !user.hasCompletedMigration && hasAnyPlatform === false;
    
    res.json({
      success: true,
      status: {
        hasAnyPlatform,
        connectedCount: user.connectedPlatforms.length,
        platforms: user.connectedPlatforms,
        primaryPlatform: user.primaryPlatform,
        hasCompletedMigration: user.hasCompletedMigration,
        needsMigration,
        aggregatedData: {
          artistCount: user.aggregatedArtists?.length || 0,
          genreCount: user.aggregatedGenres?.length || 0
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching platform status:', error);
    res.status(500).json({ 
      error: 'Failed to fetch platform status',
      message: error.message 
    });
  }
});

/**
 * POST /auth/platforms/complete-migration
 * Marks user as having completed migration
 */
router.post('/complete-migration', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify user has at least one platform connected
    if (user.connectedPlatforms.length === 0) {
      return res.status(400).json({ 
        error: 'No platforms connected',
        message: 'You must connect at least one music platform to complete migration' 
      });
    }
    
    user.hasCompletedMigration = true;
    user.migrationDate = new Date();
    await user.save();
    
    console.log(`[Platform Manager] User ${userId} completed migration`);
    
    res.json({
      success: true,
      message: 'Migration completed successfully',
      connectedPlatforms: user.connectedPlatforms
    });
    
  } catch (error) {
    console.error('Error completing migration:', error);
    res.status(500).json({ 
      error: 'Failed to complete migration',
      message: error.message 
    });
  }
});

export default router;
