import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400 text-4xl shadow-lg">
          🛍️
        </div>
        <h1 className="mb-3 text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">
          Shop<span className="text-amber-500">Thai</span>
        </h1>
        <p className="mb-8 max-w-md text-zinc-500">
          E-Commerce พร้อมรัน — Next.js + Zustand + React Query + JWT Auth
        </p>
        <div className="flex gap-3">
          <Link href="/shop"
            className="rounded-2xl bg-amber-400 px-6 py-3 font-bold text-zinc-900 transition hover:bg-amber-300">
            ดูสินค้าทั้งหมด →
          </Link>
          <Link href="/login"
            className="rounded-2xl border border-zinc-200 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-50">
            เข้าสู่ระบบ
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
          {[
            { icon: "⚡", title: "React Query", desc: "Cache & sync อัตโนมัติ" },
            { icon: "🐻", title: "Zustand", desc: "Global state ง่ายๆ" },
            { icon: "🔐", title: "JWT + Refresh", desc: "Silent token refresh" },
            { icon: "📦", title: "TypeScript", desc: "Type-safe ทุก endpoint" },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
              <div className="mb-2 text-2xl">{f.icon}</div>
              <p className="font-bold text-zinc-800">{f.title}</p>
              <p className="text-sm text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
