import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getProducts, getGetProductsQueryKey   } from '@/api/generated/products/products'
import { SectionHeader } from '@/features/home/components/product-card'

import Navbar         from '@/features/home/components/navbar'
import HeroBanner     from '@/features/home/components/hero-banner'
import BenefitsBar    from '@/features/home/components/benefits-bar'
import IconCategories from '@/features/home/components/icon-categories'
import SaleBanner     from '@/features/home/components/sale-banner'
import NewArrivals    from '@/features/home/components/new-arrivals'
import FlashSales     from '@/features/home/components/flash-sales'
import Footer         from '@/features/home/components/footer'

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

          {/* Featured Products โ€” from API */}
          <section id="products">
            <SectionHeader
              title="เธชเธดเธเธเนเธฒเนเธเธฐเธเธณ"
              subtitle="เธชเธดเธเธเนเธฒเนเธเธฐเธเธณเธชเธณเธซเธฃเธฑเธเธเธธเธ“"
              href="#"
            />
         {/**  <CategoryBar /> 
            */} 
          </section>

          <SaleBanner />
          <NewArrivals />
          <FlashSales />

        </main>

        <Footer />

      </div>
    </HydrationBoundary>
  )
}
