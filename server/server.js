import express from "express";
import { createServer } from "http";
import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";
import cors from "cors"
import helmet from 'helmet'
import { corsOptions } from './config/security.js'
import userRoutes from "./routes/user.js"
import session from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from "./models/user.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import waitlistRoutes from "./routes/waitlistRoutes.js"
import authRoutes from "./routes/auth.routes.js"
import newAuthRoutes from "./routes/auth/index.js"
import messagesRoute from "./routes/message.js"
import matchesRoute from "./routes/matches.js"
import profileViewRoutes from "./routes/profileView.js"
import profileRoutes from "./routes/profile.js"
import matchManagementRoutes from "./routes/matchManagement.js"
import { initializeSocket } from "./socket.js"
import logger from "./utils/logger.js"

const app = express()



const port = process.env.PORT || 4000
const connectionString = process.env.CONNECTION_STRING

// app.use(notfound)
// app.use(errorhandler)

// app.set('views', './views')
// app.set('view engine', 'pug')

// CORS must be FIRST - before ANY other middleware
app.use(cors(corsOptions));

// Handle ALL preflight OPTIONS requests IMMEDIATELY after CORS middleware
// This ensures preflight requests are handled before any other middleware/routes
app.options('*', cors(corsOptions));

// Security middleware - configure helmet to not interfere with CORS
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(express.static('public'))
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/', userRoutes)
app.use('/api/waitlist', waitlistRoutes);
app.use('/auth', authRoutes) // Legacy Spotify auth (deprecated)
app.use('/auth', newAuthRoutes) // New multi-platform auth (Apple Music, YouTube Music)
app.use("/api/matches", matchesRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/profile-views", profileViewRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/match-management", matchManagementRoutes);

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








// Error handling middleware (must be after all routes)
app.use(notFound);
app.use(errorHandler);

// create http server for socket.io
const httpServer = createServer(app);

// initialize socket.io
initializeSocket(httpServer);

// connect to database and start server
mongoose.connect(
  connectionString
).then(() => {
  httpServer.listen(port, function () {
    logger.info(`server listening on port ${port}`);
    logger.info(`socket.io enabled for real-time messaging`);
  });
})

const db = mongoose.connection;
db.on("error", (error) => logger.error("MongoDB connection error:", error));
db.once("open", () => logger.info("connected to database"));
