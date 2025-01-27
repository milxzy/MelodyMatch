// In your backend (assuming Express)
// auth.routes.js or similar
import express from "express"
const router = express.Router();
import querystring  from 'querystring';

// Your Spotify API credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.JWT_SECRET;
const REDIRECT_URI = 'http://localhost:5173/auth/callback'; // Change in production
const FRONTEND_URI = 'http://localhost:5173'; // Change in production

// Route to initiate Spotify login
router.get('/spotify/callback', async (req, res) => {
  const code = req.query.code;
  
  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      })
    });

    const data = await tokenResponse.json();
    
    // Instead of using hash, redirect with query parameters
    res.redirect(`${process.env.FRONTEND_URL}/standby?access_token=${data.access_token}&token_type=${data.token_type}&expires_in=${data.expires_in}`);
  } catch (error) {
    console.error('Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/error?message=Authentication failed`);
  }
});

export default router;