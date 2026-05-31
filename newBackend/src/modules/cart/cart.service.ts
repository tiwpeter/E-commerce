import type { Cart, CartItem, AddToCartInput, UpdateCartItemInput } from "./cart.schema";
import type { CartRepository, PrismaCartFull } from "./cart.repository";

// ============================================================
// Minimal ProductService interface (inject real one)
// ============================================================

export interface IProductService {
  getProductById(id: string): Promise<{ id: string; name: string; basePrice: number | string }>;
}

// ============================================================
// Custom Errors
// ============================================================

export class CartNotFoundError extends Error {
  constructor(userId: string) {
    super(`Cart not found for user: ${userId}`);
    this.name = "CartNotFoundError";
  }
}

export class CartItemNotFoundError extends Error {
  constructor(productId: string) {
    super(`Cart item not found: ${productId}`);
    this.name = "CartItemNotFoundError";
  }
}

export class ProductUnavailableError extends Error {
  constructor(productId: string) {
    super(`Product unavailable: ${productId}`);
    this.name = "ProductUnavailableError";
  }
}

// ============================================================
// Mapper: Prisma → Domain
// ============================================================

function toCartItem(
  item: NonNullable<PrismaCartFull>["items"][number]
): CartItem {
  const price = item.variant
    ? Number(item.variant.price)
    : Number(item.product.basePrice);

  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    productName: item.product.name,
    price,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function toCart(prismaCart: NonNullable<PrismaCartFull>): Cart {
  return {
    id: prismaCart.id,
    userId: prismaCart.userId,
    items: prismaCart.items.map(toCartItem),
    createdAt: prismaCart.createdAt,
    updatedAt: prismaCart.updatedAt,
  };
}

// ============================================================
// CartService
// ============================================================

export class CartService {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly productService: IProductService,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepo.upsert(userId);
    return toCart(cart);
  }

  async addItem(userId: string, data: AddToCartInput): Promise<Cart> {
    let product: { id: string; name: string; basePrice: number | string };
    try {
      product = await this.productService.getProductById(data.productId);
    } catch {
      throw new ProductUnavailableError(data.productId);
    }

    const cart = await this.cartRepo.upsert(userId);

    await this.cartRepo.upsertItem({
      cartId: cart.id,
      productId: data.productId,
      variantId: data.variantId ?? null,
      quantity: data.quantity,
    });

    await this.cartRepo.touch(cart.id);

    return this.getCart(userId);
  }

  async updateItem(
    userId: string,
    productId: string,
    data: UpdateCartItemInput,
  ): Promise<Cart> {
    const cart = await this.cartRepo.findIdByUserId(userId);
    if (!cart) throw new CartNotFoundError(userId);

    const item = await this.cartRepo.findItem(cart.id, productId);
    if (!item) throw new CartItemNotFoundError(productId);

    if (data.quantity === 0) {
      await this.cartRepo.deleteItem(item.id);
    } else {
      await this.cartRepo.setItemQuantity(item.id, data.quantity);
    }

    await this.cartRepo.touch(cart.id);

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    return this.updateItem(userId, productId, { quantity: 0 });
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepo.findIdByUserId(userId);
    if (!cart) throw new CartNotFoundError(userId);

    await this.cartRepo.deleteAllItems(cart.id);
    await this.cartRepo.touch(cart.id);

    return this.getCart(userId);
  }

  async getCartSummary(userId: string): Promise<{ itemCount: number; total: number }> {
    const cart = await this.getCart(userId);
    const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const total = cart.items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);
    return { itemCount, total };
  }
}