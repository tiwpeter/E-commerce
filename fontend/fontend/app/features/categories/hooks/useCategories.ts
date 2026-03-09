// src/features/categories/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories.service';
import { QUERY_KEYS } from '@/lib/constants';

export const useCategories = () =>
  useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => categoriesService.getAll(),
    staleTime: 5 * 60 * 1000, // categories เปลี่ยนน้อย cache 5 นาที
  });
