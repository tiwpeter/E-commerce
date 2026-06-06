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

      // Previous behavior: save token directly to localStorage (key must match interceptor)
      // Updated behavior: setTokens() handles both memory and localStorage in one place
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

    // Previous behavior: only queryClient.clear() — token remained in localStorage
    // Updated behavior: clear tokens first, then clear the cache
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