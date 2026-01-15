import express from "express";
import { createServer } from "http";
import fetch from "node-fetch";
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";
import cors from "cors"
import bodyParser from 'body-parser'
import userRoutes from "./routes/user.js"
import session from 'express-session'
import passportLocalMongoose from 'passport-local-mongoose'
import passport from 'passport'
import connectEnsureLogin from 'connect-ensure-login'
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from "./models/user.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import waitlistRoutes from "./routes/waitlistRoutes.js"
import authRoutes from "./routes/auth.routes.js"
import messagesRoute from "./routes/message.js"
import matchesRoute from "./routes/matches.js"
import { initializeSocket } from "./socket.js"



const port = process.env.PORT || 4000
const connectionString = process.env.CONNECTION_STRING

// app.use(notfound)
// app.use(errorhandler)

// app.set('views', './views')
// app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json())
// maybe delete the line below
app.use(express.urlencoded({ extended: true }))
app.use('/', userRoutes)
app.use('/api/waitlist', waitlistRoutes);
app.use('/auth', authRoutes)
app.use("/api/matches", matchesRoute);
app.use("/api/messages", messagesRoute);

passport.use(new LocalStrategy(
  {
      usernameField: 'email', // assuming your login form submits email and password
      passwordField: 'password'
  },
  async (email, password, done) => {
      try {
          const user = await User.findOne({ email });

          if (!user || !user.isValidPassword(password)) {
              return done(null, false, { message: 'Incorrect email or password' });
          }

          return done(null, user);
      } catch (error) {
          return done(error);
      }
  }
));

// passport jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
      const user = await User.findById(jwtPayload.id);

      if (!user) {
          return done(null, false);
      }

      return done(null, user);
  } catch (error) {
      return done(error, false);
  }
}));






const redirect_uri = process.env.REDIRECT_URI
const client_id =  process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
global.access_token

// app.get('/', function (req, res) {
// res.render('index')
// })

app.get('/authorize', (req, res) => {
  let auth_query_paramerters = new URLSearchParams({
    response_type: 'code',
    client_id: client_id,
    scope: "user-read-private user-read-email user-follow-read",
    redirect_uri:redirect_uri
  })



  res.redirect("https://accounts.spotify.com/authorize?" + auth_query_paramerters.toString())

})

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  let body = new URLSearchParams({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: "authorization_code"

  })
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: "post",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: 
      "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64")
    }
  })
   const data = await response.json()
  global.access_token = data.access_token;
 
res.redirect('/dashboard')
})


app.post('/api/spotify/callback', (req, res) => {
  const params = req.body;
  console.log('Received Spotify callback data:', params);
    const accessToken = params.access_token;
    const tokenType = params.token_type;
    const expiresIn = params.expires_in;
   console.log(`Access Token: ${accessToken}`);
    console.log(`Token Type: ${tokenType}`);
    console.log(`Expires In: ${expiresIn}`);
      // process or save the data as needed
    res.json({
        message: 'Spotify callback processed successfully',
        data: { accessToken, tokenType, expiresIn },
    });
})
// app.get('/dashboard', async (req, res) => {


// const response = await fetch('https://api.spotify.com/v1/me', {
// method: 'get',
// headers: {
// authorization: 'bearer ' + global.access_token
// }
// })
// const data = await response.json()
// console.log(data)

// const artistgenres = await fetch('https://api.spotify.com/v1/me/following?type=artist', {
// method: 'get',
// headers: {
// authorization: 'bearer ' + global.access_token
// }
// })

// const artistdata = await artistgenres.json()
// console.log(artistdata.artists.items)


// res.render('dashboard', {user: data})
// })

// create http server for socket.io
const httpServer = createServer(app);

// initialize socket.io
initializeSocket(httpServer);

// connect to database and start server
mongoose.connect(
  connectionString
).then(() => {
  httpServer.listen(port, function () {
    console.log(`server listening on port ${port}`);
    console.log(`socket.io enabled for real-time messaging`);
  });
})

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));