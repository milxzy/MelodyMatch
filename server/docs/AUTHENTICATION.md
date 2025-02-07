# Authentication Flow

## Overview

MelodyMatch uses a hybrid authentication system:
1. **Primary**: Spotify OAuth for seamless music integration
2. **Secondary**: Local email/password authentication with JWT

## Authentication Methods

### 1. Spotify OAuth (Recommended)
- Users authenticate via Spotify
- Automatically imports music preferences
- No password management required

**Flow:**
1. User clicks "Login with Spotify"
2. Redirected to Spotify authorization
3. After approval, redirected back with auth code
4. Backend exchanges code for access token
5. JWT token issued for app sessions

### 2. Email/Password Authentication
- Traditional username/password
- JWT-based session management
- Password hashing with bcrypt (10 salt rounds)

**Flow:**
1. User registers with email/password
2. Password hashed and stored
3. On login, password verified
4. JWT token issued

## Protected Routes

Routes requiring authentication use the `protect` middleware:

```javascript
import { protect } from '../middlewares/authMiddleware.js';

router.get('/dashboard', protect, displayDashboard);
router.post('/like', protect, actionLimiter, like);
```

## JWT Token Structure

```javascript
{
  id: user._id,
  iat: issuedAt,
  exp: expiresAt
}
```

**Token Expiration**: Currently no expiration set (TODO: Add 7-day expiration)

## Security Features

- Rate limiting on auth endpoints (5 attempts per 15 minutes)
- Password field excluded from queries by default
- CORS protection with origin whitelist
- Helmet.js security headers
- Bcrypt password hashing

## Environment Variables Required

```env
JWT_SECRET=your_secure_random_secret_here
SESSION_SECRET=your_session_secret_here
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## TODO

- [ ] Add token refresh mechanism
- [ ] Implement token expiration (7 days)
- [ ] Add "remember me" functionality
- [ ] Social auth providers (Google, Apple)
- [ ] Two-factor authentication
- [ ] Password reset flow
