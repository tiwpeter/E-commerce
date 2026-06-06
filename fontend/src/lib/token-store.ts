// src/lib/token-store.ts
//
// Single source of truth for auth tokens
// ─────────────────────────────────────────────────────────────────────
// Previous problem:
//   - axios interceptor read and JSON.parse localStorage on every request
//   - auth-context saved tokens to localStorage directly (same key)
//   - logout did not clear localStorage → stale tokens remained
//
// Fix with module-level variables:
//   - read localStorage only once on module load
//   - set/clear token through a single shared function
//   - axios interceptor just calls getAccessToken(), no parsing needed

// ── In-memory cache ───────────────────────────────────────────────────
let _accessToken: string | null = null;
let _refreshToken: string | null = null;

// ── Bootstrap: read localStorage once when the app loads ─────────────
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

/** Read access token from memory (do not touch localStorage) */
export function getAccessToken(): string | null {
  return _accessToken;
}

/** Read refresh token from memory (do not touch localStorage) */
export function getRefreshToken(): string | null {
  return _refreshToken;
}

/** Save both tokens to memory and localStorage together */
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

/** Clear all tokens — call on logout */
export function clearTokens(): void {
  _accessToken  = null;
  _refreshToken = null;

  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}