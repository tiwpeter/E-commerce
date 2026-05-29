import Link from 'next/link'
import { Truck } from 'lucide-react'

const FOOTER_CATEGORIES = ['อิเล็กทรอนิกส์', 'แฟชั่น', 'บ้านและสวน', 'ความงาม', 'กีฬา']
const FOOTER_LINKS = ['เกี่ยวกับเรา', 'ติดต่อเรา', 'นโยบายการคืนสินค้า', 'ติดตามออเดอร์', 'โปรโมชั่น']

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="text-2xl font-black tracking-widest mb-3">ÉLITE</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            แพลตฟอร์มช้อปปิ้งออนไลน์ที่คัดสรรสินค้าคุณภาพระดับพรีเมียม เพื่อประสบการณ์ช้อปปิ้งที่ดีที่สุด
          </p>
        </div>

        {/* Categories */}
        <div>
          <p className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">หมวดหมู่</p>
          <ul className="space-y-2 text-sm text-gray-400">
            {FOOTER_CATEGORIES.map(c => (
              <li key={c}>
                <Link href="#" className="hover:text-white transition-colors">{c}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">ลิงก์ด่วน</p>
          <ul className="space-y-2 text-sm text-gray-400">
            {FOOTER_LINKS.map(l => (
              <li key={l}>
                <Link href="#" className="hover:text-white transition-colors">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">รับข่าวสาร</p>
          <p className="text-sm text-gray-400 mb-3">รับโปรโมชั่นและดีลพิเศษก่อนใคร</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="อีเมลของคุณ"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-white/40 transition-colors"
            />
            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shrink-0">
              สมัคร
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2024 ÉLITE. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <Truck size={12} /> Free shipping on all orders
          </p>
        </div>
      </div>
    </footer>
  )
}
