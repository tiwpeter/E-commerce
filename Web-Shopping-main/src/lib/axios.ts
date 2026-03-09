// src/lib/axios.ts

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

// ────────────────────────────────────────────────
// Request interceptor — attach auth token if exists
// ────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: attach bearer token from localStorage / cookie
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ────────────────────────────────────────────────
// Response interceptor — normalize errors
// ────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Unknown error";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
