import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const optionalEnv = (key: string, fallback: string): string =>
  process.env[key] ?? fallback;

export const config = {
  app: {
    env: optionalEnv('NODE_ENV', 'development'),
    port: parseInt(optionalEnv('PORT', '5000'), 10),
    apiPrefix: optionalEnv('API_PREFIX', '/api/v1'),
    frontendUrl: optionalEnv('FRONTEND_URL', 'http://localhost:3000'),
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
  },
  db: {
    url: requireEnv('DATABASE_URL'),
  },
  prisma: {
    useAdapter: optionalEnv('PRISMA_USE_ADAPTER', 'false') === 'true',
  },
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: optionalEnv('JWT_EXPIRES_IN', '15m'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    refreshExpiresIn: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },
  bcrypt: {
    rounds: parseInt(optionalEnv('BCRYPT_ROUNDS', '12'), 10),
  },
  rateLimit: {
    windowMs: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    max: parseInt(optionalEnv('RATE_LIMIT_MAX', '100'), 10),
    authMax: parseInt(optionalEnv('AUTH_RATE_LIMIT_MAX', '10'), 10),
  },
  upload: {
    dir: path.resolve(optionalEnv('UPLOAD_DIR', 'uploads')),
    maxFileSize: parseInt(optionalEnv('MAX_FILE_SIZE', '5242880'), 10),
    allowedMimeTypes: optionalEnv(
      'ALLOWED_MIME_TYPES',
      'image/jpeg,image/png,image/webp'
    ).split(','),
  },
  logging: {
    level: optionalEnv('LOG_LEVEL', 'debug'),
    dir: path.resolve(optionalEnv('LOG_DIR', 'logs')),
  },
  cors: {
    origins: optionalEnv('CORS_ORIGINS', 'http://localhost:3000').split(','),
  },
} as const;

export type Config = typeof config;