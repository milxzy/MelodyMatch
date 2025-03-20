import User from '../models/user.js';
import Match from '../models/matches.js';
import logger from '../utils/logger.js';

// Unmatch with a user
export const unmatchUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required' });
    }

    // Remove from both users' liked lists
    await User.findByIdAndUpdate(userId, {
      $pull: { likedUsers: targetUserId, likedBy: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { likedUsers: userId, likedBy: userId }
    });

    // Delete the match
    await Match.deleteOne({
      $or: [
        { user1: userId, user2: targetUserId },
        { user1: targetUserId, user2: userId }
      ]
    });

    res.status(200).json({
      message: 'Unmatched successfully'
    });
  } catch (error) {
    logger.error('Error unmatching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Block a user
export const blockUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required' });
    }

    // Can't block yourself
    if (userId.toString() === targetUserId) {
      return res.status(400).json({ message: 'Cannot block yourself' });
    }

    // Add to blocked users list
    const user = await User.findById(userId);
    
    if (!user.blockedUsers) {
      user.blockedUsers = [];
    }

    if (user.blockedUsers.includes(targetUserId)) {
      return res.status(400).json({ message: 'User already blocked' });
    }

    user.blockedUsers.push(targetUserId);
    await user.save();

    // Also unmatch if they were matched
    await User.findByIdAndUpdate(userId, {
      $pull: { likedUsers: targetUserId, likedBy: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { likedUsers: userId, likedBy: userId }
    });

    await Match.deleteOne({
      $or: [
        { user1: userId, user2: targetUserId },
        { user1: targetUserId, user2: userId }
      ]
    });

    res.status(200).json({
      message: 'User blocked successfully'
    });
  } catch (error) {
    logger.error('Error blocking user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Unblock a user
export const unblockUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.body;

    await User.findByIdAndUpdate(userId, {
      $pull: { blockedUsers: targetUserId }
    });

    res.status(200).json({
      message: 'User unblocked successfully'
    });
  } catch (error) {
    logger.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Report a user
export const reportUser = async (req, res) => {
  try {
    const reporterId = req.user._id;
    const { targetUserId, reason, description } = req.body;

    if (!targetUserId || !reason) {
      return res.status(400).json({ 
        message: 'Target user ID and reason are required' 
      });
    }

    // TODO: Create Report model and save report
    logger.info(`User ${reporterId} reported user ${targetUserId} for: ${reason}`);

    // In production, you would:
    // 1. Save to a Report model
    // 2. Notify moderators
    // 3. Potentially auto-block based on number of reports

    res.status(200).json({
      message: 'Report submitted successfully. Our team will review it.'
    });
  } catch (error) {
    logger.error('Error reporting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get blocked users list
export const getBlockedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate('blockedUsers', 'name profile_pic spotify_display_name');

    res.status(200).json({
      blockedUsers: user.blockedUsers || []
    });
  } catch (error) {
    logger.error('Error getting blocked users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
