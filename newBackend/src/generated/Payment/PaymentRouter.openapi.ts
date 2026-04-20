import { registry } from '../../openapi/registry';
import {
  PaymentSchema,
  PaymentCreateInputSchema,
  PaymentUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/payment/{id}',
  tags: ['Payment'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: PaymentSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/payment',
  tags: ['Payment'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(PaymentSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/payment',
  tags: ['Payment'],
  request: {
    body: { content: { 'application/json': { schema: PaymentCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: PaymentSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/payment/{id}',
  tags: ['Payment'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: PaymentUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: PaymentSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/payment/{id}',
  tags: ['Payment'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});