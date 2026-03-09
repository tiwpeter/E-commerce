// src/features/categories/components/CategoriesGrid.tsx
// Pure section component ใน feature/categories
// รับ categories[] + isLoading จาก HomePageClient
import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/features/categories/types/category.types';

interface CategoriesGridProps {
  categories: Category[];
  isLoading: boolean;
}

export function CategoriesGrid({ categories, isLoading }: CategoriesGridProps) {
  return (
    <section aria-labelledby="categories-heading">
      {/* ── Section Header ──────────────────────────────────────── */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold tracking-widest text-primary-600 uppercase">
          Browse by
        </p>
        <h2
          id="categories-heading"
          className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
        >
          Shop Categories
        </h2>
      </div>

      {/* ── Grid ────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}

// ── CategoryCard (private sub-component) ───────────────────────
interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-100 block"
    >
      {/* Background image */}
      {category.image ? (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-300" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-semibold text-white text-sm leading-tight">
          {category.name}
        </p>
        {category._count !== undefined && (
          <p className="mt-0.5 text-xs text-white/70">
            {category._count.products} products
          </p>
        )}
      </div>

      {/* Hover arrow */}
      <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white text-sm backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        →
      </div>
    </Link>
  );
}

// ── Skeleton loader ─────────────────────────────────────────────
function CategoryCardSkeleton() {
  return (
    <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
  );
}
