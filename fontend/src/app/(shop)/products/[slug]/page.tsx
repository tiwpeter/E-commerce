//products/[slug]/page.tsx 
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getProductsSlugSlug , getGetProductsSlugSlugQueryKey } from '@/api/generated/products/products'
import { notFound } from 'next/navigation'
import ProductDetail from '../../features/products/components/ProductDetail'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const queryClient = new QueryClient()

  console.log("slug:", slug) // ✅ ใส่ตรงนี้

  try {
  await queryClient.fetchQuery({
    queryKey: getGetProductsSlugSlugQueryKey(slug),
    queryFn: () => getProductsSlugSlug(slug),
    
  })
} catch (err: any) {   // 👈 ใส่ตรงนี้
  console.log("FULL ERROR:", err)
  console.log("STATUS:", err?.response?.status)
  console.log("DATA:", err?.response?.data)

  if (err?.response?.status === 404) {
    notFound()
  }

  throw err
}

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetail slug={slug} />
    </HydrationBoundary>
  )
}