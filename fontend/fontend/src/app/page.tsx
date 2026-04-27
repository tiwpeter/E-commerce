'use client';
import { useGetApiProducts } from '@/api/products/products';

export default function ProductList() {
  const { data, isLoading, isError } = useGetApiProducts();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;

  return (
    <ul>
      {data?.map((product: any) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}