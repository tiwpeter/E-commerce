"use client";
// src/app/context/auth-context.tsx

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAuthMe,
  getGetAuthMeQueryKey,
  usePostAuthLogin,
  usePostAuthRegister,
  usePostAuthLogout,
} from "@/api/generated";
import type { LoginInput, RegisterInput, AuthUser } from "@/api/generated";
import { setTokens, clearTokens } from "@/lib/token-store";

// ── Types ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useGetAuthMe({
    query: {
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  });

  const loginMutation    = usePostAuthLogin();
  const registerMutation = usePostAuthRegister();
  const logoutMutation   = usePostAuthLogout();

  const login = useCallback(
    async (data: LoginInput) => {
      const res = await loginMutation.mutateAsync({ data });

      // เดิม: เซฟ token ลง localStorage โดยตรง (key ต้องตรงกับ interceptor)
      // ใหม่: setTokens() จัดการทั้ง memory + localStorage ในที่เดียว
      setTokens(res.tokens.accessToken, res.tokens.refreshToken);

      await queryClient.invalidateQueries({ queryKey: getGetAuthMeQueryKey() });
    },
    [loginMutation, queryClient],
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      await registerMutation.mutateAsync({ data });
      await queryClient.invalidateQueries({ queryKey: getGetAuthMeQueryKey() });
    },
    [registerMutation, queryClient],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();

    // เดิม: queryClient.clear() อย่างเดียว — token ยังอยู่ใน localStorage!
    // ใหม่: ล้าง token ก่อน แล้วค่อย clear cache
    clearTokens();
    queryClient.clear();
  }, [logoutMutation, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}