// src/lib/axios.ts
import axios, { type AxiosRequestConfig } from 'axios';
import env from '@/lib/env';
import { getAccessToken } from '@/lib/token-store';

// ── Axios instance ────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor ───────────────────────────────────────────────
// Before: JSON.parse(localStorage.getItem(...)) on every request → slow
// Now: getAccessToken() reads from memory immediately without touching localStorage
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── customAxios — orval mutator ───────────────────────────────────────
type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export const customAxios = <T>(config: AxiosRequestConfig): Promise<T> =>
  api(config).then((res: { data: ApiResponse<T> }) => res.data.data);