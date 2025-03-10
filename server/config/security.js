import helmet from 'helmet';

// Helmet configuration for security headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Allowed origins for CORS
export const getAllowedOrigins = () => {
  return [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean);
};

// CORS options
export const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    
    console.log(`[CORS] Request from origin: ${origin}`);
    console.log(`[CORS] Allowed origins: ${JSON.stringify(allowedOrigins)}`);
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('[CORS] Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check exact matches (localhost, FRONTEND_URL)
    if (allowedOrigins.includes(origin)) {
      console.log('[CORS] Allowing origin (exact match)');
      return callback(null, true);
    }
    
    // Allow any Vercel deployment (production + preview URLs)
    if (origin.endsWith('.vercel.app')) {
      console.log('[CORS] Allowing Vercel deployment');
      return callback(null, true);
    }
    
    // Log rejected origins for debugging
    console.log(`[CORS] REJECTING origin: ${origin}`);
    
    // Reject all other origins
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 86400 // Cache preflight for 24 hours
};
