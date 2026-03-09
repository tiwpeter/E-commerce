// src/features/products/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { QUERY_KEYS } from '@/lib/constants';
import type { ProductsQuery } from '@/features/products/types/product.types';

export const useProducts = (params?: ProductsQuery) =>
  useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, params],
    queryFn: () => productsService.getAll(params),
  });
