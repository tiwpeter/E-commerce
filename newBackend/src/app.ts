import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import productRoutes from './modules/product/product.routes'; // ← import ตรงนี้

export const createApp = (): Application => {
  const swaggerFile = require('../swagger_output.json');

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/products', productRoutes); // ← ใช้งาน

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

  return app;
};