import { Router, type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { CartRepository } from "./cart.repository";
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
  CartItemParamsSchema,
} from "./cart.schema";
import { authenticate } from "../auth/auth.middleware";

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
// Guard: ป้องกัน user แก้ cart คนอื่น
// Admin ข้ามได้ — User ต้องเป็น cart ของตัวเอง
// ============================================================

function guardOwner(req: Request, res: Response, next: NextFunction): void {
  const tokenUserId = req.user!.sub;
  const paramUserId = req.params.userId;

  if (req.user!.role === "ADMIN" || tokenUserId === paramUserId) {
    next();
    return;
  }

  res.status(403).json({ success: false, error: "Forbidden: not your cart" });
}

// ============================================================
// Router factory
// ============================================================

export function createCartRouter(
  db: PrismaClient,
  productService: IProductService,
): Router {
  const router = Router();
  const cartRepo = new CartRepository(db);
  const service = new CartService(cartRepo, productService);

  // ทุก route ต้อง login ก่อน
  router.use(authenticate);

  // GET /carts/:userId
  router.get(
    "/:userId",
    guardOwner,
    async (req, res, next) => {
      try {
        const cart = await service.getCart(req.params.userId);
        res.json({ success: true, data: cart });
      } catch (err) {
        next(err);
      }
    }
  );

  // GET /carts/:userId/summary
  router.get(
    "/:userId/summary",
    guardOwner,
    async (req, res, next) => {
      try {
        const summary = await service.getCartSummary(req.params.userId);
        res.json({ success: true, data: summary });
      } catch (err) {
        next(err);
      }
    }
  );

  // POST /carts/:userId/items
  router.post(
    "/:userId/items",
    guardOwner,
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

  // PATCH /carts/:userId/items/:productId
  router.patch(
    "/:userId/items/:productId",
    guardOwner,
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

  // DELETE /carts/:userId/items/:productId
  router.delete(
    "/:userId/items/:productId",
    guardOwner,
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

  // DELETE /carts/:userId
  router.delete(
    "/:userId",
    guardOwner,
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