import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/app.config';
//import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { morganStream } from './utils/logger';
//import { swaggerSpec } from './swagger/swagger.config';

// Routes
import  productRouter   from "./modules/product/product.routes";
/*
import {
} from './routes/index.routes';
*/
export const createApp = (): Application => {
  const app = express();

  // ─── Security ───────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false, // Configure per needs
    })
  );

  app.use(
    cors({
      origin: config.cors.origins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ─── Global Rate Limiting ────────────────────────────────────────
  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests, slow down.' },
    })
  );

  // ─── General Middleware ──────────────────────────────────────────
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(morgan('combined', { stream: morganStream }));

  // ─── Static Files ────────────────────────────────────────────────
  app.use('/uploads', express.static(path.resolve(config.upload.dir)));
/*
  // ─── Swagger UI ──────────────────────────────────────────────────
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'E-Commerce API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    })
  );

  // Expose raw spec
  app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

  // ─── Health Check ────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      env: config.app.env,
    });
  });
*/
  // ─── API Routes ──────────────────────────────────────────────────
  const prefix = config.app.apiPrefix;

  app.use(`${prefix}/api/products`, productRouter);
/*
  // ─── Error Handling ──────────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);
*/
  return app;
};
