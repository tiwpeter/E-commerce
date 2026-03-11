'use client';

import { useProductBySlug } from '@/features/products/hooks';
import { ProductInfo } from '@/features/products/components/ProductInfo';

interface Props {
  slug: string;  // ← เปลี่ยน
}

export function ProductDetailClient({ slug }: Props) {
  const { data: product, isLoading, isError } = useProductBySlug(slug);  // ← เปลี่ยน

  if (isLoading) return <p>Loading...</p>;
  if (isError)   return <p>Something went wrong.</p>;
  if (!product)  return <p>Product not found.</p>;

  return (
    <main>
      <ProductInfo product={product} />
    </main>
  );
}