import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getProducts, getGetProductsQueryKey } from '@/api/generated/products/products'
import ProductList from '@/features/products/components/ProductList'

export default async function HomePage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: getGetProductsQueryKey(),
    queryFn: () => getProducts(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductList />
    </HydrationBoundary>
  )
}