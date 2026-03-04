import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { config } from '../config/app.config';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Ensure log directory exists
if (!fs.existsSync(config.logging.dir)) {
  fs.mkdirSync(config.logging.dir, { recursive: true });
}

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `[${timestamp}] ${level}: ${stack ?? message} ${metaStr}`;
  })
);

const fileFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
  level: config.logging.level,
  defaultMeta: { service: 'ecommerce-api' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
      silent: config.app.env === 'test',
    }),
    new winston.transports.File({
      filename: path.join(config.logging.dir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(config.logging.dir, 'combined.log'),
      format: fileFormat,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

// Morgan stream integration
export const morganStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};
