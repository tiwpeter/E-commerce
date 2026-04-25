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
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

router.use(productErrorHandler);

export default router;
