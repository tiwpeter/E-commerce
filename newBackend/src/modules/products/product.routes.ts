// modules/products/product.routes.ts
import { Router } from "express";
import { prisma } from "@/config/database";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";
import { ProductController, productErrorHandler } from "./product.controller";

// ============================================================
// Router (Express)
// ============================================================

const productRepository = new ProductRepository(prisma);
export const productService = new ProductService(productRepository);
const productController     = new ProductController(productService);

const router = Router();

router.get("/",           productController.getProducts);
router.post("/",          productController.createProduct);
router.get("/slug/:slug", productController.getProductBySlug);
router.put("/:id",        productController.updateProduct);
router.delete("/:id",     productController.deleteProduct);
router.use(productErrorHandler);

export default router;