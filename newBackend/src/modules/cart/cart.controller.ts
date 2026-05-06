import { NextFunction, Request, Response } from 'express';
import { AddToCartSchema, UpdateCartItemSchema } from './cart.dto';
import { CartError } from './cart.errors';
import { CartService } from './cart.service';

/**
 * All handlers assume req.user is attached by an auth middleware:
 *   req.user = { id: string; ... }
 */
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // GET /cart
  getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const cart = await this.cartService.getCart(userId);
      res.json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  };

  // POST /cart/items
  addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const dto = AddToCartSchema.parse(req.body);
      const cart = await this.cartService.addItem(userId, dto);
      res.status(201).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  };

  // PATCH /cart/items/:cartItemId
  updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { cartItemId } = req.params;
      const dto = UpdateCartItemSchema.parse(req.body);
      const cart = await this.cartService.updateItem(userId, cartItemId, dto);
      res.json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  };

  // DELETE /cart/items/:cartItemId
  removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { cartItemId } = req.params;
      const cart = await this.cartService.removeItem(userId, cartItemId);
      res.json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  };

  // DELETE /cart
  clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const cart = await this.cartService.clearCart(userId);
      res.json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  };
}

// ─── Error handler middleware (mount in app.ts) ───────────────────────────────

export function cartErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof CartError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
    return;
  }
  next(err);
}
