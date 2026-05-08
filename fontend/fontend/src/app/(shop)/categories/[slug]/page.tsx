// app/products/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import {
  getApiProducts,
  getGetApiProductsQueryKey,
} from '@/api/generated/products/products'
import {
  getApiCategoryTree,
  getGetApiCategoryTreeQueryKey,
} from '@/api/generated/categories/categories'
import CategorySidebar from '@/features/categories/components/CategorySidebar'
import ProductGrid from '@/features/products/components/ProductGrid'

interface ProductsPageProps {
  searchParams: Promise<{
    categorySlug?: string
    sort?: string
    page?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const queryClient = new QueryClient()

  // Prefetch ทั้ง categories tree และ products พร้อมกัน
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: getGetApiCategoryTreeQueryKey(),
      queryFn: () => getApiCategoryTree(),
    }),
    queryClient.prefetchQuery({
      queryKey: getGetApiProductsQueryKey({
        categorySlug: params.categorySlug,
        //sort: params.sort as any,
        page: Number(params.page ?? 1),
        limit: 20,
      }),
      queryFn: () =>
        getApiProducts({
          categorySlug: params.categorySlug,
          //sort: params.sort as any,
          page: Number(params.page ?? 1),
          limit: 20,
        }),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <CategorySidebar />
          <ProductGrid />
        </div>
      </div>
    </HydrationBoundary>
  )
}