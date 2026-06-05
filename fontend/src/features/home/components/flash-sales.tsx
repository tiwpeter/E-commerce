import { ProductCard, SectionHeader, type Product } from './product-card'

const FLASH_SALES: Product[] = [
  { id: 5, name: 'สมาร์ทวอทช์ Series 9', brand: 'Apple', price: 13900, original: 16900, discount: 18, rating: 4.9, reviews: 521, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
  { id: 6, name: 'ลำโพง Portable JBL', brand: 'JBL', price: 2900, original: 3900, discount: 26, rating: 4.7, reviews: 417, img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80' },
  { id: 7, name: 'แท็บเล็ต iPad Air M2', brand: 'Apple', price: 22900, original: 26900, discount: 15, rating: 4.8, reviews: 298, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80' },
  { id: 8, name: 'รองเท้าวิ่ง Ultra Boost', brand: 'Adidas', price: 4500, original: 6000, discount: 25, rating: 4.6, reviews: 189, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
]

export default function FlashSales() {
  return (
    <section>
      <SectionHeader title="ดีลพิเศษวันนี้" subtitle="Flash Sales — อัปเดตทุกวัน" href="#" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {FLASH_SALES.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
