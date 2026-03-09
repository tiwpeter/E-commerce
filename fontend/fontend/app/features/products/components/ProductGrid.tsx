// src/features/products/components/ProductGrid.tsx
// Pure component — รับ products[] prop เท่านั้น ไม่ fetch เอง
import type { Product } from '@/features/products/types/product.types';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
  columns?: 2 | 3 | 4;
}

const columnClass = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
};

export function ProductGrid({
  products,
  isLoading,
  onAddToCart,
  columns = 4,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={`grid ${columnClass[columns]} gap-4`}>
        {Array.from({ length: columns }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
        description="Check back later for new arrivals."
      />
    );
  }

  return (
    <div className={`grid ${columnClass[columns]} gap-4`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

// ── Skeleton loader ─────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 bg-gray-200 rounded-full" />
        <div className="h-4 w-full bg-gray-200 rounded-full" />
        <div className="h-4 w-2/3 bg-gray-200 rounded-full" />
        <div className="mt-3 flex justify-between">
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-7 w-12 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
