import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/app.config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: `
# E-Commerce REST API

Production-ready API for an E-Commerce platform with Admin Dashboard.

## Authentication
This API uses **JWT Bearer tokens** for authentication.

1. Register or login to receive \`accessToken\` and \`refreshToken\`
2. Include \`Authorization: Bearer <accessToken>\` in protected requests
3. Use \`/auth/refresh\` to get a new access token when it expires

## Rate Limiting
- General: 100 requests / 15 minutes
- Auth endpoints: 10 requests / 15 minutes

## Standard Response Format
\`\`\`json
{
  "success": true,
  "message": "Success",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`
      `,
      contact: {
        name: 'API Support',
        email: 'api@ecommerce.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.app.port}${config.app.apiPrefix}`,
        description: 'Development server',
      },
      {
        url: `https://api.ecommerce.com${config.app.apiPrefix}`,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        // ─── Common ────────────────────────────────────────────────
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        // ─── User ──────────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
            isActive: { type: 'boolean' },
            avatar: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        // ─── Auth ──────────────────────────────────────────────────
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        // ─── Product ───────────────────────────────────────────────
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            comparePrice: { type: 'number', nullable: true },
            stock: { type: 'integer' },
            sku: { type: 'string' },
            isFeatured: { type: 'boolean' },
            isActive: { type: 'boolean' },
            averageRating: { type: 'number' },
            reviewCount: { type: 'integer' },
            category: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                slug: { type: 'string' },
              },
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  url: { type: 'string' },
                  isPrimary: { type: 'boolean' },
                },
              },
            },
          },
        },
        // ─── Order ─────────────────────────────────────────────────
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            orderNumber: { type: 'string' },
            status: {
              type: 'string',
              enum: ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED'],
            },
            subtotal: { type: 'number' },
            shippingFee: { type: 'number' },
            total: { type: 'number' },
            trackingNumber: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        // ─── Cart ──────────────────────────────────────────────────
        Cart: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            subtotal: { type: 'number' },
            itemCount: { type: 'integer' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'integer' },
                  product: { $ref: '#/components/schemas/Product' },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication & authorization' },
      { name: 'Products', description: 'Product catalog management' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Cart', description: 'Shopping cart' },
      { name: 'Orders', description: 'Order lifecycle' },
      { name: 'Reviews', description: 'Product reviews & ratings' },
      { name: 'Addresses', description: 'User shipping addresses' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
