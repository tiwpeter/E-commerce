import { prisma } from '../config/database';

const cartWithItems = {
  include: {
    items: {
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' } as const,
    },
  },
};

export class CartRepository {
  async findByUserId(userId: string) {
    return prisma.cart.findUnique({ where: { userId }, ...cartWithItems });
  }

  async upsertCart(userId: string) {
    return prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      ...cartWithItems,
    });
  }

  async addItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      create: { cartId, productId, quantity },
      update: { quantity: { increment: quantity } },
    });
  }

  async updateItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { cartId_productId: { cartId, productId } },
      data: { quantity },
    });
  }

  async removeItem(cartId: string, productId: string): Promise<void> {
    await prisma.cartItem.delete({
      where: { cartId_productId: { cartId, productId } },
    });
  }

  async clearCart(cartId: string): Promise<void> {
    await prisma.cartItem.deleteMany({ where: { cartId } });
  }

  async findItem(cartId: string, productId: string) {
    return prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });
  }
}

export const cartRepository = new CartRepository();
