import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import productRoutes  from './modules/products/product.routes';
import cors from 'cors';
import { config } from './config/app.config';
import { generateOpenApiDocument } from './config/openapi';

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
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
  app.get('/api-docs.json', (_req, res) => res.json(openApiDoc));

  return app;
};