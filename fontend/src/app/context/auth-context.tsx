"use client";

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
} from "@/api/generated"; // adjust to your orval-generated path
import type { LoginInput, RegisterInput, AuthUser } from "@/api/generated";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface AuthContextValue {
  user: AuthUser | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

/* ------------------------------------------------------------------ */
/*  Context                                                             */
/* ------------------------------------------------------------------ */

const AuthContext = createContext<AuthContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                            */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // /auth/me – tells us who is logged in
  const { data: user, isLoading } = useGetAuthMe({
    query: {
      retry: false,           // a 401 means "not logged in", not an error
      staleTime: 1000 * 60 * 5,
    },
  });

  const loginMutation    = usePostAuthLogin();
  const registerMutation = usePostAuthRegister();
  const logoutMutation   = usePostAuthLogout();

  const login = useCallback(
    async (data: LoginInput) => {
      await loginMutation.mutateAsync({ data });
      await queryClient.invalidateQueries({ queryKey: getGetAuthMeQueryKey() });
    },
    [loginMutation, queryClient]
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      await registerMutation.mutateAsync({ data });
      await queryClient.invalidateQueries({ queryKey: getGetAuthMeQueryKey() });
    },
    [registerMutation, queryClient]
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    queryClient.clear(); // wipe all cached data on logout
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

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}