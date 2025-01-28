// In your backend (assuming Express)
// auth.routes.js or similar
import express from "express"
const router = express.Router();
import querystring  from 'querystring';
import crypto from 'crypto';
import dotenv from 'dotenv'
dotenv.config()
// console.log('All env variables:', process.env);

// Your Spotify API credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
console.log(CLIENT_SECRET)
const REDIRECT_URI = 'https://melodymatch-3ro0.onrender.com/auth/spotify/callback'; // Change in production
//const FRONTEND_URI = 'https://melody-match-flax.vercel.app'; // Change in production


router.get('/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "user-library-read",
    "playlist-read-private"
];
  const redirect_uri = 'https://melodymatch-3ro0.onrender.com/auth/spotify/callback'; // Change in production
  let encodedRedirectUri = encodeURIComponent(redirect_uri);
  
  const authUrl = 'https://accounts.spotify.com/authorize?' + 
    new URLSearchParams({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scopes.join(' '),
        redirect_uri: encodedRedirectUri,
        show_dialog: true
    });
    res.redirect(authUrl);
});



// Route to initiate Spotify login
router.get('/spotify/callback', async (req, res) => {
  console.log('spotify callback')
  const  code  = req.query.code;
  console.log(code)
  console.log('id : ' + CLIENT_ID)
  console.log('secret: ' + CLIENT_SECRET)
   // const redirect_uri = 'https://melodymatch-3ro0.onrender.com/auth/spotify/callback';
  // if (!state) {
  //   return res.redirect(`localhost:5173/error?message=state_mismatch`);
  // }
  
  const redirectUri = 'https://melodymatch-3ro0.onrender.com/auth/spotify/callback'
 let encodedRedirectUri = encodeURIComponent(redirectUri);

  
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          `8fbcd37be4d04871bc6e482ea4b64807:066df6cb08d242e7b3d025c5d82d3696`
        ).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: encodedRedirectUri,
      })
    });

     const data = await tokenResponse.json();
     console.log(data)
    
    // Redirect to frontend with tokens
      if (data.access_token) {
        res.redirect(`https://melody-match-flax.vercel.app/standby?token=${data.access_token}`);
    } else {
        // Handle the error case
        res.redirect(`https://melody-match-flax.vercel.app/error`);
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
    res.redirect(`https://melody-match-flax.vercel.app/standby?token=${data.access_token}`);
});


export default router;