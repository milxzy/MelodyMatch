import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import { backendLogin,  makeAUser, registerUser, like, getUsers, createUser, getUser, getSingleUser, databaseLookup, addSpotifyArtists, addUserInfo, addSpotifyData, displayDashboard, getMatches } from '../controllers/user.js';

const router = express.Router();

// router.get('/', getusers);

// router.post('/add', createuser);

// router.get('/:id', getuser);

// router.delete('/:id', deleteuser);

// router.patch('/:id', updateuser);

router.post('/makeauser', makeAUser)
// login route
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#'); // generate jwt token
    res.json({ token });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user }); // access user information from req.user
});

router.post('/like', like)

router.get('/dashboard', displayDashboard)
router.get('/getMatches/:userId', getMatches)

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
router.post('/registerUser', registerUser)
router.post('/backendlogin', backendLogin)




export default router;