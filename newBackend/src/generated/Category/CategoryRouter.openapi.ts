import { registry } from '../../openapi/registry';
import {
  CategorySchema,
  CategoryCreateInputSchema,
  CategoryUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/category/{id}',
  tags: ['Category'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: CategorySchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/category',
  tags: ['Category'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(CategorySchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/category',
  tags: ['Category'],
  request: {
    body: { content: { 'application/json': { schema: CategoryCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: CategorySchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/category/{id}',
  tags: ['Category'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: CategoryUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: CategorySchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/category/{id}',
  tags: ['Category'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});