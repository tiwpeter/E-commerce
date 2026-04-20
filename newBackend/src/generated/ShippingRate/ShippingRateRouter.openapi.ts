import { registry } from '../../openapi/registry';
import {
  ShippingRateSchema,
  ShippingRateCreateInputSchema,
  ShippingRateUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/shippingrate/{id}',
  tags: ['ShippingRate'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: ShippingRateSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/shippingrate',
  tags: ['ShippingRate'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(ShippingRateSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/shippingrate',
  tags: ['ShippingRate'],
  request: {
    body: { content: { 'application/json': { schema: ShippingRateCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: ShippingRateSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/shippingrate/{id}',
  tags: ['ShippingRate'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: ShippingRateUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: ShippingRateSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/shippingrate/{id}',
  tags: ['ShippingRate'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});