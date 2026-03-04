"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

export function CartList() {
  const { items, totalAmount, isLoading, updateItem, removeItem } = useCartStore();
  const { user } = useAuthStore();

  if (!user) return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <span className="text-5xl">🔒</span>
      <p className="font-semibold text-zinc-600">กรุณาเข้าสู่ระบบเพื่อดูตะกร้าสินค้า</p>
      <Link href="/login" className="rounded-xl bg-amber-400 px-5 py-2.5 font-bold text-zinc-900 hover:bg-amber-300 transition">
        เข้าสู่ระบบ
      </Link>
    </div>
  );

  if (isLoading) return (
    <div className="flex items-center justify-center gap-2 py-16 text-zinc-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
      <span className="text-sm">กำลังโหลดตะกร้า...</span>
    </div>
  );

  return (
    <section className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-black tracking-tight text-zinc-900">ตะกร้าสินค้า</h2>
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-zinc-200 py-20 text-center">
          <span className="text-5xl">🛒</span>
          <p className="font-semibold text-zinc-500">ตะกร้าว่างเปล่า</p>
          <Link href="/shop" className="rounded-xl bg-amber-400 px-5 py-2.5 font-bold text-zinc-900 hover:bg-amber-300 transition">
            เลือกซื้อสินค้า
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-2xl">📦</div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-zinc-800">{item.name}</p>
                <p className="text-sm text-zinc-500">฿{parseFloat(item.price).toLocaleString()} / ชิ้น</p>
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-zinc-200 p-1">
                <button onClick={() => updateItem(item.productId, item.quantity - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100">−</button>
                <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                <button onClick={() => updateItem(item.productId, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100">+</button>
              </div>
              <div className="w-20 text-right">
                <p className="font-black text-zinc-900">฿{parseFloat(item.total).toLocaleString()}</p>
              </div>
              <button onClick={() => removeItem(item.productId)} className="text-zinc-300 transition hover:text-red-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          <div className="mt-2 rounded-2xl bg-zinc-900 p-5 text-white">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">รวมทั้งหมด</span>
              <span className="text-2xl font-black text-amber-400">฿{parseFloat(totalAmount).toLocaleString()}</span>
            </div>
            <Link href="/checkout"
              className="mt-4 block w-full rounded-xl bg-amber-400 py-3 text-center text-sm font-bold tracking-wide text-zinc-900 transition hover:bg-amber-300">
              ดำเนินการชำระเงิน →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
