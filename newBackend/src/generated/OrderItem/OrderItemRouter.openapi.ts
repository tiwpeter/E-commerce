import { registry } from '../../openapi/registry';
import {
  OrderItemSchema,
  OrderItemCreateInputSchema,
  OrderItemUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/orderitem/{id}',
  tags: ['OrderItem'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: OrderItemSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/orderitem',
  tags: ['OrderItem'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(OrderItemSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/orderitem',
  tags: ['OrderItem'],
  request: {
    body: { content: { 'application/json': { schema: OrderItemCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: OrderItemSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/orderitem/{id}',
  tags: ['OrderItem'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: OrderItemUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: OrderItemSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/orderitem/{id}',
  tags: ['OrderItem'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});