import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1),
  parentId: z.string().optional().nullable(),
});

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  parentId: z.string().optional().nullable(),
});

export const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});