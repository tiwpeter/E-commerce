import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ecom-api',
      version: '1.0.0',
      description: 'Ecom REST API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development',
      },
      {
        url: 'https://api.example.com',
        description: 'Production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts'], // อ่าน JSDoc จาก routes
}

export const swaggerSpec = swaggerJsdoc(options)