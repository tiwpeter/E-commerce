// lib/mappers.ts
import type { Product as ApiProduct } from '@/api/generated/model/product'
import type { Product } from '../app/(shop)/features/home/components/home/ProductCard'

export function toProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    //brand: p.brand,
    price: p.basePrice,
    original: p.comparePrice ?? p.basePrice,
    discount: p.comparePrice                     // ✅ คำนวณได้
      ? Math.round((1 - p.basePrice / p.comparePrice) * 100)
      : 0,
   // rating: p.rating,
   // reviews: p.review_count,      // ← map ชื่อให้ตรง
   img: p.images[0].url,             // ← map ชื่อให้ตรง
    slug: p.slug,
  }
}