import { registry } from '../../openapi/registry';
import {
  ShippingZoneSchema,
  ShippingZoneCreateInputSchema,
  ShippingZoneUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/shippingzone/{id}',
  tags: ['ShippingZone'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: ShippingZoneSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/shippingzone',
  tags: ['ShippingZone'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(ShippingZoneSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/shippingzone',
  tags: ['ShippingZone'],
  request: {
    body: { content: { 'application/json': { schema: ShippingZoneCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: ShippingZoneSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/shippingzone/{id}',
  tags: ['ShippingZone'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: ShippingZoneUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: ShippingZoneSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/shippingzone/{id}',
  tags: ['ShippingZone'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});