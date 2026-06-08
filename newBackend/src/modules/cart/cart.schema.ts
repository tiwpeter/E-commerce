import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// ============================================================
// Base Schemas
// ============================================================

export const CartItemSchema = z
  .object({
    id: z.string().openapi({ example: "ci_aBcDeFgHiJ" }),
    productId: z.string().openapi({ example: "prod_001" }),
    variantId: z.string().nullable().optional().openapi({ example: "var_red_L" }),
    quantity: z.number().int().min(1).openapi({ example: 2 }),
    // Snapshot from ProductService — not stored in cart store
    productName: z.string().optional().openapi({ example: "Classic T-Shirt" }),
    price: z.number().optional().openapi({ example: 29.99 }),
    createdAt: z.date().openapi({ example: "2024-06-01T08:00:00.000Z" }),
    updatedAt: z.date().openapi({ example: "2024-06-01T09:00:00.000Z" }),
  })
  .openapi("CartItem");

export const CartSchema = z
  .object({
    id: z.string().openapi({ example: "cart_xYzAbCdEfG" }),
    userId: z.string().openapi({ example: "clx1a2b3c4d5e6f7g8h9i0j" }),
    items: z.array(CartItemSchema),
    createdAt: z.date().openapi({ example: "2024-06-01T08:00:00.000Z" }),
    updatedAt: z.date().openapi({ example: "2024-06-01T09:15:00.000Z" }),
  })
  .openapi("Cart");

export const CartSummarySchema = z
  .object({
    itemCount: z.number().int().openapi({ example: 5 }),
    totalPrice: z.number().openapi({ example: 149.95 }),
    
  })
  .openapi("CartSummary");

export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;

// ============================================================
// Request Schemas
// ============================================================

export const AddToCartSchema = z
  .object({
    productId: z.string().min(1, "productId is required").openapi({ example: "prod_001" }),
    variantId: z.string().optional().openapi({ example: "var_red_L" }),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .default(1)
      .openapi({ example: 1 }),
  })
  .openapi("AddToCartInput");

export const UpdateCartItemSchema = z
  .object({
    quantity: z
      .number()
      .int()
      .min(0, "Quantity must be 0 or more")
      .openapi({ example: 3, description: "Set to 0 to remove the item" }),
  })
  .openapi("UpdateCartItemInput");

export const CartParamsSchema = z.object({
  userId: z.string().min(1, "userId is required").openapi({ example: "clx1a2b3c4d5e6f7g8h9i0j" }),
});

export const CartItemParamsSchema = z.object({
  userId: z.string().min(1).openapi({ example: "clx1a2b3c4d5e6f7g8h9i0j" }),
  productId: z.string().min(1).openapi({ example: "prod_001" }),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;