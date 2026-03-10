// src/types/api.types.ts
// ตัวกลางระหว่าง generated กับโค้ดจริง
// ห้ามเขียน type เอง — ดึงจาก generated ทั้งหมด
import type { components, paths } from './api.generated'

// ── Schema Types ──────────────────────────────────────
// rename ให้สั้นลง — ถ้า Backend เปลี่ยน type เปลี่ยนตามอัตโนมัติ
export type Product         = components['schemas']['Product']
export type Order           = components['schemas']['Order']
export type Cart            = components['schemas']['Cart']
export type User            = components['schemas']['User']
export type AuthResponse    = components['schemas']['AuthResponse']
export type PaginationMeta  = components['schemas']['PaginationMeta']
export type ValidationError = components['schemas']['ValidationError']

// ── Nested Types ──────────────────────────────────────
// ดึง type ของ field ย่อยออกมาจาก Product
export type ProductCategory = NonNullable<Product['category']>
export type ProductImage    = NonNullable<Product['images']>[number]

// ── Wrapper Types ─────────────────────────────────────
// ห่อ response — ใช้ได้ทุก API
// T คือ type ของ data เช่น ApiResponse<Product>
export type ApiResponse<T> = {
  success:   boolean
  message:   string
  data:      T
  timestamp: string
}

// สำหรับ API ที่ return หลายชิ้น + pagination
export type PaginatedResponse<T> = ApiResponse<T[]> & {
  meta: PaginationMeta
}

// ── Utility Types ─────────────────────────────────────
export type ID           = string | number
export type Nullable<T>  = T | null
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
export type SortOrder    = 'asc' | 'desc'

// ── Query Params จาก Path ─────────────────────────────
// ดึงตรงจาก generated — sync กับ Backend อัตโนมัติ
export type ProductsQuery =
  paths['/products']['get']['parameters'] extends { query?: infer Q } ? Q : never