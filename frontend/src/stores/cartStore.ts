// stores/cartStore.ts
import { create } from "zustand";
import { cartApi, CartItem } from "@/lib/api";

interface CartState {
  items:       CartItem[];
  totalAmount: string;
  isLoading:   boolean;
  error:       string | null;

  itemCount:  () => number;
  fetchCart:  () => Promise<void>;
  addItem:    (productId: string, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart:  () => Promise<void>;
  resetLocal: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items:       [],
  totalAmount: "0",
  isLoading:   false,
  error:       null,

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  resetLocal: () => set({ items: [], totalAmount: "0" }),

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartApi.get();
      set({ items: cart.items, totalAmount: cart.totalAmount });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "โหลดตะกร้าล้มเหลว" });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartApi.add(productId, quantity);
      set({ items: cart.items, totalAmount: cart.totalAmount });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "เพิ่มสินค้าล้มเหลว" });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (productId, quantity) => {
    if (quantity <= 0) { get().removeItem(productId); return; }
    // Optimistic update
    const prev = get().items;
    set({
      items: prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity, total: (parseFloat(i.price) * quantity).toFixed(2) }
          : i
      ),
    });
    try {
      const cart = await cartApi.update(productId, quantity);
      set({ items: cart.items, totalAmount: cart.totalAmount });
    } catch (e: any) {
      set({ items: prev, error: e?.response?.data?.message ?? "อัปเดตล้มเหลว" });
    }
  },

  removeItem: async (productId) => {
    const prev = get().items;
    set({ items: prev.filter((i) => i.productId !== productId) });
    try {
      const cart = await cartApi.remove(productId);
      set({ items: cart.items, totalAmount: cart.totalAmount });
    } catch (e: any) {
      set({ items: prev, error: e?.response?.data?.message ?? "ลบสินค้าล้มเหลว" });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await cartApi.clear();
      set({ items: [], totalAmount: "0" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
