import { Truck, ShieldCheck, RefreshCcw, Star } from 'lucide-react'

const BENEFITS = [
  { icon: Truck,        title: 'Free shipping',      sub: 'On all orders nationwide' },
  { icon: ShieldCheck,  title: '100% secure',        sub: 'Payment processed safely' },
  { icon: RefreshCcw,   title: 'Easy returns',       sub: 'Within 30 days' },
  { icon: Star,         title: 'Quality products',    sub: 'Handpicked from top brands' },
]

export default function BenefitsBar() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BENEFITS.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shrink-0">
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
