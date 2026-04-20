import { registry } from '../../openapi/registry';
import {
  UserSchema,
  UserCreateInputSchema,
  UserUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/user/{id}',
  tags: ['User'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: UserSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/user',
  tags: ['User'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(UserSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/user',
  tags: ['User'],
  request: {
    body: { content: { 'application/json': { schema: UserCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: UserSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/user/{id}',
  tags: ['User'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: UserUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: UserSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/user/{id}',
  tags: ['User'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});