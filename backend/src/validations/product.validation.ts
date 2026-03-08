import { body, query, param } from 'express-validator';

export const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be 2-255 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('comparePrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Compare price must be a positive number'),

  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('sku')
    .trim()
    .notEmpty().withMessage('SKU is required')
    .isLength({ max: 100 }),

  body('categoryId')
    .notEmpty().withMessage('Category is required'),

  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be boolean'),

  body('weight')
    .optional()
    .isFloat({ min: 0 }).withMessage('Weight must be positive'),
];

export const updateProductValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 255 }),
  body('description').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('comparePrice').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('categoryId').optional().notEmpty(),
  body('isFeatured').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('weight').optional().isFloat({ min: 0 }),
];

export const productQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('rating').optional().isFloat({ min: 1, max: 5 }),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'newest', 'popular']),
  query('categoryId').optional().notEmpty(),
  query('search').optional().trim(),
  query('featured').optional().isBoolean(),
];
