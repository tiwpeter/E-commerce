// src/app/(shop)/_components/HomePageClient.tsx
// ─────────────────────────────────────────────────────────────────
// Client Component — orchestrator เท่านั้น
// ทำหน้าที่: เรียก hooks → รับ data → ส่ง props ลง feature components
// ไม่มี UI ของตัวเอง ไม่มี logic การแสดงผล
// ─────────────────────────────────────────────────────────────────
'use client';

import { useProducts } from '@/features/products/hooks/useProducts';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useCartStore } from '@/store/cartStore';
import { FeaturedProducts } from '@/features/products/components/FeaturedProducts';
import { CategoriesGrid } from '@/features/categories/components/CategoriesGrid';
import type { Product } from '@/features/products/types/product.types';

export function HomePageClient() {
  // ── Data hooks (hydrated จาก server cache) ───────────────────
  const { data: productsData, isLoading: productsLoading } = useProducts({
    featured: true,
    limit: 4,
  });
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  // ── Store actions ────────────────────────────────────────────
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      slug: product.slug,
      image: product.images.find((i) => i.isPrimary)?.url,
    });
    toggleCart();
  };

  // ── Render — ส่ง props ลง features ──────────────────────────
  return (
    <div className="space-y-16 pb-16">
      <div className="flex items-center justify-center h-screen bg-black">
      <h1 className="text-5xl font-bold text-red-500">
        Tailwind Working 🚀
      </h1>
    </div>
      <FeaturedProducts
        products={productsData?.data ?? []}
        isLoading={productsLoading}
        onAddToCart={handleAddToCart}
      />
      <CategoriesGrid
        categories={categoriesData?.data ?? []}
        isLoading={categoriesLoading}
      />
    </div>
  );
}
