// src/services/products.service.ts
import { api } from '@/lib/axios';
import type { Product, ProductsQuery } from '@/features/products/types/product.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const productsService = {
  getAll: (params?: ProductsQuery) =>
    api
      .get<PaginatedResponse<Product>>('/products', { params })
      .then((r) => r.data),

  getBySlug: (slug: string) =>
    api
      .get<ApiResponse<Product>>(`/products/${slug}`)
      .then((r) => r.data),
};
