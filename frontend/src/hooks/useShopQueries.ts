// hooks/useShopQueries.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  productApi, orderApi, addressApi,
  ProductFilters, AddressPayload, CreateOrderPayload,
} from "@/lib/api";
import { useCartStore } from "@/stores/cartStore";

// ── Query Keys ────────────────────────────────────────────────────────────────
export const QK = {
  products:  (f?: ProductFilters) => ["products", f] as const,
  product:   (slug: string)       => ["product", slug] as const,
  reviews:   (id: string)         => ["reviews", id] as const,
  orders:    ()                   => ["orders"] as const,
  order:     (id: string)         => ["order", id] as const,
  addresses: ()                   => ["addresses"] as const,
};

// ── Products ──────────────────────────────────────────────────────────────────
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: QK.products(filters),
    queryFn:  () => productApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: QK.product(slug),
    queryFn:  () => productApi.get(slug),
    enabled:  !!slug,
  });
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: QK.reviews(productId),
    queryFn:  () => productApi.reviews(productId),
    enabled:  !!productId,
  });
}

export function useAddReview(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { rating: number; comment: string }) =>
      productApi.addReview(productId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.reviews(productId) });
      qc.invalidateQueries({ queryKey: QK.product(productId) });
    },
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────
export function useOrders() {
  return useQuery({ queryKey: QK.orders(), queryFn: () => orderApi.list() });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: QK.order(id),
    queryFn:  () => orderApi.get(id),
    enabled:  !!id,
  });
}

export function useCreateOrder() {
  const qc        = useQueryClient();
  const clearCart = useCartStore((s) => s.clearCart);
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderApi.create(payload),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: QK.orders() });
      clearCart();
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderApi.cancel(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QK.orders() }),
  });
}

// ── Addresses ─────────────────────────────────────────────────────────────────
export function useAddresses() {
  return useQuery({ queryKey: QK.addresses(), queryFn: () => addressApi.list() });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => addressApi.create(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QK.addresses() }),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AddressPayload> }) =>
      addressApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.addresses() }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressApi.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QK.addresses() }),
  });
}
