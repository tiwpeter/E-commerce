// src/features/category/services/category.service.ts

import axiosInstance from "@/lib/axios";
import {
  CategoryQuerySchema,
  CategoryWithChildrenSchema,
  ProductListSchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  type CategoryQuery,
  type CategoryWithChildren,
  type Product,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "../schemas/category.schema";

// ────────────────────────────────────────────────
// GET /api/categories/:slug  — fetch one category + children
// ────────────────────────────────────────────────
export async function fetchCategoryBySlug(slug: string): Promise<CategoryWithChildren> {
  const res = await axiosInstance.get(`/categories/slug/${slug}`);

  // ✅ safeParse แทน parse — เห็น error ชัด ไม่ throw งงๆ
  const result = CategoryWithChildrenSchema.safeParse(res.data.data);

  if (!result.success) {
    console.error('Schema mismatch:', result.error.flatten());
    throw new Error('Invalid category data from API');
  }

  return result.data;
}

// ────────────────────────────────────────────────
// GET /api/products  — fetch products with filters
// ────────────────────────────────────────────────
export async function fetchCategoryProducts(params: CategoryQuery) {
  const validated = CategoryQuerySchema.parse(params);
  const { data } = await axiosInstance.get("/products", { params: validated });

  // ✅ parse ตาม structure จริงของ API
  const result = ProductListSchema.safeParse({
    products: data.data,   // array อยู่ใน data.data
    meta: data.meta,       // meta อยู่นอก
  });

  if (!result.success) {
    console.error('Product schema mismatch:', result.error.flatten());
    throw new Error('Invalid product data from API');
  }

  return result.data;
}

// ────────────────────────────────────────────────
// POST /api/categories  — create new category
// ────────────────────────────────────────────────
export async function createCategory(
  input: CreateCategoryInput
): Promise<CategoryWithChildren> {
  const validated = CreateCategorySchema.parse(input);
  const { data } = await axiosInstance.post("/categories", validated);
  return CategoryWithChildrenSchema.parse(data);
}

// ────────────────────────────────────────────────
// PATCH /api/categories/:id  — update category
// ────────────────────────────────────────────────
export async function updateCategory(
  input: UpdateCategoryInput
): Promise<CategoryWithChildren> {
  const validated = UpdateCategorySchema.parse(input);
  const { id, ...body } = validated;
  const { data } = await axiosInstance.patch(`/categories/${id}`, body);
  return CategoryWithChildrenSchema.parse(data);
}

// ────────────────────────────────────────────────
// DELETE /api/categories/:id  — soft delete
// ────────────────────────────────────────────────
export async function deleteCategory(id: string): Promise<void> {
  await axiosInstance.delete(`/categories/${id}`);
}
