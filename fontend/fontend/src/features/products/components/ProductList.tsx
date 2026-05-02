'use client'

import { useGetProducts } from '@/api/generated/products/products'

export default function ProductList() {
  // ดึงจาก cache ทันที ไม่ fetch ซ้ำ
  const { data } = useGetProducts()

  return (
    <section>
      <h2>Flash Sale</h2>
      <div className="flex gap-4 overflow-x-auto">
        {data?.data?.map((p) => (
          <div key={p.id}>
            <p>{p.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}