import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { config } from './config/app.config';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Create and start Express app
    const app = createApp();
    const server = app.listen(config.app.port, () => {
      logger.info(`🚀 Server running on port ${config.app.port}`);
      logger.info(`📖 API Docs: http://localhost:${config.app.port}/api-docs`);
      logger.info(`📄 Swagger JSON: http://localhost:${config.app.port}/api-docs.json`); // ✅ เพิ่มบรรทัดนี้
      logger.info(`🌍 Environment: ${config.app.env}`);
      logger.info(`📡 API Prefix: ${config.app.apiPrefix}`);
    });

    // ─── Graceful Shutdown ─────────────────────────────────────────
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        logger.info('Graceful shutdown complete');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason: Error) => {
      logger.error('Unhandled Promise Rejection:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
