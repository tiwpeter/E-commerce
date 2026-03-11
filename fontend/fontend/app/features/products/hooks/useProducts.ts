// src/hooks/useProducts.ts
// จัดการ UI state — loading, error, cache
// ห่อ service ด้วย TanStack Query
import { useQuery } from '@tanstack/react-query'
import { productsService } from '@/services/products.service'
import { ProductsQuery } from '@/types/api.types'
import { QUERY_KEYS } from '@/lib/constants'

// ── List ──────────────────────────────────────────────
// params   — filter, sort, pagination (optional)
// options  — enabled: รอ fetch จนกว่าจะพร้อม
export function useProducts(
  params?:  ProductsQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    // cache แยกตาม params — params ต่างกัน = cache คนละก้อน
    queryKey: ['products', params],
    queryFn:  () => productsService.getAll(params),
    staleTime: 1000 * 60 * 5,        // cache 5 นาที
    enabled:   options?.enabled ?? true,
  })
}

// ── Detail by ID ──────────────────────────────────────
// enabled: !!id — ไม่ fetch ถ้าไม่มี id
export function useProductById(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn:  () => productsService.getById(id),
    enabled:  !!id,
    staleTime: 1000 * 60 * 5,
  })
}

// ── Detail by Slug ────────────────────────────────────
// ใช้ใน URL เช่น /products/wireless-headphones
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(slug),  // ← ใช้ QUERY_KEYS แทน hardcode
    queryFn:  () => productsService.getBySlug(slug),
    enabled:  !!slug,
    staleTime: 1000 * 60 * 5,
  })
}

// ── Featured ──────────────────────────────────────────
// cache นานกว่าปกติ — featured ไม่ค่อยเปลี่ยน
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn:  () => productsService.getFeatured(),
    staleTime: 1000 * 60 * 30,       // cache 30 นาที
  })
}