import { registry } from '../../openapi/registry';
import {
  OptionValueSchema,
  OptionValueCreateInputSchema,
  OptionValueUpdateInputSchema,
} from '../../../prisma/generated/zod';
import { z } from 'zod';

// GET /user/:id
registry.registerPath({
  method: 'get',
  path: '/optionvalue/{id}',
  tags: ['OptionValue'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: OptionValueSchema } } },
    404: { description: 'Not found' },
  },
});

// GET /user
registry.registerPath({
  method: 'get',
  path: '/optionvalue',
  tags: ['OptionValue'],
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.array(OptionValueSchema) } } },
  },
});

// POST /user
registry.registerPath({
  method: 'post',
  path: '/optionvalue',
  tags: ['OptionValue'],
  request: {
    body: { content: { 'application/json': { schema: OptionValueCreateInputSchema } } },
  },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: OptionValueSchema } } },
  },
});

// PUT /user/:id
registry.registerPath({
  method: 'put',
  path: '/optionvalue/{id}',
  tags: ['OptionValue'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: OptionValueUpdateInputSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: OptionValueSchema } } },
  },
});

// DELETE /user/:id
registry.registerPath({
  method: 'delete',
  path: '/optionvalue/{id}',
  tags: ['OptionValue'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: 'Deleted' },
  },
});