// src/features/category/schemas/category.schema.ts

import { z } from "zod";

// ────────────────────────────────────────────────
// Base Schemas
// ────────────────────────────────────────────────

// ✅ แยก base object ไว้ก่อน — extend ได้
const CategoryBaseSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  image: z.string().url().nullable(),
  parentId: z.string().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

// extend ได้เพราะยังไม่ transform
export const SubcategorySchema = CategoryBaseSchema.extend({
  children: z.array(CategoryBaseSchema).optional(),
});

export const CategoryWithChildrenSchema = CategoryBaseSchema.extend({
  children: z.array(SubcategorySchema).default([]),
}).transform((data) => ({
  ...data,
  imageUrl: data.image,   // ✅ transform ตอนสุดท้าย หลัง extend เสร็จแล้ว
}));


// ────────────────────────────────────────────────
// Product Schema
// ────────────────────────────────────────────────
export const ProductImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string().nullable(),
  isPrimary: z.boolean(),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),           // ✅ name ไม่ใช่ title
  slug: z.string().min(1),
  description: z.string().nullable(),
  price: z.coerce.number().positive(),           // ✅ price
  comparePrice: z.coerce.number().positive().nullable(), // ✅ comparePrice
  stock: z.number().int(),
  isActive: z.boolean(),
  images: z.array(ProductImageSchema).default([]), // ✅ images เป็น array of objects
  category: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// ✅ wrap ด้วย pagination shape ตรงกับ API
export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});
// ────────────────────────────────────────────────
// Query Params Schemas
// ────────────────────────────────────────────────

export const CategoryQuerySchema = z.object({
  category: z.string().min(1),
  subSlug: z.string().optional(),
  brand: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ────────────────────────────────────────────────
// Create / Update Schemas (for forms / API body)
// ────────────────────────────────────────────────

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  parentId: z.string().cuid().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const UpdateCategorySchema = CreateCategorySchema.partial().extend({
  id: z.string().cuid(),
});

// ────────────────────────────────────────────────
// Inferred Types
// ────────────────────────────────────────────────

export type Category = z.infer<typeof CategoryBaseSchema>;
export type CategoryWithChildren = z.infer<typeof CategoryWithChildrenSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CategoryQuery = z.infer<typeof CategoryQuerySchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type ProductList = z.infer<typeof ProductListSchema>;
