'use client'

import { useProducts } from '../hooks/useProducts'
import { ProductCard, SectionHeader, type Product } from './product-card'

export default function ProductList() {
  const { products, isPending, isError } = useProducts({ limit: 4 })

  if (isPending) return <p>Loading...</p>
  if (isError) return <p>Unable to load products</p>

  return (
    <section>
      <SectionHeader title="New Arrivals" subtitle="Recently launched" href="#" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}