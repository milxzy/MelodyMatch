import express from 'express';
import appleMusicAuth from './appleMusicAuth.js';
import youtubeMusicAuth from './youtubeMusicAuth.js';
import platformManager from './platformManager.js';

const router = express.Router();

// Apple Music OAuth routes
router.use('/apple-music', appleMusicAuth);

// YouTube Music OAuth routes
router.use('/youtube-music', youtubeMusicAuth);

// Platform management routes
router.use('/platforms', platformManager);

// Health check for auth service
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    services: {
      apple_music: process.env.APPLE_TEAM_ID ? 'configured' : 'not_configured',
      youtube_music: process.env.YOUTUBE_CLIENT_ID ? 'configured' : 'not_configured'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
