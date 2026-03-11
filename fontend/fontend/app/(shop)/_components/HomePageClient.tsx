// src/app/(shop)/_components/HomePageClient.tsx
// ─────────────────────────────────────────────────────────────────
// Client Component — orchestrator เท่านั้น
// ทำหน้าที่: เรียก hooks → รับ data → ส่ง props ลง feature components
// ไม่มี UI ของตัวเอง ไม่มี logic การแสดงผล
// ─────────────────────────────────────────────────────────────────
'use client'

import { FeaturedProducts } from '@/(shop)/_components/FeaturedProducts'

export function HomePageClient() {
  return (
    <div className="space-y-16 pb-16">

      {/* Featured — hook อยู่ข้างใน component นั้นเลย */}
      <FeaturedProducts />

      

    </div>
  )
}