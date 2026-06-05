"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCartsUserId,
  useGetCartsUserIdSummary,
  usePostCartsUserIdItems,
  usePatchCartsUserIdItemsProductId,
  useDeleteCartsUserIdItemsProductId,
  useDeleteCartsUserId,
  getGetCartsUserIdQueryKey,
  getGetCartsUserIdSummaryQueryKey,
} from "@/api/generated"; // adjust to your orval path
import type {
  Cart,
  CartItem,
  CartSummary,
  AddToCartInput,
} from "@/api/generated";
import { useAuth } from "@/store/auth";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface CartContextValue {
  cart: Cart | undefined;
  summary: CartSummary | undefined;
  isLoading: boolean;
  addItem: (input: AddToCartInput) => Promise<CartItem>;
  updateQty: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

/* ------------------------------------------------------------------ */
/*  Context                                                             */
/* ------------------------------------------------------------------ */

const CartContext = createContext<CartContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                            */
/* ------------------------------------------------------------------ */

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id ?? "";

  // โ”€โ”€ Queries โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€
  const { data: cart, isLoading: cartLoading } = useGetCartsUserId(userId, {
    query: { enabled: !!userId },
  });

  const { data: summary, isLoading: summaryLoading } =
    useGetCartsUserIdSummary(userId, {
      query: { enabled: !!userId },
    });

  // โ”€โ”€ Mutations โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€
  const addMutation    = usePostCartsUserIdItems();
  const updateMutation = usePatchCartsUserIdItemsProductId();
  const removeMutation = useDeleteCartsUserIdItemsProductId();
  const clearMutation  = useDeleteCartsUserId();

  // helper: refetch both cart + summary after any mutation
  const invalidateCart = useCallback(() =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: getGetCartsUserIdQueryKey(userId) }),
      queryClient.invalidateQueries({ queryKey: getGetCartsUserIdSummaryQueryKey(userId) }),
    ]),
    [queryClient, userId]
  );

  // โ”€โ”€ Actions โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€

  const addItem = useCallback(
    async (input: AddToCartInput) => {
      const item = await addMutation.mutateAsync({ userId, data: input });
      await invalidateCart();
      return item;
    },
    [addMutation, userId, invalidateCart]
  );

  const updateQty = useCallback(
    async (productId: string, quantity: number) => {
      await updateMutation.mutateAsync({
        userId,
        productId,
        data: { quantity },
      });
      await invalidateCart();
    },
    [updateMutation, userId, invalidateCart]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      await removeMutation.mutateAsync({ userId, productId });
      await invalidateCart();
    },
    [removeMutation, userId, invalidateCart]
  );

  const clearCart = useCallback(async () => {
    await clearMutation.mutateAsync({ userId });
    await invalidateCart();
  }, [clearMutation, userId, invalidateCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        summary,
        isLoading: cartLoading || summaryLoading,
        addItem,
        updateQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
