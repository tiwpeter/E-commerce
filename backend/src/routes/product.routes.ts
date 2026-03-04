import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate, adminOnly } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';
import {
  createProductValidation,
  updateProductValidation,
  productQueryValidation,
} from '../validations/product.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

// ─── Public ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products with filtering, sorting & pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, newest, popular]
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Paginated product list
 */
router.get('/', validate(productQueryValidation), productController.getAll);
router.get('/featured', productController.getFeatured);
router.get('/best-sellers', productController.getBestSellers);
router.get('/slug/:slug', productController.getBySlug);
router.get('/:id', productController.getById);

// ─── Admin ────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a product (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/',
  authenticate,
  adminOnly,
  validate(createProductValidation),
  productController.create
);

router.put(
  '/:id',
  authenticate,
  adminOnly,
  validate(updateProductValidation),
  productController.update
);

router.delete('/:id', authenticate, adminOnly, productController.delete);

router.post(
  '/:id/images',
  authenticate,
  adminOnly,
  uploadSingle,
  productController.uploadImage
);

router.delete('/:id/images/:imageId', authenticate, adminOnly, productController.deleteImage);

export default router;
