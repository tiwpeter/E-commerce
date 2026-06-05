// src/lib/token-store.ts
//
// Single source of truth สำหรับ auth tokens
// ─────────────────────────────────────────────────────────────────────
// ปัญหาเดิม:
//   - axios interceptor อ่าน + JSON.parse localStorage ทุก request
//   - auth-context เซฟ token ลง localStorage เอง (key เดียวกัน)
//   - logout ไม่ได้ล้าง localStorage → token หลงเหลืออยู่
//
// แก้ด้วย module-level variable:
//   - อ่าน localStorage แค่ครั้งเดียวตอน module load
//   - ทุกครั้งที่ set/clear token ทำผ่าน function เดียว
//   - axios interceptor แค่ getAccessToken() ไม่ต้อง parse อะไรเลย

const STORAGE_KEY = 'auth-storage';

// ── In-memory cache ───────────────────────────────────────────────────
let _accessToken: string | null = null;
let _refreshToken: string | null = null;

// ── Bootstrap: อ่าน localStorage ครั้งเดียวตอน app โหลด ─────────────
function loadFromStorage(): void {
  if (typeof window === 'undefined') return; // SSR guard
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    _accessToken  = parsed?.state?.accessToken  ?? null;
    _refreshToken = parsed?.state?.refreshToken ?? null;
  } catch {
    // malformed JSON → treat as no token
  }
}

loadFromStorage();

// ── Public API ────────────────────────────────────────────────────────

/** อ่าน access token จาก memory (ไม่แตะ localStorage) */
export function getAccessToken(): string | null {
  return _accessToken;
}

/** อ่าน refresh token จาก memory (ไม่แตะ localStorage) */
export function getRefreshToken(): string | null {
  return _refreshToken;
}

/** เซฟ token ทั้งคู่ → memory + localStorage พร้อมกัน */
export function setTokens(accessToken: string, refreshToken: string): void {
  _accessToken  = accessToken;
  _refreshToken = refreshToken;

  if (typeof window !== 'undefined') {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { accessToken, refreshToken } }),
    );
  }
}

/** ล้าง token ทั้งหมด — เรียกตอน logout */
export function clearTokens(): void {
  _accessToken  = null;
  _refreshToken = null;

  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}