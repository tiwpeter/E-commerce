import { PrismaClient } from '@prisma/client';
import { AddToCartDto, CartDto, UpdateCartItemDto } from './cart.dto';
import {
  CartItemNotFoundError,
  InsufficientStockError,
  ProductNotFoundError,
  ProductUnavailableError,
  VariantNotFoundError,
  VariantRequiredError,
  VariantUnavailableError,
} from './cart.errors';
import { mapCart } from './cart.mapper';
import { CartRepository } from './cart.repository';

export class CartService {
  private readonly repo: CartRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.repo = new CartRepository(prisma);
  }

  // ─── Get cart ────────────────────────────────────────────────────────────

  async getCart(userId: string): Promise<CartDto> {
    const cart = await this.repo.findOrCreate(userId);
    return mapCart(cart);
  }

  // ─── Add item ────────────────────────────────────────────────────────────

  async addItem(userId: string, dto: AddToCartDto): Promise<CartDto> {
    const { productId, variantId = null, quantity } = dto;

    // 1. Validate product
    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
    });
    if (!product) throw new ProductNotFoundError(productId);
    if (!product.isActive) throw new ProductUnavailableError();

    // 2. Require variant when product has variants
    if (product.hasVariants && !variantId) {
      throw new VariantRequiredError();
    }

    // 3. Validate variant
    let effectiveStock = product.stock;
    if (variantId) {
      const variant = await this.prisma.productVariant.findFirst({
        where: { id: variantId, productId },
      });
      if (!variant) throw new VariantNotFoundError(variantId);
      if (!variant.isActive) throw new VariantUnavailableError();
      effectiveStock = variant.stock;
    }

    // 4. Stock check — account for items already in cart
    const cart = await this.repo.findOrCreate(userId);
    const existingItem = await this.repo.findItem(cart.id, productId, variantId);
    const alreadyInCart = existingItem?.quantity ?? 0;
    const requested = alreadyInCart + quantity;

    if (requested > effectiveStock) {
      throw new InsufficientStockError(Math.max(0, effectiveStock - alreadyInCart));
    }

    // 5. Upsert
    await this.repo.upsertItem(cart.id, productId, variantId, quantity);
    await this.repo.touch(cart.id);

    const updated = await this.repo.reload(cart.id);
    return mapCart(updated);
  }

  // ─── Update quantity ──────────────────────────────────────────────────────

  async updateItem(
    userId: string,
    cartItemId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartDto> {
    const cart = await this.repo.findOrCreate(userId);

    const item = await this.repo.findItemById(cartItemId, cart.id);
    if (!item) throw new CartItemNotFoundError();

    // quantity 0 = remove
    if (dto.quantity === 0) {
      await this.repo.removeItem(cartItemId);
      await this.repo.touch(cart.id);
      const updated = await this.repo.reload(cart.id);
      return mapCart(updated);
    }

    // Stock check
    const stock = await this.getEffectiveStock(item.productId, item.variantId);
    if (dto.quantity > stock) {
      throw new InsufficientStockError(stock);
    }

    await this.repo.updateItemQuantity(cartItemId, dto.quantity);
    await this.repo.touch(cart.id);

    const updated = await this.repo.reload(cart.id);
    return mapCart(updated);
  }

  // ─── Remove item ──────────────────────────────────────────────────────────

  async removeItem(userId: string, cartItemId: string): Promise<CartDto> {
    const cart = await this.repo.findOrCreate(userId);

    const item = await this.repo.findItemById(cartItemId, cart.id);
    if (!item) throw new CartItemNotFoundError();

    await this.repo.removeItem(cartItemId);
    await this.repo.touch(cart.id);

    const updated = await this.repo.reload(cart.id);
    return mapCart(updated);
  }

  // ─── Clear cart ───────────────────────────────────────────────────────────

  async clearCart(userId: string): Promise<CartDto> {
    const cart = await this.repo.findOrCreate(userId);
    await this.repo.clearCart(cart.id);
    await this.repo.touch(cart.id);

    const updated = await this.repo.reload(cart.id);
    return mapCart(updated);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async getEffectiveStock(
    productId: string,
    variantId: string | null,
  ): Promise<number> {
    if (variantId) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: variantId },
        select: { stock: true },
      });
      return variant?.stock ?? 0;
    }
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    });
    return product?.stock ?? 0;
  }
}
