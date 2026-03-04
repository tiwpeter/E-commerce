// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, User, AuthResponse } from "@/lib/api";
import { clearTokens, setTokens } from "@/lib/axios";

interface AuthState {
  user:         User | null;
  accessToken:  string | null;
  refreshToken: string | null;
  isLoading:    boolean;
  error:        string | null;
  isHydrated:   boolean;

  login:      (email: string, password: string) => Promise<void>;
  register:   (name: string, email: string, password: string) => Promise<void>;
  logout:     () => Promise<void>;
  fetchMe:    () => Promise<void>;
  applyTokens:(res: AuthResponse) => void;
  clearError: () => void;
  setHydrated:() => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,
      isLoading:    false,
      error:        null,
      isHydrated:   false,

      setHydrated: () => set({ isHydrated: true }),
      clearError:  () => set({ error: null }),

      applyTokens: (res: AuthResponse) => {
        setTokens(res.accessToken, res.refreshToken);
        set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken });
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(email, password);
          get().applyTokens(res);
        } catch (e: any) {
          const msg = e?.response?.data?.message ?? "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register(name, email, password);
          get().applyTokens(res);
        } catch (e: any) {
          const msg = e?.response?.data?.message ?? "สมัครสมาชิกล้มเหลว";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try { await authApi.logout(); } catch { /* ignore */ }
        clearTokens();
        set({ user: null, accessToken: null, refreshToken: null });
      },

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const user = await authApi.me();
          set({ user });
        } catch {
          clearTokens();
          set({ user: null, accessToken: null, refreshToken: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (s) => ({
        user:         s.user,
        accessToken:  s.accessToken,
        refreshToken: s.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
        if (state?.accessToken) {
          setTokens(state.accessToken, state.refreshToken ?? "");
        }
      },
    }
  )
);
