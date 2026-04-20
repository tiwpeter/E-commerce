import { registry } from '../../openapi/registry';
import {
  ProductImageSchema,
  ProductImageCreateInputSchema,
  ProductImageUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/productimage/{id}',
  tags: ['ProductImage'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: ProductImageSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/productimage',
  tags: ['ProductImage'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(ProductImageSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/productimage',
  tags: ['ProductImage'],
  request: {
    body: { content: { 'application/json': { schema: ProductImageCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: ProductImageSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/productimage/{id}',
  tags: ['ProductImage'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: ProductImageUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: ProductImageSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/productimage/{id}',
  tags: ['ProductImage'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});