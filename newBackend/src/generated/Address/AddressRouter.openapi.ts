import { registry } from '../../openapi/registry';
import {
  AddressSchema,
  AddressCreateInputSchema,
  AddressUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/address/{id}',
  tags: ['Address'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: AddressSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/address',
  tags: ['Address'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(AddressSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/address',
  tags: ['Address'],
  request: {
    body: { content: { 'application/json': { schema: AddressCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: AddressSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/address/{id}',
  tags: ['Address'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: AddressUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: AddressSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/address/{id}',
  tags: ['Address'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});