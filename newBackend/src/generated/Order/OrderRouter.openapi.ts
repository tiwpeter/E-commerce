import { registry } from '../../openapi/registry';
import {
  OrderSchema,
  OrderCreateInputSchema,
  OrderUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/order/{id}',
  tags: ['Order'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: OrderSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/order',
  tags: ['Order'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(OrderSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/order',
  tags: ['Order'],
  request: {
    body: { content: { 'application/json': { schema: OrderCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: OrderSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/order/{id}',
  tags: ['Order'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: OrderUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: OrderSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/order/{id}',
  tags: ['Order'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});