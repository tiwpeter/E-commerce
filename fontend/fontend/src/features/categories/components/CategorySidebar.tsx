'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useGetApiCategoryTree } from '@/api/generated/categories/categories'

// ─── Types ───────────────────────────────────────────────────
interface CategoryNode {
  id: string
  name: string
  slug: string
  children?: CategoryNode[]
}

interface CategorySidebarProps {
  className?: string
}

// ─── Component ───────────────────────────────────────────────
export default function CategorySidebar({ className = '' }: CategorySidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSlug = searchParams.get('categorySlug') ?? ''

  const { data, isLoading } = useGetApiCategoryTree()
  const tree: CategoryNode[] = (data as any)?.data ?? []

  const handleClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('categorySlug', slug)
    } else {
      params.delete('categorySlug')
    }
    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  if (isLoading) return <CategorySidebarSkeleton />

  return (
    <aside className={`w-56 shrink-0 ${className}`}>
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="w-1 h-5 bg-gray-900 rounded-full" />
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
          หมวดหมู่
        </h2>
      </div>

      <nav className="flex flex-col gap-0.5">
        {/* ทั้งหมด */}
        <button
          onClick={() => handleClick('')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            !activeSlug
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          สินค้าทั้งหมด
        </button>

        {/* Categories */}
        {tree.map((category) => (
          <div key={category.id}>
            {/* Parent */}
            <button
              onClick={() => handleClick(category.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeSlug === category.slug
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {category.name}
            </button>

            {/* Children */}
            {category.children && category.children.length > 0 && (
              <div className="ml-3 pl-3 border-l border-gray-200 flex flex-col gap-0.5 mt-0.5 mb-1">
                {category.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleClick(child.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all duration-150 ${
                      activeSlug === child.slug
                        ? 'bg-gray-900 text-white font-medium'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

// ─── Skeleton ────────────────────────────────────────────────
function CategorySidebarSkeleton() {
  return (
    <aside className="w-56 shrink-0">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="w-1 h-5 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex flex-col gap-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`h-8 rounded-lg bg-gray-100 animate-pulse ${i % 3 !== 0 ? 'ml-6 w-[calc(100%-1.5rem)]' : 'w-full'}`} />
        ))}
      </div>
    </aside>
  )
}
