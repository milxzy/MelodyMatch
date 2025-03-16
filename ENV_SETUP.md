# Environment Variables Setup Guide

This document provides detailed instructions for setting up all required environment variables for the MelodyMatch multi-platform music integration.

## Backend Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

### Core Application Settings

```env
# Server Configuration
PORT=4000
NODE_ENV=production

# Database
CONNECTION_STRING=mongodb+srv://your-connection-string

# Session & JWT
SESSION_SECRET=your-session-secret-here
JWT_SECRET=your-jwt-secret-here
```

### Token Encryption (REQUIRED for Platform Integration)

```env
# AES-256-GCM encryption key for storing platform tokens
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
TOKEN_ENCRYPTION_KEY=your-64-character-hex-string-here
```

**How to generate:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Legacy Spotify OAuth (Deprecated - no longer functional)

```env
# Spotify API (DEPRECATED - blocked due to 250k MAU requirement)
CLIENT_ID=your-spotify-client-id
CLIENT_SECRET=your-spotify-client-secret
REDIRECT_URI=http://localhost:3000/callback
```

### Apple Music Integration (NEW - Phase 2)

**Prerequisites:**
1. Purchase Apple Developer Program membership ($99/year)
2. Create a MusicKit identifier in Apple Developer Console
3. Generate a private key (.p8 file)
4. Note your Team ID and Key ID

**Required Variables:**
```env
# Apple Music MusicKit Configuration
APPLE_TEAM_ID=your-10-character-team-id
APPLE_KEY_ID=your-10-character-key-id
APPLE_PRIVATE_KEY_PATH=/path/to/AuthKey_KEYID.p8

# Apple Music OAuth
APPLE_MUSIC_REDIRECT_URI=http://localhost:4000/auth/apple-music/callback
```

**Setup Steps:**
1. Go to https://developer.apple.com/account
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create a new MusicKit identifier
4. Generate a private key (download the .p8 file)
5. Store the .p8 file securely on your server
6. Copy Team ID from account page
7. Copy Key ID from the key you just created

### YouTube Music Integration (NEW - Phase 2)

**Prerequisites:**
1. Create a Google Cloud Project
2. Enable YouTube Data API v3
3. Configure OAuth 2.0 credentials
4. Add authorized redirect URIs

**Required Variables:**
```env
# YouTube Music OAuth (via Google Cloud)
YOUTUBE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your-google-oauth-client-secret
YOUTUBE_REDIRECT_URI=http://localhost:4000/auth/youtube-music/callback

# Python Microservice URL (for ytmusicapi)
PYTHON_SERVICE_URL=http://localhost:8000
```

**Setup Steps:**
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: Web application
6. Add authorized redirect URIs:
   - `http://localhost:4000/auth/youtube-music/callback` (development)
   - `https://your-domain.com/auth/youtube-music/callback` (production)
7. Copy Client ID and Client Secret

### CORS Configuration

```env
# Frontend URL for CORS (comma-separated for multiple)
FRONTEND_URL=http://localhost:5173,http://localhost:3000
```

### Complete Backend .env Example

```env
# Core
PORT=4000
NODE_ENV=development
CONNECTION_STRING=mongodb+srv://user:pass@cluster.mongodb.net/melodymatch

# Security
SESSION_SECRET=your-very-secure-session-secret-min-32-chars
JWT_SECRET=your-very-secure-jwt-secret-min-32-chars
TOKEN_ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

# Apple Music
APPLE_TEAM_ID=ABCD123456
APPLE_KEY_ID=XYZ9876543
APPLE_PRIVATE_KEY_PATH=/app/certs/AuthKey_XYZ9876543.p8
APPLE_MUSIC_REDIRECT_URI=http://localhost:4000/auth/apple-music/callback

# YouTube Music
YOUTUBE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
YOUTUBE_REDIRECT_URI=http://localhost:4000/auth/youtube-music/callback
PYTHON_SERVICE_URL=http://localhost:8000

# CORS
FRONTEND_URL=http://localhost:5173

# Legacy Spotify (deprecated)
CLIENT_ID=your-spotify-client-id
CLIENT_SECRET=your-spotify-client-secret
REDIRECT_URI=http://localhost:3000/callback
```

---

## Frontend Environment Variables

Create a `.env` file in the `client/` directory with the following variables:

### API Configuration

```env
# Backend API URL
VITE_API_URL=http://localhost:4000
```

### Platform Feature Flags

```env
# Enable/disable platform integrations
VITE_APPLE_MUSIC_ENABLED=true
VITE_YOUTUBE_MUSIC_ENABLED=true
VITE_SPOTIFY_ENABLED=false
```

### Apple Music MusicKit (Client-side)

```env
# Apple MusicKit JS - Team ID for client-side initialization
VITE_APPLE_TEAM_ID=ABCD123456
```

### Complete Frontend .env Example

```env
# API
VITE_API_URL=http://localhost:4000

# Platform Features
VITE_APPLE_MUSIC_ENABLED=true
VITE_YOUTUBE_MUSIC_ENABLED=true
VITE_SPOTIFY_ENABLED=false

# Apple Music
VITE_APPLE_TEAM_ID=ABCD123456
```

