// src/features/products/components/FeaturedProducts.tsx
// Pure section component ใน feature/products
// รับ products[] + isLoading + onAddToCart จาก HomePageClient
import { Product } from '@/types';
import { useProducts } from '../hooks';


export function FeaturedProducts() {
  const { data, isLoading, isError } = useProducts();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <section aria-labelledby="featured-heading">
      <h2 id="featured-heading">Featured Products</h2>
      {data?.data?.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </section>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <h3>{product.name}</h3>
    </div>
  );
}