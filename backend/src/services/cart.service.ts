import { cartRepository } from '../repositories/cart.repository';
import { productRepository } from '../repositories/product.repository';
import { NotFoundError, BadRequestError } from '../utils/errors';

export class CartService {
  async getCart(userId: string) {
    const cart = await cartRepository.upsertCart(userId);
    return this.enrichCart(cart);
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) throw new NotFoundError('Product not found');
    if (product.stock < quantity) {
      throw new BadRequestError(`Only ${product.stock} items in stock`);
    }

    const cart = await cartRepository.upsertCart(userId);

    // Check if adding would exceed stock
    const existingItem = await cartRepository.findItem(cart.id, productId);
    const newQty = (existingItem?.quantity ?? 0) + quantity;
    if (newQty > product.stock) {
      throw new BadRequestError(`Cannot add ${quantity} more. Stock limit: ${product.stock}`);
    }

    await cartRepository.addItem(cart.id, productId, quantity);
    return this.getCart(userId);
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.stock < quantity) {
      throw new BadRequestError(`Only ${product.stock} items in stock`);
    }

    const cart = await cartRepository.findByUserId(userId);
    if (!cart) throw new NotFoundError('Cart not found');

    const item = await cartRepository.findItem(cart.id, productId);
    if (!item) throw new NotFoundError('Item not in cart');

    await cartRepository.updateItem(cart.id, productId, quantity);
    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart) throw new NotFoundError('Cart not found');

    const item = await cartRepository.findItem(cart.id, productId);
    if (!item) throw new NotFoundError('Item not in cart');

    await cartRepository.removeItem(cart.id, productId);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await cartRepository.findByUserId(userId);
    if (cart) await cartRepository.clearCart(cart.id);
    return this.getCart(userId);
  }

  private enrichCart(cart: any) {
    const items = cart.items ?? [];
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const itemCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

    return { ...cart, subtotal, itemCount };
  }
}

export const cartService = new CartService();