---

## Python Microservice Environment Variables

Create a `.env` file in the `server/python-services/youtube-music/` directory:

```env
# YouTube Music Python Service
YOUTUBE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
YOUTUBE_REDIRECT_URI=http://localhost:4000/auth/youtube-music/callback

# Service Configuration
PORT=8000
NODE_SERVICE_URL=http://localhost:4000
```

---

## Production Deployment (Railway)

### Backend Service Environment Variables

In Railway dashboard for your Node.js service, add:

```
PORT=4000
NODE_ENV=production
CONNECTION_STRING=${{MONGODB_CONNECTION_STRING}}
SESSION_SECRET=${{RAILWAY_GENERATED_SESSION_SECRET}}
JWT_SECRET=${{RAILWAY_GENERATED_JWT_SECRET}}
TOKEN_ENCRYPTION_KEY=${{RAILWAY_GENERATED_ENCRYPTION_KEY}}

APPLE_TEAM_ID=ABCD123456
APPLE_KEY_ID=XYZ9876543
APPLE_PRIVATE_KEY_PATH=/app/certs/AuthKey_XYZ9876543.p8
APPLE_MUSIC_REDIRECT_URI=https://melodymatch-production.up.railway.app/auth/apple-music/callback

YOUTUBE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
YOUTUBE_REDIRECT_URI=https://melodymatch-production.up.railway.app/auth/youtube-music/callback
PYTHON_SERVICE_URL=${{PYTHON_SERVICE_INTERNAL_URL}}

FRONTEND_URL=https://melodymatch.app,https://www.melodymatch.app
```

### Python Service Environment Variables

In Railway dashboard for your Python service, add:

```
PORT=8000
YOUTUBE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
YOUTUBE_REDIRECT_URI=https://melodymatch-production.up.railway.app/auth/youtube-music/callback
NODE_SERVICE_URL=https://melodymatch-production.up.railway.app
```

### Frontend Service Environment Variables

In Railway/Vercel dashboard for your frontend, add:

```
VITE_API_URL=https://melodymatch-production.up.railway.app
VITE_APPLE_MUSIC_ENABLED=true
VITE_YOUTUBE_MUSIC_ENABLED=true
VITE_SPOTIFY_ENABLED=false
VITE_APPLE_TEAM_ID=ABCD123456
```

---

## Security Notes

### Sensitive Files
- **Never commit** `.env` files to version control
- **Never commit** Apple private key (.p8) files
- Use `.gitignore` to exclude:
  - `.env`
  - `.env.local`
  - `.env.production`
  - `*.p8`
  - `certs/`

### Key Generation Best Practices
1. Use cryptographically secure random generators
2. Minimum 32 characters for secrets
3. Use different secrets for development and production
4. Rotate secrets regularly (every 90 days recommended)

### Railway Secret Storage
- Use Railway's built-in secret variables feature
- For private keys, use Railway's file storage or mount volumes
- Never hardcode secrets in Dockerfile or source code

---

## Testing Configuration

### Development Testing

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev

# Python Service
cd server/python-services/youtube-music
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Environment Variable Validation

Check if all required variables are set:

```bash
# Backend
node -e "console.log('All env vars:', Object.keys(process.env).filter(k => !k.startsWith('npm_')).sort())"

# Frontend (in browser console after dev server starts)
console.log('Vite env:', import.meta.env)
```

---

## Troubleshooting

### Issue: "TOKEN_ENCRYPTION_KEY is not set"
**Solution:** Generate a 32-byte hex string using the command provided above

### Issue: "Apple Music: Invalid token"
**Solution:** 
1. Verify APPLE_TEAM_ID, APPLE_KEY_ID are correct (10 characters each)
2. Check .p8 file path is accessible by the server process
3. Ensure .p8 file permissions are readable (chmod 600)

### Issue: "YouTube OAuth redirect_uri_mismatch"
**Solution:** 
1. Go to Google Cloud Console
2. Add exact redirect URI to OAuth client configuration
3. Ensure no trailing slashes
4. Wait 5 minutes for changes to propagate

### Issue: Python service cannot connect
**Solution:**
1. Verify PYTHON_SERVICE_URL is correct
2. Check if Python service is running (curl http://localhost:8000/health)
3. Ensure firewall allows internal service communication

---

## Next Steps

After setting up environment variables:

1. ✅ Generate TOKEN_ENCRYPTION_KEY
2. ✅ Set up Apple Developer account and MusicKit
3. ✅ Create Google Cloud project and OAuth credentials
4. ✅ Deploy Python microservice to Railway
5. ✅ Test Apple Music connection flow
6. ✅ Test YouTube Music connection flow
7. ✅ Test migration wizard with test users

---

## Support

For issues with:
- **Apple Music setup:** https://developer.apple.com/documentation/applemusicapi
- **YouTube Music OAuth:** https://console.cloud.google.com/apis/credentials
- **Railway deployment:** https://docs.railway.app
- **General questions:** Create an issue in the repository
