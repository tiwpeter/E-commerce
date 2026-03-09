// src/features/category/hooks/useCategoryProducts.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategoryBySlug,
  fetchCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service";
import type {
  CategoryQuery,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/category.schema";

// ────────────────────────────────────────────────
// Query Keys Factory
// ────────────────────────────────────────────────
export const categoryKeys = {
  all: ["categories"] as const,
  bySlug: (slug: string) => [...categoryKeys.all, "slug", slug] as const,
  products: (params: CategoryQuery) =>
    [...categoryKeys.all, "products", params] as const,
};

// ────────────────────────────────────────────────
// useCategoryBySlug — fetch category + its children
// ────────────────────────────────────────────────
export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: categoryKeys.bySlug(slug),
    queryFn: () => fetchCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 min — categories change rarely
  });
}

// ────────────────────────────────────────────────
// useCategoryProducts — fetch products with filters
// ────────────────────────────────────────────────
export function useCategoryProducts(params: CategoryQuery) {
  return useQuery({
    queryKey: categoryKeys.products(params),
    queryFn: () => fetchCategoryProducts(params),
    enabled: !!params.category,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}

// ────────────────────────────────────────────────
// useCreateCategory — mutation
// ────────────────────────────────────────────────
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

// ────────────────────────────────────────────────
// useUpdateCategory — mutation
// ────────────────────────────────────────────────
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCategoryInput) => updateCategory(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

// ────────────────────────────────────────────────
// useDeleteCategory — mutation (soft delete)
// ────────────────────────────────────────────────
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
