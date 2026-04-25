// ============================================================
// controllers/product.controller.ts
// ============================================================

import type { Request, Response, NextFunction } from "express";
import type { ProductService } from "./product.service";
import { ProductNotFoundError, ProductConflictError } from "./product.service";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "./products.schema";
import { z } from "zod";

const QuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  categoryId: z.string().cuid().optional(),
  isActive: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  isFeatured: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  search: z.string().min(1).optional(),
});

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = QuerySchema.parse(req.query);
      const { page, limit, ...filters } = query;

      const result = await this.productService.getProducts(filters, {
        page,
        limit,
      });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  getProductBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const product = await this.productService.getProductBySlug(
        req.params.slug
      );
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = CreateProductSchema.parse(req.body);
      const product = await this.productService.createProduct(data);
      return res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = UpdateProductSchema.parse(req.body);
      const product = await this.productService.updateProduct(
        req.params.id,
        data
      );
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.deleteProduct(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

// ─── Error Handler Middleware ─────────────────────────────────

export function productErrorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      issues: error.flatten().fieldErrors,
    });
  }

  if (error instanceof ProductNotFoundError) {
    return res.status(404).json({
      success: false,
      error: error.message,
    });
  }

  if (error instanceof ProductConflictError) {
    return res.status(409).json({
      success: false,
      error: error.message,
    });
  }

  next(error);
}
