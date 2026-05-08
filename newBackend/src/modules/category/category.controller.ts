// ============================================================
// controllers/category.controller.ts
// ============================================================

import type { Request, Response, NextFunction } from "express";
import type { CategoryService } from "./category.service";
import { CategoryNotFoundError, CategoryConflictError } from "./category.service";
import { CreateCategorySchema, UpdateCategorySchema } from "./category.schema";
import { z } from "zod";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // GET /categories/tree — สำหรับ Sidebar
  getCategoryTree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tree = await this.categoryService.getCategoryTree();
      return res.status(200).json({ success: true, data: tree });
    } catch (error) {
      next(error);
    }
  };

  // GET /categories
  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getCategories();
      return res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  // GET /categories/slug/:slug
  getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.getCategoryBySlug(req.params.slug);
      return res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  // POST /categories
  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = CreateCategorySchema.parse(req.body);
      const category = await this.categoryService.createCategory(data);
      return res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  // PUT /categories/:id
  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = UpdateCategorySchema.parse(req.body);
      const category = await this.categoryService.updateCategory(req.params.id, data);
      return res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /categories/:id
  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

// ─── Error Handler Middleware ─────────────────────────────────

export function categoryErrorHandler(
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

  if (error instanceof CategoryNotFoundError) {
    return res.status(404).json({
      success: false,
      error: error.message,
    });
  }

  if (error instanceof CategoryConflictError) {
    return res.status(409).json({
      success: false,
      error: error.message,
    });
  }

  next(error);
}
