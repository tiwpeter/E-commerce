"use client";

import { useState } from "react";
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from "@/hooks/useShopQueries";
import { Address, AddressPayload } from "@/lib/api";

const INPUT = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100";
const LABEL = "block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5";

function AddressForm({ initial = {}, onDone }: { initial?: Partial<Address>; onDone: () => void }) {
  const [form, setForm] = useState<AddressPayload>({
    name: initial.name ?? "", phone: initial.phone ?? "",
    line1: initial.line1 ?? "", line2: initial.line2 ?? "",
    city: initial.city ?? "", province: initial.province ?? "",
    postalCode: initial.postalCode ?? "", country: initial.country ?? "Thailand",
  });
  const create = useCreateAddress();
  const update = useUpdateAddress();
  const isPending = create.isPending || update.isPending;
  const hasError  = create.isError  || update.isError;

  const set = (k: keyof AddressPayload) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initial.id) await update.mutateAsync({ id: initial.id, payload: form });
    else await create.mutateAsync(form);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className={LABEL}>ชื่อผู้รับ</label><input required className={INPUT} placeholder="ชื่อ นามสกุล" value={form.name} onChange={set("name")} /></div>
        <div><label className={LABEL}>เบอร์โทรศัพท์</label><input required className={INPUT} placeholder="0812345678" value={form.phone} onChange={set("phone")} /></div>
      </div>
      <div><label className={LABEL}>ที่อยู่ บรรทัด 1</label><input required className={INPUT} placeholder="บ้านเลขที่ ถนน ซอย" value={form.line1} onChange={set("line1")} /></div>
      <div><label className={LABEL}>ที่อยู่ บรรทัด 2 <span className="font-normal normal-case text-zinc-400">ไม่บังคับ</span></label><input className={INPUT} value={form.line2 ?? ""} onChange={set("line2")} /></div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className={LABEL}>อำเภอ/เขต</label><input required className={INPUT} value={form.city} onChange={set("city")} /></div>
        <div><label className={LABEL}>จังหวัด</label><input required className={INPUT} value={form.province} onChange={set("province")} /></div>
        <div><label className={LABEL}>รหัสไปรษณีย์</label><input required className={INPUT} maxLength={5} value={form.postalCode} onChange={set("postalCode")} /></div>
      </div>
      <div><label className={LABEL}>ประเทศ</label><input required className={INPUT} value={form.country} onChange={set("country")} /></div>
      {hasError && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500">⚠️ บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={isPending}
          className="flex-1 rounded-xl bg-amber-400 py-3 text-sm font-bold text-zinc-900 transition hover:bg-amber-300 disabled:opacity-50">
          {isPending ? "กำลังบันทึก..." : initial.id ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มที่อยู่"}
        </button>
        <button type="button" onClick={onDone}
          className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50">
          ยกเลิก
        </button>
      </div>
    </form>
  );
}

export function AddressManager() {
  const { data: addresses, isLoading } = useAddresses();
  const deleteAddr = useDeleteAddress();
  const [editing, setEditing] = useState<Address | "new" | null>(null);

  if (editing) return (
    <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
      <h2 className="mb-6 text-xl font-black text-zinc-900">{editing === "new" ? "เพิ่มที่อยู่ใหม่" : "แก้ไขที่อยู่"}</h2>
      <AddressForm initial={editing === "new" ? {} : editing} onDone={() => setEditing(null)} />
    </div>
  );

  if (isLoading) return (
    <div className="flex items-center justify-center gap-2 py-16 text-zinc-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
      <span className="text-sm">กำลังโหลดที่อยู่...</span>
    </div>
  );

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900">ที่อยู่จัดส่ง</h2>
        <button onClick={() => setEditing("new")}
          className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-900 transition hover:bg-amber-300">
          + เพิ่มที่อยู่
        </button>
      </div>
      {!addresses?.length ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-zinc-200 py-16 text-center">
          <span className="text-5xl">📍</span>
          <p className="font-semibold text-zinc-500">ยังไม่มีที่อยู่จัดส่ง</p>
          <button onClick={() => setEditing("new")}
            className="rounded-xl bg-amber-400 px-5 py-2.5 font-bold text-zinc-900 transition hover:bg-amber-300">
            + เพิ่มที่อยู่แรก
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-zinc-900">{addr.name} <span className="font-normal text-zinc-500">• {addr.phone}</span></p>
                  <p className="mt-0.5 text-sm text-zinc-600">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.province} {addr.postalCode}
                  </p>
                  <p className="text-sm text-zinc-400">{addr.country}</p>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <button onClick={() => setEditing(addr)}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-50">
                    แก้ไข
                  </button>
                  <button disabled={deleteAddr.isPending} onClick={() => deleteAddr.mutate(addr.id)}
                    className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50">
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
