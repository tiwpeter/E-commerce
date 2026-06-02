import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import productRoutes, { productService }  from './modules/products/product.routes';
import { createCartRouter, cartErrorHandler } from './modules/cart/cart.routes';
import {createAuthRouter} from './modules/auth/auth.router';
import cors from 'cors';
import { config } from './config/app.config';
import { generateOpenApiDocument } from './config/openapi';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const db = new PrismaClient({ adapter }); 

export const createApp = (): Application => {
  const app = express();

  app.use(cors({
    origin: config.cors.origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ✅ declare ก่อนใช้
  const openApiDoc = generateOpenApiDocument();

  // Routes
  app.use('/api/products', productRoutes);
  app.use('/api/carts', createCartRouter(db, productService));
  app.use('/api/auth', createAuthRouter(db));
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
  app.get('/api-docs.json', (_req, res) => res.json(openApiDoc));

  return app;
};