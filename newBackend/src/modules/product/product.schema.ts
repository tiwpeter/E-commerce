import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.number().int().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  categoryId: z.coerce.number().int().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});