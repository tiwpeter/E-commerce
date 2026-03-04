"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useShopQueries";

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PENDING:    { label: "รอดำเนินการ",      cls: "bg-yellow-100 text-yellow-700" },
  PROCESSING: { label: "กำลังเตรียมสินค้า", cls: "bg-blue-100 text-blue-700" },
  SHIPPED:    { label: "จัดส่งแล้ว",       cls: "bg-purple-100 text-purple-700" },
  DELIVERED:  { label: "ได้รับสินค้าแล้ว",  cls: "bg-green-100 text-green-700" },
  CANCELLED:  { label: "ยกเลิกแล้ว",       cls: "bg-red-100 text-red-600" },
};

export function OrderList() {
  const { data: orders, isLoading, isError } = useOrders();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (isLoading) return (
    <div className="flex items-center justify-center gap-2 py-16 text-zinc-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
      <span className="text-sm">กำลังโหลดคำสั่งซื้อ...</span>
    </div>
  );

  if (isError) return (
    <div className="rounded-2xl bg-red-50 p-5 text-sm font-semibold text-red-600">❌ โหลดคำสั่งซื้อล้มเหลว</div>
  );

  return (
    <section className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-black tracking-tight text-zinc-900">ประวัติการสั่งซื้อ</h2>
      {!orders?.length ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-200 py-16 text-center">
          <span className="text-5xl">📋</span>
          <p className="font-semibold text-zinc-500">ยังไม่มีประวัติการสั่งซื้อ</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status] ?? { label: order.status, cls: "bg-zinc-100 text-zinc-600" };
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
                <button onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-zinc-50">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs font-bold text-zinc-400">#{order.id.toUpperCase()}</p>
                    <p className="text-sm font-bold text-zinc-800">
                      {new Date(order.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.cls}`}>{status.label}</span>
                  <span className="font-black text-zinc-900">฿{parseFloat(order.totalAmount).toLocaleString()}</span>
                  <svg className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="border-t border-zinc-100 px-4 pb-4 pt-3">
                    {order.trackingNumber && (
                      <p className="mb-3 rounded-xl bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700">
                        🚚 หมายเลขพัสดุ: {order.trackingNumber}
                      </p>
                    )}
                    <div className="flex flex-col gap-2">
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between text-sm">
                          <span className="text-zinc-700">{item.name}</span>
                          <span className="text-zinc-400">×{item.quantity}</span>
                          <span className="font-bold text-zinc-800">฿{parseFloat(item.total).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
