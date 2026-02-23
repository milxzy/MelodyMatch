# env setup

## server/.env

```env
PORT=4000
NODE_ENV=development
CONNECTION_STRING=mongodb+srv://your-connection-string

SESSION_SECRET=some-long-random-string
JWT_SECRET=another-long-random-string

# generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
TOKEN_ENCRYPTION_KEY=64-char-hex-string

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
```

### apple music

you need an apple developer account ($99/yr). go to developer.apple.com, make a MusicKit identifier, download the .p8 key file.

```env
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY_PATH=./keys/AuthKey.p8
APPLE_MUSIC_REDIRECT_URI=http://localhost:4000/auth/apple-music/callback
```

### youtube music

set up a google cloud project, enable youtube data api v3, create oauth credentials.

```env
YOUTUBE_CLIENT_ID=your-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your-secret
YOUTUBE_REDIRECT_URI=http://localhost:4000/auth/youtube-music/callback
PYTHON_SERVICE_URL=http://localhost:8000
```

### legacy spotify (deprecated, doesn't work anymore)

```env
CLIENT_ID=your-spotify-client-id
CLIENT_SECRET=your-spotify-client-secret
REDIRECT_URI=http://localhost:3000/callback
```

## client/.env

```env
VITE_API_URL=http://localhost:4000
VITE_APPLE_MUSIC_ENABLED=true
VITE_YOUTUBE_MUSIC_ENABLED=true
VITE_SPOTIFY_ENABLED=false
VITE_APPLE_TEAM_ID=your-team-id
```

## python service (server/python-services/youtube-music/.env)

```env
YOUTUBE_CLIENT_ID=same-as-above
YOUTUBE_CLIENT_SECRET=same-as-above
YOUTUBE_REDIRECT_URI=http://localhost:4000/auth/youtube-music/callback
PORT=8000
NODE_SERVICE_URL=http://localhost:4000
```

## production

for railway just set the same vars in the dashboard. swap localhost urls for your actual domains. don't forget to update the oauth redirect URIs in apple/google consoles too.
