import { registry } from '../../openapi/registry';
import {
  CartSchema,
  CartCreateInputSchema,
  CartUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/cart/{id}',
  tags: ['Cart'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: CartSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/cart',
  tags: ['Cart'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(CartSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/cart',
  tags: ['Cart'],
  request: {
    body: { content: { 'application/json': { schema: CartCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: CartSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/cart/{id}',
  tags: ['Cart'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: CartUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: CartSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/cart/{id}',
  tags: ['Cart'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});