// src/services/categories.service.ts
import { api } from '@/lib/axios';
import type { Category } from '@/features/categories/types/category.types';
import type { ApiResponse } from '@/types/api.types';

export const categoriesService = {
  getAll: () =>
    api
      .get<ApiResponse<Category[]>>('/categories')
      .then((r) => r.data),

  getBySlug: (slug: string) =>
    api
      .get<ApiResponse<Category>>(`/categories/${slug}`)
      .then((r) => r.data),
};
