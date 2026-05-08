import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import productRoutes from './modules/products/product.routes'; 
import categoryRoutes from './modules/category/category.routes';

import cartRouter from './modules/cart/cart.routes'; 

import cors from 'cors';
import { config } from './config/app.config';

export const createApp = (): Application => {
  const swaggerFile = require('./swagger/swagger_output.json');

  const app = express();

  // Cor
  app.use(
    cors({
      origin: config.cors.origins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRouter);
  app.use('/api/category', categoryRoutes);

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  app.get('/api-docs.json', (req, res) => res.json(swaggerFile));

  return app;
};