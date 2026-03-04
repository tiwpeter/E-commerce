// lib/api.ts — typed wrappers สำหรับทุก endpoint
import { api } from "./axios";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string; name: string; email: string; role: "USER" | "ADMIN";
}
export interface Product {
  id: string; name: string; slug: string; price: string;
  comparePrice?: string; stock: number; isFeatured: boolean;
  averageRating: number; reviewCount: number;
  category: { id: string; name: string; slug: string };
  images: { id: string; url: string; isPrimary: boolean }[];
}
export interface CartItem {
  productId: string; name: string; price: string; quantity: number; total: string;
}
export interface Cart { items: CartItem[]; totalAmount: string; }
export interface Order {
  id: string; userId: string; items: CartItem[];
  totalAmount: string; status: string; trackingNumber?: string; createdAt: string;
}
export interface Review {
  id: string; user: { id: string; name: string }; rating: number; comment: string; createdAt: string;
}
export interface Address {
  id: string; name: string; phone: string; line1: string;
  line2?: string; city: string; province: string; postalCode: string; country: string;
}
export interface AuthResponse {
  user: User; accessToken: string; refreshToken: string;
}
export interface PaginatedResponse<T> {
  data: T[]; total: number; page: number; limit: number; totalPages: number;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
// lib/api.ts
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    console.log("Login API response:", res.data); // debug ดู response ทั้งหมด
    return res.data.data as AuthResponse;         // ← ดึงเฉพาะ data ที่มี user + tokens
  },
  register: async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { name, email, password });
    console.log("Register API response:", res.data); // debug
    return res.data.data as AuthResponse;
  },
  me: async () => {
    const res = await api.get("/auth/me");
    console.log("Me API response:", res.data);
    return res.data as User;
  },
  logout: async () => {
    const res = await api.post("/auth/logout");
    console.log("Logout API response:", res.data);
    return res.data;
  },
  refresh: async (refreshToken: string) => {
    const res = await api.post("/auth/refresh", { refreshToken });
    console.log("Refresh API response:", res.data);
    return res.data.data as AuthResponse;
  },
};

// ── Products ──────────────────────────────────────────────────────────────────
export interface ProductFilters {
  page?: number; limit?: number; search?: string;
  categoryId?: string; minPrice?: number; maxPrice?: number;
  featured?: boolean; sort?: "price_asc" | "price_desc" | "rating" | "newest";
}
export const productApi = {
  list:      (filters?: ProductFilters) =>
    api.get<PaginatedResponse<Product>>("/products", { params: filters }).then((r) => r.data),
  get:       (slug: string) =>
    api.get<Product>(`/products/${slug}`).then((r) => r.data),
  reviews:   (productId: string) =>
    api.get<Review[]>(`/products/${productId}/reviews`).then((r) => r.data),
  addReview: (productId: string, body: { rating: number; comment: string }) =>
    api.post<Review>(`/products/${productId}/reviews`, body).then((r) => r.data),
};

// ── Cart ──────────────────────────────────────────────────────────────────────
export const cartApi = {
  get:    () => api.get<Cart>("/cart").then((r) => r.data),
  add:    (productId: string, quantity: number) =>
    api.post<Cart>("/cart/items", { productId, quantity }).then((r) => r.data),
  update: (productId: string, quantity: number) =>
    api.patch<Cart>(`/cart/items/${productId}`, { quantity }).then((r) => r.data),
  remove: (productId: string) =>
    api.delete<Cart>(`/cart/items/${productId}`).then((r) => r.data),
  clear:  () => api.delete<Cart>("/cart").then((r) => r.data),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export interface CreateOrderPayload { addressId: string; note?: string; }
export const orderApi = {
  list:   () => api.get<Order[]>("/orders").then((r) => r.data),
  get:    (id: string) => api.get<Order>(`/orders/${id}`).then((r) => r.data),
  create: (payload: CreateOrderPayload) =>
    api.post<Order>("/orders", payload).then((r) => r.data),
  cancel: (id: string) =>
    api.patch<Order>(`/orders/${id}/cancel`).then((r) => r.data),
};

// ── Addresses ─────────────────────────────────────────────────────────────────
export type AddressPayload = Omit<Address, "id">;
export const addressApi = {
  list:   () => api.get<Address[]>("/addresses").then((r) => r.data),
  get:    (id: string) => api.get<Address>(`/addresses/${id}`).then((r) => r.data),
  create: (payload: AddressPayload) =>
    api.post<Address>("/addresses", payload).then((r) => r.data),
  update: (id: string, payload: Partial<AddressPayload>) =>
    api.patch<Address>(`/addresses/${id}`, payload).then((r) => r.data),
  delete: (id: string) => api.delete(`/addresses/${id}`).then((r) => r.data),
};
