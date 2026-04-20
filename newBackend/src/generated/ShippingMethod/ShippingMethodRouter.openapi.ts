import { registry } from '../../openapi/registry';
import {
  ShippingMethodSchema,
  ShippingMethodCreateInputSchema,
  ShippingMethodUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/shippingmethod/{id}',
  tags: ['ShippingMethod'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: ShippingMethodSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/shippingmethod',
  tags: ['ShippingMethod'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(ShippingMethodSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/shippingmethod',
  tags: ['ShippingMethod'],
  request: {
    body: { content: { 'application/json': { schema: ShippingMethodCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: ShippingMethodSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/shippingmethod/{id}',
  tags: ['ShippingMethod'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: ShippingMethodUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: ShippingMethodSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/shippingmethod/{id}',
  tags: ['ShippingMethod'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});