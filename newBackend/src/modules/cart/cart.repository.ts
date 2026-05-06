import { PrismaClient, Cart, CartItem, Prisma } from '@prisma/client';

// Full cart item with relations needed to build CartItemDto
export const cartItemSelect = {
  id: true,
  quantity: true,
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      basePrice: true,
      comparePrice: true,
      stock: true,
      hasVariants: true,
      isActive: true,
      deletedAt: true,
      images: {
        where: { isPrimary: true },
        select: { url: true },
        take: 1,
      },
    },
  },
  variant: {
    select: {
      id: true,
      sku: true,
      price: true,
      comparePrice: true,
      stock: true,
      image: true,
      isActive: true,
      variantOption: {
        select: {
          optionValue: {
            select: {
              value: true,
              option: { select: { name: true } },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CartItemSelect;

export type CartItemWithRelations = Prisma.CartItemGetPayload<{
  select: typeof cartItemSelect;
}>;

export type CartWithItems = Cart & { items: CartItemWithRelations[] };

export class CartRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // ─── Find ────────────────────────────────────────────────────────────────

  async findByUserId(userId: string): Promise<CartWithItems | null> {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { select: cartItemSelect } },
    });
  }

  async findOrCreate(userId: string): Promise<CartWithItems> {
    const existing = await this.findByUserId(userId);
    if (existing) return existing;

    return this.prisma.cart.create({
      data: { userId },
      include: { items: { select: cartItemSelect } },
    });
  }

  // ─── Items ───────────────────────────────────────────────────────────────

  async findItem(
    cartId: string,
    productId: string,
    variantId: string | null,
  ): Promise<CartItem | null> {
    return this.prisma.cartItem.findUnique({
      where: {
        cartId_productId_variantId: {
          cartId,
          productId,
          variantId: variantId ?? '',
        },
      },
    });
  }

  async findItemById(cartItemId: string, cartId: string): Promise<CartItem | null> {
    return this.prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId },
    });
  }

  async upsertItem(
    cartId: string,
    productId: string,
    variantId: string | null,
    quantity: number,
  ): Promise<CartItem> {
    return this.prisma.cartItem.upsert({
      where: {
        cartId_productId_variantId: {
          cartId,
          productId,
          variantId: variantId ?? '',
        },
      },
      create: { cartId, productId, variantId, quantity },
      update: { quantity: { increment: quantity } },
    });
  }

  async updateItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async removeItem(cartItemId: string): Promise<void> {
    await this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async clearCart(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { cartId } });
  }

  // ─── Touch updatedAt ─────────────────────────────────────────────────────

  async touch(cartId: string): Promise<void> {
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });
  }

  // ─── Load fresh after mutation ───────────────────────────────────────────

  async reload(cartId: string): Promise<CartWithItems> {
    const cart = await this.prisma.cart.findUniqueOrThrow({
      where: { id: cartId },
      include: { items: { select: cartItemSelect } },
    });
    return cart;
  }
}
