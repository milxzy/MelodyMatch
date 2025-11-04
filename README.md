# MelodyMatch 🎵

a music-based dating application that connects people through their spotify music preferences. find your perfect match based on shared musical taste!

## features

- **spotify integration**: authenticate with spotify to import your music preferences
- **smart matching algorithm**: users are ranked by music compatibility using genre and artist similarity
- **real-time messaging**: chat with your matches using socket.io for instant communication
- **swipe interface**: tinder-style swiping to like or pass on potential matches
- **user dashboard**: view your stats, matches, and music preferences at a glance
- **secure authentication**: jwt-based authentication with passport.js
- **responsive design**: works seamlessly on desktop and mobile devices

## tech stack

### frontend
- react 18 with vite
- chakra ui for components
- socket.io-client for real-time messaging
- react router v6 for navigation
- axios for api calls
- spotify web api js

### backend
- node.js with express
- mongodb with mongoose
- socket.io for real-time features
- passport.js (local + jwt strategies)
- spotify web api integration
- bcryptjs for password hashing

## getting started

### prerequisites

- node.js (v16 or higher)
- mongodb atlas account or local mongodb installation
- spotify developer account with app credentials

### installation

1. **clone the repository**
   ```bash
   git clone https://github.com/yourusername/MelodyMatch.git
   cd MelodyMatch
   ```

2. **set up environment variables**

   **server .env file** (`server/.env`):
   ```env
   CONNECTION_STRING=your_mongodb_connection_string
   PORT=10000
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   JWT_SECRET=your_secure_random_jwt_secret
   SESSION_SECRET=your_secure_random_session_secret
   FRONTEND_URL=http://localhost:5173
   BACKEND_URL=http://localhost:10000
   SPOTIFY_REDIRECT_URI=http://localhost:10000/auth/spotify/callback
   ```

   **client .env file** (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:10000
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:10000/auth/spotify/callback
   ```

   see `ENV_SETUP.md` for detailed instructions on obtaining credentials.

3. **install dependencies**
   ```bash
   # install server dependencies
   cd server
   npm install

   # install client dependencies
   cd ../client
   npm install
   ```

4. **run the application**
   ```bash
   # start the server (from server directory)
   cd server
   npm start

   # start the client (from client directory - in a new terminal)
   cd client
   npm run dev
   ```

5. **access the application**
   - frontend: http://localhost:5173
   - backend api: http://localhost:10000

## spotify setup

1. go to [spotify developer dashboard](https://developer.spotify.com/dashboard)
2. create a new app
3. add redirect uris:
   - development: `http://localhost:10000/auth/spotify/callback`
   - production: `https://your-backend-url.com/auth/spotify/callback`
4. copy your client id and client secret to your .env files

## deployment

### vercel (frontend)
1. connect your github repository to vercel
2. set environment variables in vercel dashboard
3. deploy!

### render (backend)
1. connect your github repository to render
2. set environment variables in render dashboard
3. deploy!

## project structure

```
MelodyMatch/
├── client/                 # react frontend
│   ├── src/
│   │   ├── components/    # react components
│   │   ├── spotify.js     # spotify api configuration
│   │   └── main.jsx       # app entry point
│   ├── .env.example       # environment variables template
│   └── package.json
├── server/                # express backend
│   ├── controllers/       # route controllers
│   ├── models/           # mongoose models
│   ├── routes/           # api routes
│   ├── utils/            # utility functions
│   │   └── matchingAlgorithm.js  # music compatibility scoring
│   ├── middlewares/      # custom middleware
│   ├── socket.js         # socket.io configuration
│   ├── server.js         # server entry point
│   ├── .env.example      # environment variables template
│   └── package.json
└── README.md
```

## api endpoints

### authentication
- `POST /registerUser` - register new user
- `POST /backendlogin` - login with credentials
- `GET /auth/login` - initiate spotify oauth
- `GET /auth/spotify/callback` - spotify oauth callback

### users
- `GET /GetUsers?userId={id}` - get sorted list of potential matches
- `GET /getUserById/:userId` - get user by id
- `POST /addUserInfo` - add user profile information
- `POST /like` - like another user

### matches
- `GET /getMatches/:userId` - get user's matches
- `GET /api/matches/:userId` - get matches (alternative endpoint)

### messaging
- `GET /api/messages/:userId/:recipientId` - get messages between users
- `POST /api/messages` - send a message
- `PUT /api/messages/read/:userId/:recipientId` - mark messages as read

### waitlist
- `POST /api/waitlist/add-to-waitlist` - add email to waitlist
- `GET /api/waitlist/check-status/:email` - check waitlist status
- `POST /api/waitlist/approve-reject` - admin approval

## matching algorithm

the app uses a sophisticated music compatibility algorithm that:
- calculates genre similarity using jaccard coefficient
- compares artist preferences
- generates an overall compatibility score (60% genres, 40% artists)
- ranks users from highest to lowest compatibility
- filters out already-liked users

compatibility levels:
- **80%+**: perfect match
- **60-79%**: great match
- **40-59%**: good match
- **20-39%**: fair match
- **<20%**: low match

## socket.io events

### client → server
- `user-online` - user connects with their id
- `send-message` - send a message to recipient
- `typing-start` - user starts typing
- `typing-stop` - user stops typing

### server → client
- `receive-message` - new message received
- `message-sent` - confirmation message was sent
- `user-typing` - recipient is typing
- `user-stopped-typing` - recipient stopped typing
- `user-status-change` - user online/offline status changed

## contributing

contributions are welcome! please feel free to submit a pull request.

## license

mit

## support

for issues or questions, please open an issue on github.

## acknowledgments

- spotify web api for music data
- chakra ui for beautiful components
- socket.io for real-time features

---

**note**: this app requires spotify api approval for production use. currently in development mode with extended quota.
