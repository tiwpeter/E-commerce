// ============================================================
// routes/product.routes.ts
// ============================================================

import { Router } from "express";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";
import { ProductController, productErrorHandler } from "./product.controller";
import {prisma} from "@/config/database";  // ← import จากที่เดียว


const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const router = Router();

// GET  /products              — list with filters & pagination
// GET  /products/:id          — get by id
// GET  /products/slug/:slug   — get by slug
// POST /products              — create
// PUT  /products/:id          — full update
// DELETE /products/:id        — soft delete

router.get("/", productController.getProducts);
router.post("/", productController.createProduct);

router.get("/slug/:slug", 
  /* #swagger.parameters['slug'] = { in: 'path', required: true, type: 'string' } */
  productController.getProductBySlug
);

router.get("/:id", 
  /* #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
  productController.getProductById
);

router.put("/:id", 
  /* #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
  productController.updateProduct
);

router.delete("/:id", 
  /* #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
  productController.deleteProduct
);

router.use(productErrorHandler);

export default router;
