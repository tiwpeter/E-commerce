"use client";
import { Product } from "@/lib/model";
import { createContext, useContext, useState, ReactNode } from "react";

// แยกความรับผิดชอบ
interface CartItem {
  id: string;
  title: string;
  price: number | string; // ✅ แก้ตรงนี้
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === product.id);
      if (exist) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            price: Number(product.price), // ✅ ป้องกัน type error
            image: product.images[0] ?? "",
            quantity: 1,
          },
        ];
      }
    });
  };
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
