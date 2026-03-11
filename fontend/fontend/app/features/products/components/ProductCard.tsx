import Link from 'next/link';
import type { Product } from '@/types/api.types';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`}>
      <div>
        <h3>{product.name}</h3>
      </div>
    </Link>
  );
}