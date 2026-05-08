// ============================================================
// routes/category.routes.ts
// ============================================================

import { Router } from "express";
import { CategoryRepository } from "./category.repository";
import { CategoryService } from "./category.service";
import { CategoryController, categoryErrorHandler } from "./category.controller";
import { prisma } from "@/config/database";

const categoryRepository = new CategoryRepository(prisma);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

// GET  /categories/tree       — nested tree สำหรับ Sidebar
// GET  /categories            — list ทั้งหมด (flat)
// GET  /categories/slug/:slug — get by slug
// POST /categories            — create
// PUT  /categories/:id        — update
// DELETE /categories/:id      — soft delete

router.get("/tree",
  /* #swagger.tags = ['Categories']
     #swagger.summary = 'Get category tree for sidebar'
  */
  categoryController.getCategoryTree
);

router.get("/",
  /* #swagger.tags = ['Categories']
     #swagger.summary = 'Get all categories'
  */
  categoryController.getCategories
);

router.get("/slug/:slug",
  /* #swagger.tags = ['Categories']
     #swagger.summary = 'Get category by slug'
     #swagger.parameters['slug'] = {
       in: 'path',
       required: true,
       type: 'string'
     }
  */
  categoryController.getCategoryBySlug
);

router.post("/",
  /* #swagger.tags = ['Categories']
     #swagger.summary = 'Create category'
  */
  categoryController.createCategory
);

router.put("/:id",
  /* #swagger.tags = ['Categories']
     #swagger.summary = 'Update category'
     #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
  */
  categoryController.updateCategory
);

router.delete("/:id",
  /* #swagger.tags = ['Categories']
     #swagger.summary = 'Delete category'
     #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
  */
  categoryController.deleteCategory
);

router.use(categoryErrorHandler);

export default router;
