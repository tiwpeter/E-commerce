import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import {
  cartController,
  categoryController,
  reviewController,
  addressController,
} from '../controllers/misc.controller';
import { authenticate, adminOnly } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createOrderValidation,
  updateOrderStatusValidation,
  addToCartValidation,
  updateCartValidation,
  createAddressValidation,
  createReviewValidation,
  categoryValidation,
} from '../validations/order.validation';

// ─── Order Routes ─────────────────────────────────────────────────────────────

export const orderRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

// User
orderRouter.post('/', authenticate, validate(createOrderValidation), orderController.createOrder);
orderRouter.get('/my', authenticate, orderController.getMyOrders);
orderRouter.get('/my/:id', authenticate, orderController.getMyOrderById);

// Admin
orderRouter.get('/', authenticate, adminOnly, orderController.getAllOrders);
orderRouter.get('/stats', authenticate, adminOnly, orderController.getDashboardStats);
orderRouter.get('/:id', authenticate, adminOnly, orderController.getOrderById);
orderRouter.patch(
  '/:id/status',
  authenticate,
  adminOnly,
  validate(updateOrderStatusValidation),
  orderController.updateOrderStatus
);

// ─── Cart Routes ──────────────────────────────────────────────────────────────

export const cartRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

cartRouter.get('/', authenticate, cartController.getCart);
cartRouter.post('/items', authenticate, validate(addToCartValidation), cartController.addItem);
cartRouter.put('/items/:productId', authenticate, validate(updateCartValidation), cartController.updateItem);
cartRouter.delete('/items/:productId', authenticate, cartController.removeItem);
cartRouter.delete('/', authenticate, cartController.clearCart);

// ─── Category Routes ──────────────────────────────────────────────────────────

export const categoryRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Product categories
 */

categoryRouter.get('/', categoryController.getAll);
categoryRouter.get('/:id', categoryController.getById);
categoryRouter.post('/', authenticate, adminOnly, validate(categoryValidation), categoryController.create);
categoryRouter.put('/:id', authenticate, adminOnly, categoryController.update);
categoryRouter.delete('/:id', authenticate, adminOnly, categoryController.delete);

// ─── Review Routes ────────────────────────────────────────────────────────────

export const reviewRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product reviews
 */

reviewRouter.get('/products/:productId', reviewController.getProductReviews);
reviewRouter.post('/products/:productId', authenticate, validate(createReviewValidation), reviewController.create);
reviewRouter.delete('/:id', authenticate, reviewController.delete);
reviewRouter.get('/', authenticate, adminOnly, reviewController.getAllReviews);

// ─── Address Routes ───────────────────────────────────────────────────────────

export const addressRouter = Router();

addressRouter.get('/', authenticate, addressController.getAll);
addressRouter.post('/', authenticate, validate(createAddressValidation), addressController.create);
addressRouter.put('/:id', authenticate, addressController.update);
addressRouter.delete('/:id', authenticate, addressController.delete);
