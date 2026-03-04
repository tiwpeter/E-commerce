// lib/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ── Token helpers ──────────────────────────────────────────────────────────────
export const getAccessToken  = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken")  : null;
export const getRefreshToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("accessToken",  access);
  localStorage.setItem("refreshToken", refresh);
};
export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// ── Request: attach Bearer ─────────────────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: silent refresh on 401 ───────────────────────────────────────────
let isRefreshing = false;
let queue: Array<{
  resolve: (token: string) => void;
  reject:  (err: unknown) => void;
}> = [];

const flushQueue = (err: unknown, token: string | null) => {
  queue.forEach((p) => (token ? p.resolve(token) : p.reject(err)));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing    = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token");

      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const newAccess: string  = data.accessToken;
      const newRefresh: string = data.refreshToken ?? refreshToken;

      setTokens(newAccess, newRefresh);
      flushQueue(null, newAccess);

      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (err) {
      flushQueue(err, null);
      clearTokens();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
