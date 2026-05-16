import { randomBytes } from "crypto";
import type { Cart, CartItem, AddToCartInput, UpdateCartItemInput } from "./cart.schema";

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
// In-Memory Store
// ============================================================

const store = new Map<string, Cart>(); // key = userId

function generateId(): string {
  return randomBytes(10).toString("base64url");
}

function getOrCreateCart(userId: string): Cart {
  if (!store.has(userId)) {
    const now = new Date();
    store.set(userId, { id: generateId(), userId, items: [], createdAt: now, updatedAt: now });
  }
  return store.get(userId)!;
}

// ============================================================
// CartService
// ============================================================

export class CartService {
  constructor(private readonly productService: IProductService) {}

  /** Get cart for a user (auto-create if not exists) */
  async getCart(userId: string): Promise<Cart> {
    return getOrCreateCart(userId);
  }

  /** Add item — calls ProductService to validate product exists */
  async addItem(userId: string, data: AddToCartInput): Promise<Cart> {
    // Validate product exists via ProductService
    let product: { id: string; name: string; basePrice: number | string };
    try {
      product = await this.productService.getProductById(data.productId);
    } catch {
      throw new ProductUnavailableError(data.productId);
    }

    const cart = getOrCreateCart(userId);
    const key = `${data.productId}:${data.variantId ?? ""}`;

    const existingIndex = cart.items.findIndex(
      (i) => i.productId === data.productId && i.variantId === (data.variantId ?? null)
    );

    const now = new Date();

    if (existingIndex >= 0) {
      // Increment quantity
      cart.items[existingIndex].quantity += data.quantity;
      cart.items[existingIndex].updatedAt = now;
    } else {
      const newItem: CartItem = {
        id: generateId(),
        productId: data.productId,
        variantId: data.variantId ?? null,
        quantity: data.quantity,
        productName: product.name,
        price: Number(product.basePrice),
        createdAt: now,
        updatedAt: now,
      };
      cart.items.push(newItem);
    }

    cart.updatedAt = now;
    store.set(userId, cart);
    return cart;
  }

  /** Update quantity — quantity=0 removes the item */
  async updateItem(userId: string, productId: string, data: UpdateCartItemInput): Promise<Cart> {
    const cart = store.get(userId);
    if (!cart) throw new CartNotFoundError(userId);

    const index = cart.items.findIndex((i) => i.productId === productId);
    if (index < 0) throw new CartItemNotFoundError(productId);

    const now = new Date();

    if (data.quantity === 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = data.quantity;
      cart.items[index].updatedAt = now;
    }

    cart.updatedAt = now;
    store.set(userId, cart);
    return cart;
  }

  /** Remove single item */
  async removeItem(userId: string, productId: string): Promise<Cart> {
    return this.updateItem(userId, productId, { quantity: 0 });
  }

  /** Clear entire cart */
  async clearCart(userId: string): Promise<Cart> {
    const cart = store.get(userId);
    if (!cart) throw new CartNotFoundError(userId);

    cart.items = [];
    cart.updatedAt = new Date();
    store.set(userId, cart);
    return cart;
  }

  /** Summary: total items count + total price */
  async getCartSummary(userId: string): Promise<{ itemCount: number; total: number }> {
    const cart = getOrCreateCart(userId);
    const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const total = cart.items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);
    return { itemCount, total };
  }
}
