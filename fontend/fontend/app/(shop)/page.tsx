// src/app/(shop)/page.tsx
// ─────────────────────────────────────────────────────────────────
// Server Component — prefetch data บน server แล้วส่งผ่าน
// HydrationBoundary ลงให้ HomePageClient
// Server prefetch
// ─────────────────────────────────────────────────────────────────
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { productsService } from '@/services/products.service';
import { categoriesService } from '@/services/categories.service';
import { QUERY_KEYS } from '@/lib/constants';
import { HomePageClient } from './_components/HomePageClient';

export const metadata: Metadata = {
  title: 'Home | ShopApp',
  description: 'Shop our latest featured products and browse by category.',
};

export default async function HomePage() {
  const qc = new QueryClient();

  // Prefetch ทั้งสองพร้อมกันบน server — ไม่มี loading flicker รอบแรก
  await Promise.all([
    qc.prefetchQuery({
      queryKey: [...QUERY_KEYS.PRODUCTS, { featured: true, limit: 4 }],
      queryFn: () => productsService.getAll({ featured: true, limit: 4 }),
    }),
    qc.prefetchQuery({
      queryKey: QUERY_KEYS.CATEGORIES,
      queryFn: () => categoriesService.getAll(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <HomePageClient />
    </HydrationBoundary>
  );
}
