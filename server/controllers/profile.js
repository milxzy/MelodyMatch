import User from '../models/user.js';
import logger from '../utils/logger.js';

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Fields that can be updated
    const allowedUpdates = [
      'name',
      'age',
      'gender',
      'profile_pic',
      'spotify_display_name'
    ];

    // Filter out fields that aren't allowed to be updated
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Don't allow empty name
    if (filteredUpdates.name !== undefined && !filteredUpdates.name.trim()) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user account (soft delete)
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { confirmDelete } = req.body;

    if (!confirmDelete) {
      return res.status(400).json({ 
        message: 'Please confirm account deletion' 
      });
    }

    // Soft delete - mark account as deleted but don't remove data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add isDeleted field if it doesn't exist
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user._id;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ message: 'Photo URL is required' });
    }

    // TODO: Add image validation and upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, just save the URL

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile_pic: photoUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile photo updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error('Error uploading profile photo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user preferences
export const getPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('preferences');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      preferences: user.preferences || {}
    });
  } catch (error) {
    logger.error('Error getting preferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user preferences
export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { preferences } = req.body;

    // Validate preferences structure
    const allowedPreferences = ['ageMin', 'ageMax', 'gender', 'distance'];
    const filteredPreferences = {};
    
    Object.keys(preferences || {}).forEach(key => {
      if (allowedPreferences.includes(key)) {
        filteredPreferences[key] = preferences[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { preferences: filteredPreferences },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Preferences updated successfully',
      preferences: updatedUser.preferences
    });
  } catch (error) {
    logger.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
