import { registry } from '../../openapi/registry';
import {
  ReviewSchema,
  ReviewCreateInputSchema,
  ReviewUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/review/{id}',
  tags: ['Review'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: ReviewSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/review',
  tags: ['Review'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(ReviewSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/review',
  tags: ['Review'],
  request: {
    body: { content: { 'application/json': { schema: ReviewCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: ReviewSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/review/{id}',
  tags: ['Review'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: ReviewUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: ReviewSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/review/{id}',
  tags: ['Review'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});