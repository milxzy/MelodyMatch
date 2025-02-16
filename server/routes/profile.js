import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  updateProfile,
  deleteAccount,
  uploadProfilePhoto,
  getPreferences,
  updatePreferences
} from '../controllers/profile.js';

const router = express.Router();

// Profile management routes
router.put('/update', protect, updateProfile);
router.delete('/delete', protect, deleteAccount);
router.post('/upload-photo', protect, uploadProfilePhoto);

// Preferences routes
router.get('/preferences', protect, getPreferences);
router.put('/preferences', protect, updatePreferences);

export default router;
