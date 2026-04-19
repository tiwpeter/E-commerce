import { PrismaClient } from '@prisma/client';
import { config } from './app.config';
import { logger } from '../utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log:
      config.app.isDevelopment
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
          ]
        : [{ emit: 'event', level: 'error' }],
  });
};

// Singleton pattern — prevent hot-reload from creating multiple instances
export const prisma: PrismaClient =
  global.__prisma ?? createPrismaClient();

if (config.app.isDevelopment) {
  global.__prisma = prisma;

  // Log slow queries in development
  (prisma as any).$on('query', (e: any) => {
    if (e.duration > 200) {
      logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
    }
  });
}

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();
  logger.info('✅ Database connected');
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
};