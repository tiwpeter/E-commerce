import { z } from "zod"
import { Product,ProductImage } from "@prisma/client"

// =============================
// Query Schema (runtime validation)
// =============================
export const productQuerySchema = z.object({
  categoryId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
})

// =============================
// Types (derived from schema)
// =============================
export type ProductFilter = z.infer<typeof productQuerySchema>

// =============================
// DTO (DB output)
// =============================
export type ProductDTO = Product & {
  images: ProductImage[]
}