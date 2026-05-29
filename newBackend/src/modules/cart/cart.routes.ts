import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import {
  CartService,
  CartNotFoundError,
  CartItemNotFoundError,
  ProductUnavailableError,
  type IProductService,
} from "./cart.service";
import {
  AddToCartSchema,
  UpdateCartItemSchema,
  CartParamsSchema,
  CartItemParamsSchema,
} from "./cart.schema";

// ============================================================
// Zod validation middleware helper
// ============================================================

function validate<T extends z.ZodTypeAny>(
  schema: T,
  source: "body" | "params" | "query" = "body"
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: result.error.flatten(),
      });
      return;
    }
    req[source] = result.data;
    next();
  };
}

// ============================================================
// Router factory
// ============================================================

export function createCartRouter(productService: IProductService): Router {
  const router = Router();
  const service = new CartService(productService);

  // GET /carts/:userId — Get user's cart
  router.get(
    "/:userId",
    validate(CartParamsSchema, "params"),
    async (req, res, next) => {
      try {
        const cart = await service.getCart(req.params.userId);
        res.json({ success: true, data: cart });
      } catch (err) {
        next(err);
      }
    }
  );

  // GET /carts/:userId/summary — Get cart summary
  router.get(
    "/:userId/summary",
    validate(CartParamsSchema, "params"),
    async (req, res, next) => {
      try {
        const summary = await service.getCartSummary(req.params.userId);
        res.json({ success: true, data: summary });
      } catch (err) {
        next(err);
      }
    }
  );

  // POST /carts/:userId/items — Add item to cart
  router.post(
    "/:userId/items",
    validate(CartParamsSchema, "params"),
    validate(AddToCartSchema),
    async (req, res, next) => {
      try {
        const cart = await service.addItem(req.params.userId, req.body);
        res.json({ success: true, data: cart });
      } catch (err) {
        next(err);
      }
    }
  );

  // PATCH /carts/:userId/items/:productId — Update item quantity
  router.patch(
    "/:userId/items/:productId",
    validate(CartItemParamsSchema, "params"),
    validate(UpdateCartItemSchema),
    async (req, res, next) => {
      try {
        const cart = await service.updateItem(
          req.params.userId,
          req.params.productId,
          req.body
        );
        res.json({ success: true, data: cart });
      } catch (err) {
        next(err);
      }
    }
  );

  // DELETE /carts/:userId/items/:productId — Remove single item
  router.delete(
    "/:userId/items/:productId",
    validate(CartItemParamsSchema, "params"),
    async (req, res, next) => {
      try {
        const cart = await service.removeItem(req.params.userId, req.params.productId);
        res.json({ success: true, data: cart });
      } catch (err) {
        next(err);
      }
    }
  );

  // DELETE /carts/:userId — Clear entire cart
  router.delete(
    "/:userId",
    validate(CartParamsSchema, "params"),
    async (req, res, next) => {
      try {
        const cart = await service.clearCart(req.params.userId);
        res.json({ success: true, data: cart });
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}

// ============================================================
// Error handler — mount after all cart routes
// ============================================================

export function cartErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof CartNotFoundError || err instanceof CartItemNotFoundError) {
    res.status(404).json({ success: false, error: err.message });
    return;
  }
  if (err instanceof ProductUnavailableError) {
    res.status(404).json({ success: false, error: err.message });
    return;
  }
  res.status(500).json({ success: false, error: "Internal server error" });
}