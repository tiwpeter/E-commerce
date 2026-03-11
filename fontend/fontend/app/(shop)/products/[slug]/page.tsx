import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { productsService } from '@/services/products.service';
import { QUERY_KEYS } from '@/lib/constants';
import { ProductDetailClient } from './_components/ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;  // ← [slug] ไม่ใช่ [id]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;  // ← await + slug
  const product = await productsService.getBySlug(slug);  // ← getBySlug
  return {
    title: `${product.name} | ShopApp`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;  // ← await + slug
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: QUERY_KEYS.PRODUCT(slug),
    queryFn:  () => productsService.getBySlug(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ProductDetailClient slug={slug} />
    </HydrationBoundary>
  );
}