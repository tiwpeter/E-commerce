// src/features/products/components/ProductCard.tsx
// Pure component — รับ product prop เท่านั้น ไม่ fetch เอง
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/features/products/types/product.types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  return (
    <article className="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* ── Image ──────────────────────────────────────────────── */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50 block">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white">
              Out of stock
            </span>
          </div>
        )}
      </Link>

      {/* ── Info ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <p className="text-xs font-medium text-primary-600 uppercase tracking-wide">
          {product.category.name}
        </p>

        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug"
        >
          {product.name}
        </Link>

        {/* Price + Button */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="shrink-0 rounded-xl bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
