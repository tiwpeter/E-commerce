import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CartService,
  CartNotFoundError,
  CartItemNotFoundError,
  ProductUnavailableError,
  type IProductService,
} from "./cart.service";
import {
  CartSchema,
  CartSummarySchema,
  AddToCartSchema,
  UpdateCartItemSchema,
  CartParamsSchema,
  CartItemParamsSchema,
} from "./cart.schema";

// ============================================================
// Registry (exported so app.ts can collect all registries)
// ============================================================

export const cartRegistry = new OpenAPIRegistry();

// ── Register schemas (makes them available as $ref) ──────────

cartRegistry.register("Cart", CartSchema);
cartRegistry.register("CartSummary", CartSummarySchema);
cartRegistry.register("AddToCartInput", AddToCartSchema);
cartRegistry.register("UpdateCartItemInput", UpdateCartItemSchema);

// ── Shared response schemas ───────────────────────────────────

const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const ValidationErrorSchema = z.object({
  success: z.literal(false),
  error: z.literal("Validation failed"),
  details: z.object({
    formErrors: z.array(z.string()),
    fieldErrors: z.record(z.array(z.string())),
  }),
});

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

  // ----------------------------------------------------------
  // GET /carts/:userId — Get user's cart
  // ----------------------------------------------------------

  cartRegistry.registerPath({
    method: "get",
    path: "/carts/{userId}",
    tags: ["Cart"],
    summary: "Get cart for a user",
    description:
      "Returns the cart with all items for the given user. Auto-creates an empty cart if none exists.",
    operationId: "getCart",
    request: {
      params: CartParamsSchema,
    },
    responses: {
      200: {
        description: "Cart with items",
        content: {
          "application/json": {
            schema: z.object({ success: z.literal(true), data: CartSchema }),
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  });

  router.get("/:userId", validate(CartParamsSchema, "params"), async (req, res, next) => {
    try {
      const cart = await service.getCart(req.params.userId);
      res.json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  });

  // ----------------------------------------------------------
  // GET /carts/:userId/summary — Get cart summary
  // ----------------------------------------------------------

  cartRegistry.registerPath({
    method: "get",
    path: "/carts/{userId}/summary",
    tags: ["Cart"],
    summary: "Get cart summary",
    description: "Returns the total item count and total price for the user's cart.",
    operationId: "getCartSummary",
    request: {
      params: CartParamsSchema,
    },
    responses: {
      200: {
        description: "Cart summary",
        content: {
          "application/json": {
            schema: z.object({ success: z.literal(true), data: CartSummarySchema }),
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  });

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

  // ----------------------------------------------------------
  // POST /carts/:userId/items — Add item to cart
  // ----------------------------------------------------------

  cartRegistry.registerPath({
    method: "post",
    path: "/carts/{userId}/items",
    tags: ["Cart"],
    summary: "Add item to cart",
    description:
      "Adds a product (and optional variant) to the user's cart. If the item already exists, its quantity is incremented.",
    operationId: "addCartItem",
    request: {
      params: CartParamsSchema,
      body: {
        required: true,
        content: { "application/json": { schema: AddToCartSchema } },
      },
    },
    responses: {
      200: {
        description: "Updated cart",
        content: {
          "application/json": {
            schema: z.object({ success: z.literal(true), data: CartSchema }),
          },
        },
      },
      400: {
        description: "Validation error",
        content: { "application/json": { schema: ValidationErrorSchema } },
      },
      404: {
        description: "Product not found or unavailable",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Unexpected server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  });

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

  // ----------------------------------------------------------
  // PATCH /carts/:userId/items/:productId — Update item quantity
  // ----------------------------------------------------------

  cartRegistry.registerPath({
    method: "patch",
    path: "/carts/{userId}/items/{productId}",
    tags: ["Cart"],
    summary: "Update cart item quantity",
    description:
      "Updates the quantity of a specific product in the cart. Setting `quantity` to `0` removes the item.",
    operationId: "updateCartItem",
    request: {
      params: CartItemParamsSchema,
      body: {
        required: true,
        content: { "application/json": { schema: UpdateCartItemSchema } },
      },
    },
    responses: {
      200: {
        description: "Updated cart",
        content: {
          "application/json": {
            schema: z.object({ success: z.literal(true), data: CartSchema }),
          },
        },
      },
      400: {
        description: "Validation error",
        content: { "application/json": { schema: ValidationErrorSchema } },
      },
      404: {
        description: "Cart or item not found",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Unexpected server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  });

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

  // ----------------------------------------------------------
  // DELETE /carts/:userId/items/:productId — Remove single item
  // ----------------------------------------------------------

  cartRegistry.registerPath({
    method: "delete",
    path: "/carts/{userId}/items/{productId}",
    tags: ["Cart"],
    summary: "Remove item from cart",
    description: "Removes a single product from the cart entirely, regardless of quantity.",
    operationId: "removeCartItem",
    request: {
      params: CartItemParamsSchema,
    },
    responses: {
      200: {
        description: "Updated cart after removal",
        content: {
          "application/json": {
            schema: z.object({ success: z.literal(true), data: CartSchema }),
          },
        },
      },
      404: {
        description: "Cart or item not found",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Unexpected server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  });

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

  // ----------------------------------------------------------
  // DELETE /carts/:userId — Clear entire cart
  // ----------------------------------------------------------

  cartRegistry.registerPath({
    method: "delete",
    path: "/carts/{userId}",
    tags: ["Cart"],
    summary: "Clear all items in cart",
    description: "Removes every item from the cart. The cart record itself is kept.",
    operationId: "clearCart",
    request: {
      params: CartParamsSchema,
    },
    responses: {
      200: {
        description: "Empty cart",
        content: {
          "application/json": {
            schema: z.object({ success: z.literal(true), data: CartSchema }),
          },
        },
      },
      404: {
        description: "Cart not found",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Unexpected server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  });

  router.delete("/:userId", validate(CartParamsSchema, "params"), async (req, res, next) => {
    try {
      const cart = await service.clearCart(req.params.userId);
      res.json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  });

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