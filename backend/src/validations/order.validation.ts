import { body, param } from 'express-validator';

export const addToCartValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required'),

  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1, max: 999 }).withMessage('Quantity must be between 1-999'),
];

export const updateCartValidation = [
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1, max: 999 }).withMessage('Quantity must be between 1-999'),
];

export const createOrderValidation = [
  body('addressId')
    .notEmpty().withMessage('Shipping address is required'),

  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'MOCK_GATEWAY'])
    .withMessage('Invalid payment method'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }),
];

export const updateOrderStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED'])
    .withMessage('Invalid status'),

  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ max: 100 }),
];

export const createAddressValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('addressLine1').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('country').optional().trim().isLength({ min: 2, max: 2 }),
  body('isDefault').optional().isBoolean(),
];

export const createReviewValidation = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 150 }),

  body('comment')
    .optional()
    .trim()
    .isLength({ max: 2000 }),
];

export const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 100 }),

  body('description').optional().trim(),
  body('parentId').optional(),
  body('isActive').optional().isBoolean(),
];
