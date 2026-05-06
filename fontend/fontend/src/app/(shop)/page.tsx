import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getApiProducts, getGetApiProductsQueryKey } from '@/api/generated/products/products'
import ProductList from '@/features/products/components/ProductList'

export default async function HomePage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: getGetApiProductsQueryKey(),
    queryFn: () => getApiProducts(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductList />
    </HydrationBoundary>
  )
}