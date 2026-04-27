// src/lib/axios.ts
import axios, { type AxiosRequestConfig } from 'axios';

// ── Axios instance ───────────────────────────────────────────────
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: แนบ Bearer token ───────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      try {
        const token = JSON.parse(raw)?.state?.accessToken;
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch {
        // ignore malformed JSON
      }
    }
  }
  return config;
});

// ── customAxios — orval mutator ──────────────────────────────────
// orval จะ generate code เรียก customAxios(config) แทน axios โดยตรง
// signature ต้องรับ AxiosRequestConfig และ return Promise<T>
export const customAxios = <T>(config: AxiosRequestConfig): Promise<T> =>
  api(config).then((res) => res.data);