import { ProductCard, SectionHeader, type Product } from './ProductCard'

const NEW_ARRIVALS: Product[] = [
  { id: 1, name: 'หูฟัง Pro Max 2 Gen', brand: 'Sony', price: 8900, original: 10900, discount: 18, rating: 4.8, reviews: 124, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
  { id: 2, name: 'กล้องมิเรอร์เลส Sony α7V', brand: 'Sony', price: 89900, original: 99900, discount: 10, rating: 4.9, reviews: 89,  img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80' },
  { id: 3, name: 'กระเป๋า Tote Bag', brand: 'Gucci', price: 1900, original: 2500, discount: 24, rating: 4.7, reviews: 312, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
  { id: 4, name: 'วิตามิน C Premium', brand: "Blackmore's", price: 1200, original: 1500, discount: 20, rating: 4.6, reviews: 203, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
]

export default function NewArrivals() {
  return (
    <section>
      <SectionHeader title="สินค้ามาใหม่" subtitle="New Arrivals" href="#" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {NEW_ARRIVALS.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
