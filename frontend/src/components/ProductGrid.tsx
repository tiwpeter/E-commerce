"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useShopQueries";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { Product, ProductFilters } from "@/lib/api";
import { useRouter } from "next/navigation";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`h-3 w-3 ${i <= Math.round(rating) ? "text-amber-400" : "text-zinc-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-100">
      <div className="aspect-square bg-zinc-100" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-2 w-16 rounded bg-zinc-100" />
        <div className="h-3 w-full rounded bg-zinc-100" />
        <div className="h-3 w-3/4 rounded bg-zinc-100" />
        <div className="mt-1 h-5 w-20 rounded bg-zinc-100" />
        <div className="mt-1 h-9 w-full rounded-xl bg-zinc-100" />
      </div>
    </div>
  );
}

export function ProductGrid() {
  const router  = useRouter();
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 12 });
  const [addingId, setAddingId] = useState<string | null>(null);
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null);

  const { data, isLoading, isError, isFetching } = useProducts(filters);
  const addItem = useCartStore((s) => s.addItem);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) { router.push("/login"); return; }
    setAddingId(product.id);
    try {
      await addItem(product.id);
      showToast(`✅ เพิ่ม "${product.name}" แล้ว`);
    } catch {
      showToast("❌ เกิดข้อผิดพลาด กรุณาลองอีกครั้ง", false);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section>
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-xl transition ${toast.ok ? "bg-zinc-900" : "bg-red-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input type="text" placeholder="🔍 ค้นหาสินค้า..."
          className="rounded-xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
        />
        <select className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as ProductFilters["sort"], page: 1 }))}>
          <option value="">เรียงตาม</option>
          <option value="newest">ใหม่ล่าสุด</option>
          <option value="price_asc">ราคา: น้อย → มาก</option>
          <option value="price_desc">ราคา: มาก → น้อย</option>
          <option value="rating">คะแนนสูงสุด</option>
        </select>
        {isFetching && !isLoading && (
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <span className="inline-block h-3 w-3 animate-spin rounded-full border border-zinc-400 border-t-transparent" />
            กำลังโหลด...
          </span>
        )}
      </div>

      {isError && (
        <div className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          ❌ โหลดสินค้าล้มเหลว — ตรวจสอบ API URL ใน .env.local
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
          : data?.data.map((product) => {
              const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
              const hasDiscount = product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price);
              const discountPct = hasDiscount
                ? Math.round(((parseFloat(product.comparePrice!) - parseFloat(product.price)) / parseFloat(product.comparePrice!)) * 100)
                : 0;

              return (
                <article key={product.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {product.isFeatured && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-zinc-900">
                      Featured
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white">
                      -{discountPct}%
                    </span>
                  )}
                  <div className="relative aspect-square overflow-hidden bg-zinc-50">
                    {primary
                      ? <img src={primary.url} alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      : <div className="flex h-full items-center justify-center text-4xl text-zinc-200">📦</div>
                    }
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500">{product.category.name}</p>
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-zinc-800">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      <Stars rating={product.averageRating} />
                      <span className="text-xs text-zinc-400">({product.reviewCount})</span>
                    </div>
                    <div className="mt-auto flex items-baseline gap-2">
                      <span className="text-lg font-black text-zinc-900">฿{parseFloat(product.price).toLocaleString()}</span>
                      {hasDiscount && (
                        <span className="text-xs text-zinc-400 line-through">฿{parseFloat(product.comparePrice!).toLocaleString()}</span>
                      )}
                    </div>
                    <p className={`text-xs ${product.stock === 0 ? "text-red-400" : "text-zinc-400"}`}>
                      {product.stock === 0 ? "สินค้าหมด" : `เหลือ ${product.stock} ชิ้น`}
                    </p>
                    <button
                      disabled={product.stock === 0 || addingId === product.id}
                      onClick={() => handleAddToCart(product)}
                      className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-400 py-2 text-xs font-bold tracking-wide text-zinc-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {addingId === product.id
                        ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                        : "เพิ่มในตะกร้า"}
                    </button>
                  </div>
                </article>
              );
            })}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button disabled={filters.page === 1}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold transition hover:bg-zinc-50 disabled:opacity-40">
            ← ก่อนหน้า
          </button>
          <span className="text-sm text-zinc-500">หน้า {filters.page} / {data.totalPages}</span>
          <button disabled={filters.page === data.totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold transition hover:bg-zinc-50 disabled:opacity-40">
            ถัดไป →
          </button>
        </div>
      )}
    </section>
  );
}
