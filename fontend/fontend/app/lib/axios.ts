// src/lib/axios.ts
import axios, { AxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.accessToken;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ✅ เพิ่มตรงนี้ — orval ต้องการฟังก์ชันนี้
export const customAxios = <T>(config: AxiosRequestConfig): Promise<T> => {
  return api(config).then((res) => res.data);
};