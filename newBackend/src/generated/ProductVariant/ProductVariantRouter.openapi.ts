import { registry } from '../../openapi/registry';
import {
  ProductVariantSchema,
  ProductVariantCreateInputSchema,
  ProductVariantUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/productvariant/{id}',
  tags: ['ProductVariant'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: ProductVariantSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/productvariant',
  tags: ['ProductVariant'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(ProductVariantSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/productvariant',
  tags: ['ProductVariant'],
  request: {
    body: { content: { 'application/json': { schema: ProductVariantCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: ProductVariantSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/productvariant/{id}',
  tags: ['ProductVariant'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: ProductVariantUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: ProductVariantSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/productvariant/{id}',
  tags: ['ProductVariant'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});