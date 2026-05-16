import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import productRoutes, { productService } from './modules/products/product.routes';
import categoryRoutes from './modules/category/category.routes';
import { createCartRouter, cartErrorHandler } from './modules/cart/cart.routes';
import { createUserRouter, userErrorHandler } from './modules/user/user.routes';
import { ProductService } from './modules/products/product.service'; // ← import Service จริง
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
  app.use('/api/category', categoryRoutes);
  app.use('/api/users', createUserRouter());
  app.use('/api/carts', createCartRouter(productService));

  // Swagger UI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
  app.get('/docs/json', (_req, res) => res.json(openApiDoc));

  // Error handlers (ต้องอยู่หลัง routes เสมอ)
  app.use(userErrorHandler);
  app.use(cartErrorHandler);

  return app;
};