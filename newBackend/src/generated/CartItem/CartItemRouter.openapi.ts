import { registry } from '../../openapi/registry';
import {
  CartItemSchema,
  CartItemCreateInputSchema,
  CartItemUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/cartitem/{id}',
  tags: ['CartItem'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: CartItemSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/cartitem',
  tags: ['CartItem'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(CartItemSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/cartitem',
  tags: ['CartItem'],
  request: {
    body: { content: { 'application/json': { schema: CartItemCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: CartItemSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/cartitem/{id}',
  tags: ['CartItem'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: CartItemUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: CartItemSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/cartitem/{id}',
  tags: ['CartItem'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});