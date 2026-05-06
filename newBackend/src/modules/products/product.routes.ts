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

router.get("/", 
  /* #swagger.tags = ['Products'] */
  productController.getProducts
);

router.post("/", 
  /* #swagger.tags = ['Products'] */
  productController.createProduct
);


router.get("/slug/:slug",
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Get product by slug'
     #swagger.parameters['slug'] = {
       in: 'path',
       required: true,
       type: 'string'
     }
  */
  productController.getProductBySlug
);


router.put("/:id", 
  /* #swagger.tags = ['Products'] */
  /* #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
  productController.updateProduct
);

router.delete("/:id", 
  /* #swagger.tags = ['Products'] */
  /* #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
  productController.deleteProduct
);

router.use(productErrorHandler);

export default router;
