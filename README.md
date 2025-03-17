# MelodyMatch

a music-based dating app that connects people through their music taste. find your perfect match based on shared artists, genres, and vibes.

## the pivot

> **february 2026**: spotify changed their api policy to require 250k monthly active users for access. since we're not there yet, we're going full speed into adding **apple music** and **youtube music** support. the matching algorithm doesn't care where your music comes from - it just needs artists and genres to work its magic.

## current status

| platform | status | notes |
|----------|--------|-------|
| spotify | **blocked** | requires 250k MAU for api access |
| apple music | **in progress** | official api, $99/year, no approval needed |
| youtube music | **coming soon** | oauth integration in development |

## what it does

- **music-based matching**: you get ranked by how similar your music taste is to other users
- **real-time chat**: socket.io messaging with your matches
- **swipe interface**: like or pass on potential matches
- **dashboard**: see your stats, matches, and music preferences

## how matching works

the algorithm is platform-agnostic. it just needs:
- your favorite genres
- your favorite artists

then it calculates compatibility:
- 60% weight on genre overlap (jaccard coefficient)
- 40% weight on artist overlap
- ranks everyone from best match to worst

compatibility levels:
- 80%+ = perfect match
- 60-79% = great match  
- 40-59% = good match
- 20-39% = fair match
- <20% = probably not your vibe

## tech stack

**frontend**
- react 18 + vite
- chakra ui
- socket.io-client
- react router v6

**backend**
- node.js + express
- mongodb + mongoose
- socket.io
- passport.js (jwt)
- bcryptjs

**deployment**
- frontend: vercel
- backend: railway (no cold starts)

## getting started

### prerequisites

- node.js v16+
- mongodb (atlas or local)
- apple developer account ($99/year) - for apple music integration

### installation

```bash
# clone it
git clone https://github.com/milxzy/MelodyMatch.git
cd MelodyMatch

# install server deps
cd server && npm install

# install client deps
cd ../client && npm install
```

### environment variables

**server/.env**
```env
CONNECTION_STRING=your_mongodb_connection_string
PORT=4000
JWT_SECRET=generate_a_secure_random_string
SESSION_SECRET=generate_another_secure_random_string
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000

# apple music (coming soon)
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_musickit_key_id
APPLE_PRIVATE_KEY_PATH=./keys/AuthKey.p8
```

**client/.env**
```env
VITE_API_URL=http://localhost:4000

# apple music (coming soon)
VITE_APPLE_MUSIC_TEAM_ID=your_apple_team_id
VITE_APPLE_MUSIC_KEY_ID=your_musickit_key_id
```

### run it

```bash
# terminal 1: start server
cd server && npm run dev

# terminal 2: start client
cd client && npm run dev
```

- frontend: http://localhost:5173
- backend: http://localhost:4000

## deployment

**frontend (vercel)**
1. connect github repo
2. set env vars
3. deploy

**backend (railway)**
```bash
railway login
railway init
railway up
```

see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for the full guide.

## api endpoints

### auth
- `POST /registerUser` - create account
- `POST /backendlogin` - login
- `GET /auth/login` - oauth flow (apple music coming soon)
- `GET /auth/callback` - oauth callback

### users
- `GET /getUsers?userId={id}` - get potential matches (sorted by compatibility)
- `GET /getUserById/:userId` - get user
- `POST /like` - like someone

### matches
- `GET /getMatches/:userId` - get your matches

### messages
- `GET /api/messages/:userId/:recipientId` - get conversation
- `POST /api/messages` - send message
- `PUT /api/messages/read/:userId/:recipientId` - mark as read

## project structure

```
MelodyMatch/
├── client/                 # react frontend
│   ├── src/
│   │   ├── components/    # ui components
│   │   └── main.jsx       # entry point
│   └── package.json
├── server/                # express backend
│   ├── controllers/       # route handlers
│   ├── models/           # mongoose schemas
│   ├── routes/           # api routes
│   ├── utils/            # helpers
│   │   └── matchingAlgorithm.js
│   ├── socket.js         # real-time messaging
│   └── server.js         # entry point
└── README.md
```

## socket events

**client → server**
- `user-online` - connect with user id
- `send-message` - send a message
- `typing-start` / `typing-stop` - typing indicators

**server → client**
- `receive-message` - new message
- `message-sent` - confirmation
- `user-typing` / `user-stopped-typing` - typing indicators
- `user-status-change` - online/offline

## roadmap

- [x] core matching algorithm
- [x] real-time messaging
- [x] user authentication
- [x] railway deployment
- [ ] apple music integration
- [ ] youtube music integration
- [ ] manual genre/artist entry (fallback)
- [ ] playlist import
- [ ] listening history analysis

## contributing

prs welcome. open an issue first if it's a big change.

## license

mit

---

*built because spotify said no. now we're building something better.*
