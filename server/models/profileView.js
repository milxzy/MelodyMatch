import mongoose from 'mongoose';

const profileViewSchema = new mongoose.Schema({
  viewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  viewerUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate views from being counted multiple times per day
profileViewSchema.index({ viewedUser: 1, viewerUser: 1, viewedAt: 1 });

const ProfileView = mongoose.model('ProfileView', profileViewSchema);

export default ProfileView;
