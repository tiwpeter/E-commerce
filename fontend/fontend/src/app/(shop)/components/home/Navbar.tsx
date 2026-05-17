'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, Search } from 'lucide-react'

const CATEGORY_LINKS = [
  'ทุกหมวดหมู่', 'อิเล็กทรอนิกส์', 'แฟชั่น', 'บ้านและสวน',
  'ความงาม', 'กีฬา', 'หนังสือ', 'อาหาร', 'ของเล่น',
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <Link href="/" className="text-2xl font-black tracking-widest text-black shrink-0">
          ÉLITE
        </Link>

        <div className="flex-1 max-w-xl">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-2">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Heart size={20} className="text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <ShoppingBag size={20} className="text-gray-700" />
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      <nav className="border-t border-gray-50 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {CATEGORY_LINKS.map((cat, i) => (
              <li key={cat}>
                <Link
                  href="#"
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    i === 0 ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
