import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'API documentation',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'Products', description: 'Product endpoints' },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    },
  },
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/product.routes.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);