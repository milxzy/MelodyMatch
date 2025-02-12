import ProfileView from '../models/profileView.js';

// Record a profile view
export const recordProfileView = async (req, res) => {
  try {
    const { viewedUserId } = req.body;
    const viewerUserId = req.user._id;

    // Don't record if user views their own profile
    if (viewedUserId === viewerUserId.toString()) {
      return res.status(200).json({ message: 'Own profile view not recorded' });
    }

    // Check if view was already recorded today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingView = await ProfileView.findOne({
      viewedUser: viewedUserId,
      viewerUser: viewerUserId,
      viewedAt: { $gte: today }
    });

    if (existingView) {
      return res.status(200).json({ message: 'View already recorded today' });
    }

    // Create new profile view
    const profileView = await ProfileView.create({
      viewedUser: viewedUserId,
      viewerUser: viewerUserId
    });

    res.status(201).json({ 
      message: 'Profile view recorded',
      profileView 
    });
  } catch (error) {
    console.error('Error recording profile view:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get profile view count for a user
export const getProfileViewCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const viewCount = await ProfileView.countDocuments({ 
      viewedUser: userId 
    });

    res.status(200).json({ 
      userId,
      viewCount 
    });
  } catch (error) {
    console.error('Error getting profile view count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent profile viewers
export const getRecentViewers = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const recentViews = await ProfileView.find({ viewedUser: userId })
      .sort({ viewedAt: -1 })
      .limit(limit)
      .populate('viewerUser', 'name profile_pic spotify_display_name');

    res.status(200).json({ 
      userId,
      recentViewers: recentViews 
    });
  } catch (error) {
    console.error('Error getting recent viewers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
