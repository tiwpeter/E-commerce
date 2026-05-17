import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[420px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
        <p className="text-gray-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          Premium Shopping Experience
        </p>
        <h1 className="text-white text-5xl md:text-6xl font-black leading-tight tracking-tight mb-4">
          สินค้า<br />
          <span className="text-gray-300">คุณภาพสูง</span><br />
          ทุกชิ้น
        </h1>
        <p className="text-gray-400 text-sm max-w-xs mb-8 leading-relaxed">
          คัดสรรสินค้าคุณภาพระดับพรีเมียมจากแบรนด์ชั้นนำทั่วโลก ส่งถึงมือคุณ
        </p>
        <div>
          <Link
            href="#products"
            className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 active:scale-95 transition-all duration-150"
          >
            เลือกชมสินค้า →
          </Link>
        </div>
      </div>
    </section>
  )
}
