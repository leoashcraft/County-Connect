import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Validate JWT secret in production
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (nodeEnv === 'production') {
    if (!secret) {
      throw new Error('JWT_SECRET environment variable must be set in production');
    }
    if (secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters in production');
    }
    return secret;
  }

  // In development, use provided secret or generate a random one per session
  // This prevents accidental use of weak secrets in production
  if (secret) {
    return secret;
  }

  console.warn('WARNING: No JWT_SECRET set. Using random secret for this session. Set JWT_SECRET in .env for persistent sessions.');
  return crypto.randomBytes(32).toString('hex');
};

// Parse DATABASE_URL if provided (Railway format: mysql://user:pass@host:port/dbname)
const parseDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (!url) return null;

  try {
    const parsed = new URL(url);
    return {
      type: 'mysql',
      host: parsed.hostname,
      port: parseInt(parsed.port) || 3306,
      user: parsed.username,
      password: parsed.password,
      name: parsed.pathname.slice(1), // Remove leading slash
    };
  } catch (error) {
    console.warn('Failed to parse DATABASE_URL:', error.message);
    return null;
  }
};

const getDatabaseConfig = () => {
  // First, check for DATABASE_URL (Railway/Heroku style)
  const urlConfig = parseDatabaseUrl();
  if (urlConfig) {
    console.log(`Using MySQL database from DATABASE_URL: ${urlConfig.host}:${urlConfig.port}/${urlConfig.name}`);
    return urlConfig;
  }

  // Otherwise, use individual environment variables
  return {
    // Database type: 'sqlite' or 'mysql'
    type: process.env.DATABASE_TYPE || 'sqlite',
    // SQLite settings
    path: process.env.DATABASE_PATH || './database.sqlite',
    // MySQL settings (used when DATABASE_TYPE=mysql)
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    name: process.env.DATABASE_NAME || 'county_connect',
  };
};

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  jwt: {
    secret: getJwtSecret(),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },

  database: getDatabaseConfig(),

  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
};
