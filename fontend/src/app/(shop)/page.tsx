import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getProducts, getGetProductsQueryKey   } from '@/api/generated/products/products'
import { SectionHeader } from '@/features/home/components/product-card'

import Navbar         from '@/features/home/components/navbar'
import HeroBanner     from '@/features/home/components/hero-banner'
import BenefitsBar    from '@/features/home/components/benefits-bar'
import IconCategories from '@/features/home/components/icon-categories'
import Footer         from '@/features/home/components/footer'
import ProductList    from '@/features/home/components/productList'

export default async function HomePage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: getGetProductsQueryKey  (),
    queryFn: () => getProducts(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-[#fafafa]">

        <Navbar />
        <HeroBanner />
        <BenefitsBar />

        <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">

          <IconCategories />

          {/* Featured Products — from API */}
          <section id="products">
            <SectionHeader
              title="Featured Products"
              subtitle="Discover our top selection"
              href="#"
            />
         {/**  <CategoryBar /> 
            */} 
          </section>

          <ProductList />

        </main>

        <Footer />

      </div>
    </HydrationBoundary>
  )
}
