"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

const INPUT = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100";
const LABEL = "block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5";

export function AuthForms() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "register">("login");
  const { login, register, isLoading, error, clearError } = useAuthStore();
  const fetchCart = useCartStore((s) => s.fetchCart);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [localErr, setLocalErr] = useState("");

  const onSuccess = async () => {
    await fetchCart();
    router.push("/shop");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); setLocalErr("");
    try { await login(email, password); await onSuccess(); } catch { /* error in store */ }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setLocalErr("รหัสผ่านไม่ตรงกัน"); return; }
    clearError(); setLocalErr("");
    try { await register(name, email, password); await onSuccess(); } catch { /* error in store */ }
  };

  const errMsg = localErr || error;

  const switchView = (v: "login" | "register") => {
    setView(v); clearError(); setLocalErr("");
    setEmail(""); setPassword(""); setName(""); setConfirm("");
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
      <div className="mb-6">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-2xl">
          {view === "login" ? "🛍️" : "✨"}
        </div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-900">
          {view === "login" ? "ยินดีต้อนรับกลับ" : "สมัครสมาชิก"}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {view === "login" ? "เข้าสู่ระบบเพื่อดำเนินการต่อ" : "สร้างบัญชีใหม่เพื่อเริ่มช้อปปิ้ง"}
        </p>
      </div>

      <form onSubmit={view === "login" ? handleLogin : handleRegister} className="flex flex-col gap-4">
        {view === "register" && (
          <div>
            <label className={LABEL}>ชื่อผู้ใช้</label>
            <input required className={INPUT} placeholder="ชื่อของคุณ" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div>
          <label className={LABEL}>อีเมล</label>
          <input type="email" required className={INPUT} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={LABEL}>รหัสผ่าน</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} required minLength={8}
              className={`${INPUT} pr-12`} placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        {view === "register" && (
          <div>
            <label className={LABEL}>ยืนยันรหัสผ่าน</label>
            <input type="password" required className={INPUT} placeholder="พิมพ์รหัสผ่านอีกครั้ง"
              value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
        )}
        {errMsg && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500">⚠️ {errMsg}</p>
        )}
        <button type="submit" disabled={isLoading}
          className="mt-1 w-full rounded-xl bg-amber-400 py-3 text-sm font-bold tracking-wide text-zinc-900 transition hover:bg-amber-300 active:scale-[0.98] disabled:opacity-50">
          {isLoading
            ? (view === "login" ? "กำลังเข้าสู่ระบบ..." : "กำลังสร้างบัญชี...")
            : (view === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก")}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-500">
        {view === "login" ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}{" "}
        <button onClick={() => switchView(view === "login" ? "register" : "login")}
          className="font-bold text-amber-600 transition hover:text-amber-500">
          {view === "login" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
        </button>
      </p>
    </div>
  );
}
