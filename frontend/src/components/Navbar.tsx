"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

export function Navbar() {
  const pathname   = usePathname();
  const { user, logout } = useAuthStore();
  const itemCount  = useCartStore((s) => s.itemCount);

  const navLinks = [
    { href: "/",         label: "หน้าแรก" },
    { href: "/shop",     label: "สินค้า" },
    { href: "/orders",   label: "คำสั่งซื้อ" },
    { href: "/profile",  label: "ที่อยู่" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-black tracking-tight text-zinc-900">
          🛍️ <span className="text-amber-500">Shop</span>Thai
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
                pathname === l.href
                  ? "bg-amber-400 text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative rounded-xl p-2 text-zinc-600 hover:bg-zinc-100 transition">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8l-1.5 6h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {itemCount() > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-zinc-900">
                {itemCount()}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs font-semibold text-zinc-600 sm:block">
                สวัสดี, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={() => logout()}
                className="rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-50"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link href="/login"
              className="rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-zinc-900 transition hover:bg-amber-300"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
