import User from '../models/user.js';

// Middleware to check if user has whitelist access
export const checkWhitelistAccess = async (req, res, next) => {
  try {
    // Get user ID from request (assuming it's set by auth middleware)
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }

    // Find user in database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check if user has access (allowedAccess is an array, check if it contains true)
    const hasAccess = user.allowedAccess && user.allowedAccess.includes(true);

    if (!hasAccess) {
      return res.status(403).json({
        message: 'Access denied. Your account is pending approval. Please check back in 24 hours.',
        waitlisted: true
      });
    }

    // User has access, continue to next middleware
    next();
  } catch (error) {
    console.error('Whitelist middleware error:', error);
    res.status(500).json({
      message: 'Server error checking access permissions'
    });
  }
};

// Middleware to grant whitelist access (admin only)
export const grantWhitelistAccess = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { approved } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Update allowedAccess
    user.allowedAccess = approved ? [true] : [false];
    await user.save();

    res.json({
      message: `User access ${approved ? 'granted' : 'revoked'} successfully`,
      user: {
        id: user._id,
        email: user.email,
        allowedAccess: user.allowedAccess
      }
    });
  } catch (error) {
    console.error('Grant whitelist error:', error);
    res.status(500).json({
      message: 'Server error updating access permissions'
    });
  }
};
