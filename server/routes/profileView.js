import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { 
  recordProfileView, 
  getProfileViewCount, 
  getRecentViewers 
} from '../controllers/profileView.js';

const router = express.Router();

// Record a profile view (protected)
router.post('/record', protect, recordProfileView);

// Get view count for a user
router.get('/count/:userId', protect, getProfileViewCount);

// Get recent viewers
router.get('/recent/:userId', protect, getRecentViewers);

export default router;
