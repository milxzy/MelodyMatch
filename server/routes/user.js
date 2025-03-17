import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { authLimiter, actionLimiter } from '../middlewares/rateLimiter.js';
import { protect } from '../middlewares/authMiddleware.js';

import { backendLogin,  makeAUser, registerUser, like, getUsers, createUser, getUser, getSingleUser, databaseLookup, addSpotifyArtists, addUserInfo, addSpotifyData, displayDashboard, getMatches, updateUserProfile } from '../controllers/user.js';

const router = express.Router();

// POST routes
router.post('/makeauser', authLimiter, makeAUser)
router.post('/registerUser', authLimiter, registerUser)
router.post('/backendlogin', authLimiter, backendLogin)

// Login route with passport
router.post('/login', authLimiter, passport.authenticate('local', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    res.json({ token });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

router.post('/like', protect, actionLimiter, like)

router.get('/dashboard', protect, displayDashboard)
router.get('/getMatches/:userId', protect, getMatches)

router.post('/addUserInfo', addUserInfo)
router.post('/addSpotifyData', addSpotifyData)
router.post('/addSpotifyArtists', addSpotifyArtists)
router.get('/databaseLookup', databaseLookup)
router.get('/getSingleUser', getSingleUser)
router.get('/getUsers', getUsers)
router.get('/getUserById/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await import('../models/user.js').then(m => m.default.findById(userId));
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('error fetching user:', error);
    res.status(500).json({ error: 'internal server error' });
  }
})

router.put('/updateUserProfile', actionLimiter, updateUserProfile)




export default router;
