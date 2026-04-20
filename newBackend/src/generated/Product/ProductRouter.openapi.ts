import { registry } from '../../openapi/registry';
import {
  ProductSchema,
  ProductCreateInputSchema,
  ProductUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/product/{id}',
  tags: ['Product'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: ProductSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/product',
  tags: ['Product'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(ProductSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/product',
  tags: ['Product'],
  request: {
    body: { content: { 'application/json': { schema: ProductCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: ProductSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/product/{id}',
  tags: ['Product'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: ProductUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: ProductSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/product/{id}',
  tags: ['Product'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});