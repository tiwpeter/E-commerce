"use client"

import Link from 'next/link'
import { Heart, ChevronRight } from 'lucide-react'

export interface Product {
  id: string  
  name: string
  //brand: string
  price: number
  original: number
  discount: number
  //rating: number
 // reviews: number
  img: string
  slug: string
}

export function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className={i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}>
            ★
          </span>
        ))}
      </div>
      <span className="text-gray-400">({reviews})</span>
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {
  console.log(product)
  return (
    
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
          <button
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.preventDefault() // prevent triggering the Link
              // TODO: handle wishlist
            }}
          >
            <Heart size={15} className="text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
            {product.name}
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-lg font-bold text-gray-900">${product.price.toLocaleString()}</span>
            <span className="text-sm text-gray-400 line-through">${product.original.toLocaleString()}</span>
          </div>
          <button
            className="mt-3 w-full bg-black text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-800 active:scale-95 transition-all duration-150"
            onClick={(e) => {
              e.preventDefault() // prevent triggering the Link
              // TODO: handle add to cart
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </Link>
  )
}

export function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string
  subtitle?: string
  href?: string
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors font-medium"
        >
          View all <ChevronRight size={16} />
        </Link>
      )}
    </div>
  )
}
