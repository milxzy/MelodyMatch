// Environment variable validation
export const validateEnv = () => {
  const required = [
    'CONNECTION_STRING',
    'JWT_SECRET',
    'SESSION_SECRET',
    'CLIENT_ID',
    'CLIENT_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Validate JWT_SECRET length
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('Warning: JWT_SECRET should be at least 32 characters long for security');
  }

  console.log('✓ Environment variables validated successfully');
};
