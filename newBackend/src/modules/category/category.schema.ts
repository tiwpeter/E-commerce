// ============================================================
// schemas/category.schema.ts
// ============================================================

import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "slug must be lowercase with hyphens"),
  description: z.string().nullable().optional(),
  image: z.string().url().nullable().optional(),
  parentId: z.string().cuid().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

// ─── Category Tree (สำหรับ Sidebar) ──────────────────────────

export const CategoryTreeSchema: z.ZodType<CategoryTree> = z.lazy(() =>
  CategorySchema.extend({
    children: z.array(CategoryTreeSchema).default([]),
  })
);

export type CategoryTree = Category & {
  children: CategoryTree[];
};
