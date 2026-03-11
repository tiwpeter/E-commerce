import type { Product } from '@/types/api.types';

interface Props {
  product: Product;
}

export function ProductInfo({ product }: Props) {
  return (
    <section aria-labelledby="product-name">
      <h1 id="product-name">{product.name}</h1>
      <p>{product.price}</p>
      <p>{product.description}</p>
    </section>
  );
}