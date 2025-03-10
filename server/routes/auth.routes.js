// in your backend (assuming express)
// auth.routes.js or similar
import express from "express"
const router = express.Router();
import querystring  from 'querystring';
import crypto from 'crypto';
import dotenv from 'dotenv'
dotenv.config()

// your spotify api credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Ensure BACKEND_URL has https:// prefix
let BACKEND_URL = process.env.BACKEND_URL || 'https://melodymatch-production.up.railway.app';
if (BACKEND_URL && !BACKEND_URL.startsWith('http://') && !BACKEND_URL.startsWith('https://')) {
  BACKEND_URL = `https://${BACKEND_URL}`;
}

const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || `${BACKEND_URL}/auth/spotify/callback`;
const FRONTEND_URI = process.env.FRONTEND_URL || 'https://melody-match-flax.vercel.app';

// Log configuration on startup (remove sensitive data)
console.log('[Auth Config] REDIRECT_URI:', REDIRECT_URI);
console.log('[Auth Config] FRONTEND_URI:', FRONTEND_URI);


router.get('/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "user-library-read",
    "playlist-read-private"
];
  const redirect_uri = REDIRECT_URI;
  
  
  const authUrl = 'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scopes.join(' '),
        redirect_uri: redirect_uri,
        show_dialog: true
    });
    res.redirect(authUrl);
});



// Spotify OAuth callback handler
router.get('/spotify/callback', async (req, res) => {
  console.log('spotify callback received');
  const code = req.query.code;
  
  if (!code) {
    console.error('No authorization code received');
    return res.redirect(`${FRONTEND_URI}/error?message=no_code`);
  }

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      })
    });

    const data = await tokenResponse.json();
    console.log('Spotify token response received');
    
    if (data.access_token) {
      res.redirect(`${FRONTEND_URI}/standby?token=${data.access_token}`);
    } else {
      console.error('No access token in response:', data);
      res.redirect(`${FRONTEND_URI}/error?message=token_error`);
    }
  } catch (error) {
    console.error('Spotify callback error:', error);
    res.redirect(`${FRONTEND_URI}/error?message=callback_error`);
  }
});

router.get('/callback', async (req, res) => {
  console.log('spotify callback')
    const code = req.query.code;
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        },
        body: new URLSearchParams({
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
        })
    });
    const data = await response.json();
    res.redirect(`${FRONTEND_URI}/standby?token=${data.access_token}`);
});


export default router;