import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getApiProducts, getGetApiProductsQueryKey } from '@/api/generated/products/products'
import ProductList from '@/features/products/components/ProductList'
import CategoryBar from '@/features/categories/components/CategoryBar'
import { SectionHeader } from '@/app/(shop)/components/home/ProductCard'

import Navbar         from '@/app/(shop)/components/home/Navbar'
import HeroBanner     from '@/app/(shop)/components/home/HeroBanner'
import BenefitsBar    from '@/app/(shop)/components/home/BenefitsBar'
import IconCategories from '@/app/(shop)/components/home/IconCategories'
import SaleBanner     from '@/app/(shop)/components/home/SaleBanner'
import NewArrivals    from '@/app/(shop)/components/home/NewArrivals'
import FlashSales     from '@/app/(shop)/components/home/FlashSales'
import Footer         from '@/app/(shop)/components/home/Footer'

export default async function HomePage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: getGetApiProductsQueryKey(),
    queryFn: () => getApiProducts(),
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
              title="สินค้าแนะนำ"
              subtitle="สินค้าแนะนำสำหรับคุณ"
              href="#"
            />
            <CategoryBar />
            <ProductList />
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