import { z } from 'zod';

// ─── Request DTOs ────────────────────────────────────────────────────────────

export const AddToCartSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  quantity: z.number().int().min(1).max(100).default(1),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(100), // 0 = remove
});

export const RemoveCartItemSchema = z.object({
  cartItemId: z.string().cuid(),
});

export type AddToCartDto = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemDto = z.infer<typeof UpdateCartItemSchema>;

// ─── Response DTOs ───────────────────────────────────────────────────────────

export interface CartItemVariantDto {
  id: string;
  sku: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  image: string | null;
  options: { name: string; value: string }[];
}

export interface CartItemProductDto {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  comparePrice: number | null;
  primaryImage: string | null;
  stock: number;
  hasVariants: boolean;
}

export interface CartItemDto {
  id: string;
  quantity: number;
  unitPrice: number;        // effective price (variant.price or product.basePrice)
  comparePrice: number | null;
  subtotal: number;
  product: CartItemProductDto;
  variant: CartItemVariantDto | null;
  isAvailable: boolean;     // still active & in stock
  maxQuantity: number;      // min(stock, 100)
}

export interface CartSummaryDto {
  itemCount: number;        // total items
  lineCount: number;        // distinct lines
  subtotal: number;
  compareSubtotal: number | null;  // null if no items have comparePrice
  savings: number | null;
}

export interface CartDto {
  id: string;
  userId: string;
  items: CartItemDto[];
  summary: CartSummaryDto;
  updatedAt: Date;
}
