import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CartSchema,
  CartItemSchema,
  CartSummarySchema,
  AddToCartSchema,
  UpdateCartItemSchema,
  CartParamsSchema,
  CartItemParamsSchema,
} from "./cart.schema"; // adjust to your actual schema path

// ============================================================
// Registry
// ============================================================

export const cartRegistry = new OpenAPIRegistry();

// Register all named schemas so they appear in #/components/schemas
cartRegistry.register("Cart", CartSchema);
cartRegistry.register("CartItem", CartItemSchema);
cartRegistry.register("CartSummary", CartSummarySchema);
cartRegistry.register("AddToCartInput", AddToCartSchema);
cartRegistry.register("UpdateCartItemInput", UpdateCartItemSchema);

// ============================================================
// GET /carts/{userId}
// ============================================================

cartRegistry.registerPath({
  method: "get",
  path: "/carts/{userId}",
  summary: "Get a user's cart",
  description: "Returns the full cart for the given user, including all items with product snapshots.",
  tags: ["Cart"],
  request: {
    params: CartParamsSchema,
  },
  responses: {
    200: {
      description: "Cart retrieved successfully",
      content: {
        "application/json": {
          schema: CartSchema,
        },
      },
    },
    404: {
      description: "Cart not found for the given userId",
    },
  },
});

// ============================================================
// DELETE /carts/{userId}
// ============================================================

cartRegistry.registerPath({
  method: "delete",
  path: "/carts/{userId}",
  summary: "Clear a user's cart",
  description: "Removes all items from the user's cart.",
  tags: ["Cart"],
  request: {
    params: CartParamsSchema,
  },
  responses: {
    204: {
      description: "Cart cleared successfully",
    },
    404: {
      description: "Cart not found",
    },
  },
});

// ============================================================
// GET /carts/{userId}/summary
// ============================================================

cartRegistry.registerPath({
  method: "get",
  path: "/carts/{userId}/summary",
  summary: "Get cart summary",
  description: "Returns the item count and total price for the user's cart.",
  tags: ["Cart"],
  request: {
    params: CartParamsSchema,
  },
  responses: {
    200: {
      description: "Cart summary retrieved successfully",
      content: {
        "application/json": {
          schema: CartSummarySchema,
        },
      },
    },
    404: {
      description: "Cart not found",
    },
  },
});

// ============================================================
// POST /carts/{userId}/items
// ============================================================

cartRegistry.registerPath({
  method: "post",
  path: "/carts/{userId}/items",
  summary: "Add item to cart",
  description:
    "Adds a product (with optional variant) to the user's cart. If the item already exists, its quantity is incremented.",
  tags: ["Cart"],
  request: {
    params: CartParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: AddToCartSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Item added to cart successfully",
      content: {
        "application/json": {
          schema: CartItemSchema,
        },
      },
    },
    400: {
      description: "Invalid request body",
    },
    404: {
      description: "Product not found",
    },
  },
});

// ============================================================
// PATCH /carts/{userId}/items/{productId}
// ============================================================

cartRegistry.registerPath({
  method: "patch",
  path: "/carts/{userId}/items/{productId}",
  summary: "Update item quantity",
  description:
    "Updates the quantity of a specific item in the cart. Set quantity to 0 to remove the item.",
  tags: ["Cart"],
  request: {
    params: CartItemParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: UpdateCartItemSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Item updated successfully",
      content: {
        "application/json": {
          schema: CartItemSchema,
        },
      },
    },
    204: {
      description: "Item removed (quantity was set to 0)",
    },
    400: {
      description: "Invalid request body",
    },
    404: {
      description: "Cart or item not found",
    },
  },
});

// ============================================================
// DELETE /carts/{userId}/items/{productId}
// ============================================================

cartRegistry.registerPath({
  method: "delete",
  path: "/carts/{userId}/items/{productId}",
  summary: "Remove item from cart",
  description: "Removes a specific product from the user's cart.",
  tags: ["Cart"],
  request: {
    params: CartItemParamsSchema,
  },
  responses: {
    204: {
      description: "Item removed successfully",
    },
    404: {
      description: "Cart or item not found",
    },
  },
});

// ============================================================
// Generator — produce the OpenAPI document
// ============================================================

export function generateCartOpenApiSpec() {
  const generator = new OpenApiGeneratorV3(cartRegistry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Cart Service API",
      version: "1.0.0",
      description: "Manages shopping carts, cart items, and cart summaries.",
    },
    servers: [
      {
        url: "https://api.example.com/v1",
        description: "Production",
      },
      {
        url: "http://localhost:3000/v1",
        description: "Local development",
      },
    ],
  });
}