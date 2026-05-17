import Link from 'next/link'

export default function SaleBanner() {
  return (
    <section className="relative rounded-3xl overflow-hidden bg-black min-h-[200px] flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80"
        alt="Sale"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="relative z-10 px-10 py-12">
        <span className="inline-block bg-white/10 border border-white/20 text-white text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
          Limited Time
        </span>
        <h2 className="text-white text-4xl font-black leading-tight mb-2">
          ลดสูงสุด 50%
          <span className="block text-gray-300 text-2xl font-semibold mt-1">สินค้าคัดพิเศษ</span>
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          โปรโมชั่นพิเศษสำหรับสมาชิก ÉLITE เท่านั้น จำนวนจำกัด
        </p>
        <Link
          href="#"
          className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-100 active:scale-95 transition-all duration-150"
        >
          ช้อปเลย →
        </Link>
      </div>
    </section>
  )
}
