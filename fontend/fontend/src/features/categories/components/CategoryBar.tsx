// features/products/components/CategoryBar.tsx
'use client'

import { useGetApiCategoryTree} from "@/api/generated/categories/index"
import Link from 'next/link'

export default function CategoryBar() {
  const { data: categories } = useGetApiCategoryTree()

  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {categories?.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="px-4 py-2 rounded-full border hover:bg-orange-500 hover:text-white whitespace-nowrap"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}