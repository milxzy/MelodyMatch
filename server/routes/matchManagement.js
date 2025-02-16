import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  unmatchUser,
  blockUser,
  unblockUser,
  reportUser,
  getBlockedUsers
} from '../controllers/matchManagement.js';

const router = express.Router();

// Match management routes
router.post('/unmatch', protect, unmatchUser);
router.post('/block', protect, blockUser);
router.post('/unblock', protect, unblockUser);
router.post('/report', protect, reportUser);
router.get('/blocked', protect, getBlockedUsers);

export default router;
