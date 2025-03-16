import User from '../models/user.js';

/**
 * Middleware to enforce platform migration
 * Blocks access to protected routes if user hasn't connected a music platform
 * 
 * Usage:
 *   router.get('/some-route', requireMigration, routeHandler);
 */
export const requireMigration = async (req, res, next) => {
  try {
    // Extract user ID from request (adjust based on your auth implementation)
    const userId = req.user?.id || req.user?._id || req.body?.userId || req.query?.userId;
    
    if (!userId) {
      return res.status(401).json({
        error: 'AUTHENTICATION_REQUIRED',
        message: 'You must be logged in to access this resource'
      });
    }
    
    // Fetch user from database
    const user = await User.findById(userId).select('hasCompletedMigration connectedPlatforms');
    
    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'User account not found'
      });
    }
    
    // Check if user has completed migration
    // Migration is complete if:
    // 1. hasCompletedMigration is true, OR
    // 2. User has at least one connected platform
    const hasPlatforms = user.connectedPlatforms && user.connectedPlatforms.length > 0;
    const migrationComplete = user.hasCompletedMigration || hasPlatforms;
    
    if (!migrationComplete) {
      return res.status(403).json({
        error: 'MIGRATION_REQUIRED',
        message: 'Please connect a music platform to continue using MelodyMatch',
        redirectTo: '/migrate',
        details: {
          hasCompletedMigration: user.hasCompletedMigration,
          connectedPlatforms: user.connectedPlatforms || [],
          availablePlatforms: ['apple_music', 'youtube_music']
        }
      });
    }
    
    // Migration complete, proceed to next middleware/route
    next();
    
  } catch (error) {
    console.error('Error in requireMigration middleware:', error);
    res.status(500).json({
      error: 'MIGRATION_CHECK_FAILED',
      message: 'Failed to verify migration status',
      details: error.message
    });
  }
};

/**
 * Soft migration check - warns but doesn't block
 * Useful for gradual rollout or non-critical routes
 * 
 * Usage:
 *   router.get('/some-route', warnMigration, routeHandler);
 */
export const warnMigration = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || req.body?.userId || req.query?.userId;
    
    if (!userId) {
      return next();
    }
    
    const user = await User.findById(userId).select('hasCompletedMigration connectedPlatforms');
    
    if (!user) {
      return next();
    }
    
    const hasPlatforms = user.connectedPlatforms && user.connectedPlatforms.length > 0;
    const migrationComplete = user.hasCompletedMigration || hasPlatforms;
    
    if (!migrationComplete) {
      // Add warning to response (will be included in JSON responses)
      req.migrationWarning = {
        needsMigration: true,
        message: 'Please connect a music platform for the best experience',
        redirectTo: '/migrate'
      };
    }
    
    next();
    
  } catch (error) {
    console.error('Error in warnMigration middleware:', error);
    next(); // Don't block on errors in soft check
  }
};

/**
 * Middleware to check if specific platform is connected
 * 
 * Usage:
 *   router.get('/apple-music-feature', requirePlatform('apple_music'), routeHandler);
 */
export const requirePlatform = (platformName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id || req.user?._id || req.body?.userId || req.query?.userId;
      
      if (!userId) {
        return res.status(401).json({
          error: 'AUTHENTICATION_REQUIRED',
          message: 'You must be logged in to access this resource'
        });
      }
      
      const user = await User.findById(userId).select('connectedPlatforms');
      
      if (!user) {
        return res.status(404).json({
          error: 'USER_NOT_FOUND',
          message: 'User account not found'
        });
      }
      
      const hasPlatform = user.connectedPlatforms && 
                          user.connectedPlatforms.includes(platformName);
      
      if (!hasPlatform) {
        return res.status(403).json({
          error: 'PLATFORM_NOT_CONNECTED',
          message: `This feature requires ${platformName} to be connected`,
          requiredPlatform: platformName,
          connectedPlatforms: user.connectedPlatforms || []
        });
      }
      
      next();
      
    } catch (error) {
      console.error(`Error in requirePlatform(${platformName}) middleware:`, error);
      res.status(500).json({
        error: 'PLATFORM_CHECK_FAILED',
        message: 'Failed to verify platform connection',
        details: error.message
      });
    }
  };
};

/**
 * Middleware to enforce minimum number of connected platforms
 * Useful for features that work better with multiple platforms
 * 
 * Usage:
 *   router.get('/premium-feature', requireMinPlatforms(2), routeHandler);
 */
export const requireMinPlatforms = (minCount) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id || req.user?._id || req.body?.userId || req.query?.userId;
      
      if (!userId) {
        return res.status(401).json({
          error: 'AUTHENTICATION_REQUIRED',
          message: 'You must be logged in to access this resource'
        });
      }
      
      const user = await User.findById(userId).select('connectedPlatforms');
      
      if (!user) {
        return res.status(404).json({
          error: 'USER_NOT_FOUND',
          message: 'User account not found'
        });
      }
      
      const platformCount = user.connectedPlatforms ? user.connectedPlatforms.length : 0;
      
      if (platformCount < minCount) {
        return res.status(403).json({
          error: 'INSUFFICIENT_PLATFORMS',
          message: `This feature requires at least ${minCount} connected platform(s)`,
          currentCount: platformCount,
          requiredCount: minCount,
          connectedPlatforms: user.connectedPlatforms || []
        });
      }
      
      next();
      
    } catch (error) {
      console.error(`Error in requireMinPlatforms(${minCount}) middleware:`, error);
      res.status(500).json({
        error: 'PLATFORM_COUNT_CHECK_FAILED',
        message: 'Failed to verify platform count',
        details: error.message
      });
    }
  };
};

export default {
  requireMigration,
  warnMigration,
  requirePlatform,
  requireMinPlatforms
};
