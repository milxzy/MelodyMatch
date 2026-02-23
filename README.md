# MelodyMatch

a music-based dating app that matches people by their music taste. built because spotify said no.

## what happened with spotify

spotify now requires 250k monthly active users to get api access. so we're pivoting to apple music and youtube music instead. the matching algorithm doesn't care where the music data comes from, it just needs artists and genres.

| platform | status |
|----------|--------|
| spotify | blocked (250k MAU requirement) |
| apple music | in progress |
| youtube music | coming soon |

## how it works

you sign up, connect a music platform, and the app finds people with similar taste. matching uses a weighted score - 60% genre overlap (jaccard similarity) and 40% shared artists. then you can swipe and chat with your matches in real time.

## stack

- react + vite, chakra ui on the frontend
- node/express + mongodb on the backend
- socket.io for messaging
- passport.js for auth
- deployed on railway (backend) and vercel (frontend)

## running it locally

need node v16+ and a mongodb instance (atlas works fine).

```bash
git clone https://github.com/milxzy/MelodyMatch.git
cd MelodyMatch

# server
cd server && npm install

# client
cd ../client && npm install
```

copy the env vars from [env-setup.md](./env-setup.md) into `server/.env` and `client/.env`, then:

```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd client && npm run dev
```

frontend runs on :5173, backend on :4000.

## api

**auth**
- `POST /registerUser` - sign up
- `POST /backendlogin` - log in

**users**
- `GET /getUsers?userId={id}` - potential matches sorted by compatibility
- `GET /getUserById/:userId` - single user
- `POST /like` - like someone

**matches / messages**
- `GET /getMatches/:userId` - your matches
- `GET /api/messages/:userId/:recipientId` - conversation history
- `POST /api/messages` - send message

## license

mit
