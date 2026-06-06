'use client'

import { useGetProducts } from '@/api/generated/products/products'

export default function ProductList() {
  const { data: response, isPending, isError, error } = useGetProducts()

  if (isPending) return <p>Loading...</p>
  if (isError) {
    //console.error('❌ isError:', error)
    return <p>Unable to load products</p>
  }

  console.log('✅ products:', response?.data.items)
  console.log('✅ response:', response)

  return (
    <section>
      <h2>Flash Sale</h2>
      <div className="flex gap-4 overflow-x-auto">
        {response.data.items.map((p) => (
          <div key={p.id}>
            <p>{p.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}