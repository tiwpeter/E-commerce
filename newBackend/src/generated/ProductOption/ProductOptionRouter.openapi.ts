import { registry } from '../../openapi/registry';
import {
  ProductOptionSchema,
  ProductOptionCreateInputSchema,
  ProductOptionUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/productoption/{id}',
  tags: ['ProductOption'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: ProductOptionSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/productoption',
  tags: ['ProductOption'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(ProductOptionSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/productoption',
  tags: ['ProductOption'],
  request: {
    body: { content: { 'application/json': { schema: ProductOptionCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: ProductOptionSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/productoption/{id}',
  tags: ['ProductOption'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: ProductOptionUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: ProductOptionSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/productoption/{id}',
  tags: ['ProductOption'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});