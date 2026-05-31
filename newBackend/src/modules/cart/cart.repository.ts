import { PrismaClient } from "@prisma/client";

// ============================================================
// Prisma include shape
// ============================================================

export const cartInclude = {
  items: {
    include: {
      product: { select: { name: true, basePrice: true } },
      variant: { select: { price: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
} as const;

// ============================================================
// Types
// ============================================================

export type PrismaCartFull = Awaited<
  ReturnType<CartRepository["findByUserId"]>
>;

// ============================================================
// CartRepository
// ============================================================

export class CartRepository {
  constructor(private readonly db: PrismaClient) {}

  // ----------------------------------------------------------
  // Find cart by userId (null if not exists)
  // ----------------------------------------------------------

  async findByUserId(userId: string) {
    return this.db.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  }

  // ----------------------------------------------------------
  // Find cart id only (lightweight — no items join)
  // ----------------------------------------------------------

  async findIdByUserId(userId: string) {
    return this.db.cart.findUnique({
      where: { userId },
      select: { id: true },
    });
  }

  // ----------------------------------------------------------
  // Upsert cart — create if not exists, touch updatedAt if exists
  // ----------------------------------------------------------

  async upsert(userId: string) {
    return this.db.cart.upsert({
      where: { userId },
      create: { userId },
      update: { updatedAt: new Date() },
      include: cartInclude,
    });
  }

  // ----------------------------------------------------------
  // Touch updatedAt (call after mutating items)
  // ----------------------------------------------------------

  async touch(cartId: string) {
    return this.db.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });
  }

  // ----------------------------------------------------------
  // CartItem — find by cartId + productId
  // ----------------------------------------------------------

  async findItem(cartId: string, productId: string) {
    return this.db.cartItem.findFirst({
      where: { cartId, productId },
    });
  }

  // ----------------------------------------------------------
  // CartItem — upsert (increment if exists, create if not)
  // ----------------------------------------------------------

  async upsertItem(params: {
    cartId: string;
    productId: string;
    variantId: string | null;
    quantity: number;
  }) {
    return this.db.cartItem.upsert({
      where: {
        cartId_productId_variantId: {
          cartId: params.cartId,
          productId: params.productId,
          variantId: params.variantId ?? "",
        },
      },
      create: {
        cartId: params.cartId,
        productId: params.productId,
        variantId: params.variantId ?? "",
        quantity: params.quantity,
      },
      update: {
        quantity: { increment: params.quantity },
        updatedAt: new Date(),
      },
    });
  }

  // ----------------------------------------------------------
  // CartItem — set quantity
  // ----------------------------------------------------------

  async setItemQuantity(itemId: string, quantity: number) {
    return this.db.cartItem.update({
      where: { id: itemId },
      data: { quantity, updatedAt: new Date() },
    });
  }

  // ----------------------------------------------------------
  // CartItem — delete single item
  // ----------------------------------------------------------

  async deleteItem(itemId: string) {
    return this.db.cartItem.delete({ where: { id: itemId } });
  }

  // ----------------------------------------------------------
  // CartItem — delete all items in a cart
  // ----------------------------------------------------------

  async deleteAllItems(cartId: string) {
    return this.db.cartItem.deleteMany({ where: { cartId } });
  }
}