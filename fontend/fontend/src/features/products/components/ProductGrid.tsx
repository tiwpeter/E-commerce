'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useGetApiProducts } from '@/api/generated/products/products'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────
type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'popular'

interface ProductSummary {
  id: string
  name: string
  slug: string
  basePrice: string
  comparePrice?: string | null
  isFeatured: boolean
  stock: number
  images: { url: string; alt?: string | null; isPrimary: boolean }[]
  category: { name: string }
}

// ─── Sort Bar ────────────────────────────────────────────────
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'ล่าสุด', value: 'latest' },
  { label: 'ยอดนิยม', value: 'popular' },
  { label: 'ราคา ถูก→แพง', value: 'price_asc' },
  { label: 'ราคา แพง→ถูก', value: 'price_desc' },
]

// ─── Product Card ─────────────────────────────────────────────
function ProductCard({ product }: { product: ProductSummary }) {
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0]
  const price = parseFloat(product.basePrice)
  const comparePrice = product.comparePrice ? parseFloat(product.comparePrice) : null
  const discountPercent = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : null

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
              Featured
            </span>
          )}
          {discountPercent && discountPercent < 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {Math.abs(discountPercent)}% OFF
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              สินค้าหมด
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        <p className="text-xs text-gray-400 truncate">{product.category.name}</p>
        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-bold text-gray-900">
            ฿{price.toLocaleString('th-TH', { minimumFractionDigits: 0 })}
          </span>
          {comparePrice && (
            <span className="text-xs text-gray-400 line-through">
              ฿{comparePrice.toLocaleString('th-TH', { minimumFractionDigits: 0 })}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Main Component ───────────────────────────────────────────
export default function ProductGrid() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categorySlug = searchParams.get('categorySlug') ?? undefined
  const sort = (searchParams.get('sort') as SortOption) ?? 'latest'
  const page = Number(searchParams.get('page') ?? 1)

  const { data, isLoading } = useGetApiProducts({
    categorySlug,
    sort,
    page,
    limit: 20,
  } as any)

  const products: ProductSummary[] = (data as any)?.data ?? []
  const totalPages: number = (data as any)?.totalPages ?? 1
  const total: number = (data as any)?.total ?? 0

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    if (key !== 'page') params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Sort Bar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {total > 0 ? `${total} สินค้า` : ''}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">เรียงโดย</span>
          <div className="flex gap-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setParam('sort', opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  sort === opt.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <svg className="w-16 h-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm font-medium text-gray-400">ไม่พบสินค้า</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setParam('page', String(page - 1))}
            disabled={page <= 1}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ←
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const p = i + 1
            if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
              return (
                <button
                  key={p}
                  onClick={() => setParam('page', String(p))}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    p === page
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              )
            }
            if (p === page - 2 || p === page + 2) {
              return <span key={p} className="text-gray-300 text-sm">…</span>
            }
            return null
          })}

          <button
            onClick={() => setParam('page', String(page + 1))}
            disabled={page >= totalPages}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-gray-100 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
