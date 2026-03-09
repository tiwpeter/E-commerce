// src/features/products/components/FeaturedProducts.tsx
// Pure section component ใน feature/products
// รับ products[] + isLoading + onAddToCart จาก HomePageClient
import Link from 'next/link';
import type { Product } from '@/features/products/types/product.types';
import { ProductGrid } from '@/features/products/components/ProductGrid';

interface FeaturedProductsProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export function FeaturedProducts({
  products,
  isLoading,
  onAddToCart,
}: FeaturedProductsProps) {
  return (
    <section aria-labelledby="featured-heading">
      {/* ── Section Header ──────────────────────────────────────── */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-widest text-primary-600 uppercase">
            Handpicked for you
          </p>
          <h2
            id="featured-heading"
            className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          >
            Featured Products
          </h2>
        </div>

        <Link
          href="/products"
          className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors sm:flex"
        >
          View all <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* ── Grid — ส่ง props ลง ProductGrid ───────────────────── */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        onAddToCart={onAddToCart}
        columns={4}
      />

      {/* ── Mobile: view all ─────────────────────────────────── */}
      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/products"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View all products →
        </Link>
      </div>
    </section>
  );
}
