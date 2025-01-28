import express from "express";
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
// import messagesRoute from "./routes/message.js"
// import matchesRoute from "./routes/matches.js"




// app.use("/api/matches", matchesRoute);
// app.use("/api/messages", messagesRoute);



const port = process.env.PORT || 10000
const connectionString = process.env.CONNECTION_STRING

// app.use(notFound)
// app.use(errorHandler)

// app.set('views', './views')
// app.set('view engine', 'pug')

app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));


app.use(cors({
  origin: '*', // Replace with your React app's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false, // If you need to support cookies or authentication headers
}));

app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json())
//maybe delete the line below
app.use(express.urlencoded({ extended: true }))
app.use('/', userRoutes)
app.use('/api/waitlist', waitlistRoutes);
app.use('/auth', authRoutes)

passport.use(new LocalStrategy(
  {
      usernameField: 'email', // Assuming your login form submits email and password
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

// Passport JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#' // Replace with your secret key
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
//   res.render('index')
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
      // Process or save the data as needed
    res.json({
        message: 'Spotify callback processed successfully',
        data: { accessToken, tokenType, expiresIn },
    });
})
// app.get('/dashboard', async (req, res) => {


//   const response = await fetch('https://api.spotify.com/v1/me', {
//     method: 'get',
//     headers: {
//       Authorization: 'Bearer ' + global.access_token
//     }
//   })
//   const data = await response.json()
//   console.log(data)

//   const artistGenres = await fetch('https://api.spotify.com/v1/me/following?type=artist', {
//     method: 'get',
//     headers: {
//       Authorization: 'Bearer ' + global.access_token
//     }
//   })

//   const artistData = await artistGenres.json()
//   console.log(artistData.artists.items)


//   res.render('dashboard', {user: data})
// })

// let listener = app.listen(port, function () {
//   console.log('Your app is listening on http://localhost:' + listener.address().port)
// })
mongoose.connect(
  connectionString
).then(() => {
  app.listen(port, function () {
    console.log(`listening on port ${port}`);
  });  
})
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));