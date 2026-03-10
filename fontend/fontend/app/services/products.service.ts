// src/services/products.service.ts
// ติดต่อ Backend อย่างเดียว
// ไม่รู้จัก React, loading, cache — หน้าที่คือ fetch + return
import { api } from '@/lib/axios'
import type {
  Product,
  ProductsQuery,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api.types'

export const productsService = {

  // GET /products — list + filter + sort + pagination
  // params optional — ไม่ส่งใช้ค่า default ของ Backend
  getAll: (params?: ProductsQuery) =>
    api
      .get<PaginatedResponse<Product>>('/products', { params })
      .then(r => r.data),

  // GET /products/:id — detail ด้วย id
  getById: (id: string) =>
    api
      .get<ApiResponse<Product>>(`/products/${id}`)
      .then(r => r.data.data),

  // GET /products/slug/:slug — detail ด้วย slug (ใช้ใน URL)
  getBySlug: (slug: string) =>
    api
      .get<ApiResponse<Product>>(`/products/slug/${slug}`)
      .then(r => r.data.data),

  // GET /products/featured — featured ไม่มี pagination
  getFeatured: () =>
    api
      .get<ApiResponse<Product[]>>('/products/featured')
      .then(r => r.data.data),
}