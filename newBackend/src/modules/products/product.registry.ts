import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { ProductSchema, CreateProductSchema, UpdateProductSchema } from "./products.schema";

export const productRegistry = new OpenAPIRegistry();

// ── Response wrappers ─────────────────────────────────────────
const ProductList = z.object({
  items: z.array(ProductSchema),
  total: z.number().int(),
  page:  z.number().int(),
  limit: z.number().int(),
});
const ErrorResponse = z.object({ success: z.literal(false), error: z.string() });

// ── GET /products ─────────────────────────────────────────────
productRegistry.registerPath({
  method: "get", path: "/products",
  tags: ["Products"], summary: "List products with filters & pagination",
  request: {
    query: z.object({
      categorySlug: z.string().optional(),
      search:       z.string().optional(),
      isActive:     z.coerce.boolean().optional(),
      isFeatured:   z.coerce.boolean().optional(),
      page:         z.coerce.number().int().min(1).default(1).optional(),
      limit:        z.coerce.number().int().min(1).max(100).default(20).optional(),
    }),
  },
  responses: {
    200: { description: "OK",           content: { "application/json": { schema: ProductList } } },
    500: { description: "Server error", content: { "application/json": { schema: ErrorResponse } } },
  },
});

// ── POST /products ────────────────────────────────────────────
productRegistry.registerPath({
  method: "post", path: "/products",
  tags: ["Products"], summary: "Create a product",
  request: {
    body: { content: { "application/json": { schema: CreateProductSchema } }, required: true },
  },
  responses: {
    201: { description: "Created",      content: { "application/json": { schema: ProductSchema } } },
    400: { description: "Validation",   content: { "application/json": { schema: ErrorResponse } } },
    500: { description: "Server error", content: { "application/json": { schema: ErrorResponse } } },
  },
});

// ── GET /products/slug/:slug ──────────────────────────────────
productRegistry.registerPath({
  method: "get", path: "/products/slug/{slug}",
  tags: ["Products"], summary: "Get product by slug",
  request: { params: z.object({ slug: z.string() }) },
  responses: {
    200: { description: "OK",        content: { "application/json": { schema: ProductSchema } } },
    404: { description: "Not found", content: { "application/json": { schema: ErrorResponse } } },
  },
});

// ── GET /products/:id ─────────────────────────────────────────
productRegistry.registerPath({
  method: "get", path: "/products/{id}",
  tags: ["Products"], summary: "Get product by id",
  request: { params: z.object({ id: z.string().cuid() }) },
  responses: {
    200: { description: "OK",        content: { "application/json": { schema: ProductSchema } } },
    404: { description: "Not found", content: { "application/json": { schema: ErrorResponse } } },
  },
});

// ── PUT /products/:id ─────────────────────────────────────────
productRegistry.registerPath({
  method: "put", path: "/products/{id}",
  tags: ["Products"], summary: "Full update",
  request: {
    params: z.object({ id: z.string().cuid() }),
    body: { content: { "application/json": { schema: UpdateProductSchema } }, required: true },
  },
  responses: {
    200: { description: "Updated",    content: { "application/json": { schema: ProductSchema } } },
    400: { description: "Validation", content: { "application/json": { schema: ErrorResponse } } },
    404: { description: "Not found",  content: { "application/json": { schema: ErrorResponse } } },
  },
});

// ── DELETE /products/:id ──────────────────────────────────────
productRegistry.registerPath({
  method: "delete", path: "/products/{id}",
  tags: ["Products"], summary: "Soft delete",
  request: { params: z.object({ id: z.string().cuid() }) },
  responses: {
    200: { description: "Deleted",   content: { "application/json": { schema: ProductSchema } } },
    404: { description: "Not found", content: { "application/json": { schema: ErrorResponse } } },
  },
});