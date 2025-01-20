import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import { backendLogin,  makeAUser, registerUser, like, getUsers, createUser, getUser, getSingleUser, databaseLookup, addSpotifyArtists, addUserInfo, addSpotifyData, displayDashboard, getMatches } from '../controllers/user.js';

const router = express.Router();

// router.get('/', getUsers);

// router.post('/add', createUser);

// router.get('/:id', getUser);

// router.delete('/:id', deleteUser);

// router.patch('/:id', updateUser);

router.post('/makeauser', makeAUser)
// Login Route
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#'); // Generate JWT token
    res.json({ token });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user }); // Access user information from req.user
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
router.post('/registerUser', registerUser)
router.post('/backendlogin', backendLogin)




export default router;