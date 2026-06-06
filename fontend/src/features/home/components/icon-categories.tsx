import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const ICON_CATEGORIES = [
  { emoji: '⚡', label: 'Electronics', bg: 'bg-blue-50',   ring: 'ring-blue-200'   },
  { emoji: '👗', label: 'Fashion',       bg: 'bg-pink-50',   ring: 'ring-pink-200'   },
  { emoji: '🏠', label: 'Home & Garden', bg: 'bg-green-50',  ring: 'ring-green-200'  },
  { emoji: '✨', label: 'Beauty',        bg: 'bg-purple-50', ring: 'ring-purple-200' },
  { emoji: '🏃', label: 'Sports',        bg: 'bg-orange-50', ring: 'ring-orange-200' },
  { emoji: '📚', label: 'Books',         bg: 'bg-yellow-50', ring: 'ring-yellow-200' },
  { emoji: '🍜', label: 'Food',          bg: 'bg-red-50',    ring: 'ring-red-200'    },
  { emoji: '🎮', label: 'Toys',          bg: 'bg-indigo-50', ring: 'ring-indigo-200' },
]

export default function IconCategories() {
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Product categories</h2>
        <Link href="#" className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors font-medium">
          View all <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {ICON_CATEGORIES.map(({ emoji, label, bg, ring }) => (
          <Link key={label} href="#" className="flex flex-col items-center gap-2 group">
            <div className={`w-14 h-14 ${bg} ring-1 ${ring} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200`}>
              {emoji}
            </div>
            <span className="text-xs text-gray-600 font-medium text-center leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
