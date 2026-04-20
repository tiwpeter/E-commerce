import { registry } from '../../openapi/registry';
import {
  VariantOptionValueSchema,
  VariantOptionValueCreateInputSchema,
  VariantOptionValueUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/variantoptionvalue/{id}',
  tags: ['VariantOptionValue'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: VariantOptionValueSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/variantoptionvalue',
  tags: ['VariantOptionValue'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(VariantOptionValueSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/variantoptionvalue',
  tags: ['VariantOptionValue'],
  request: {
    body: { content: { 'application/json': { schema: VariantOptionValueCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: VariantOptionValueSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/variantoptionvalue/{id}',
  tags: ['VariantOptionValue'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: VariantOptionValueUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: VariantOptionValueSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/variantoptionvalue/{id}',
  tags: ['VariantOptionValue'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});