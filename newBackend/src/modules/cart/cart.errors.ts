export class CartError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'CartError';
  }
}

export class ProductNotFoundError extends CartError {
  constructor(productId: string) {
    super(`Product not found: ${productId}`, 'PRODUCT_NOT_FOUND', 404);
  }
}

export class ProductUnavailableError extends CartError {
  constructor() {
    super('Product is no longer available', 'PRODUCT_UNAVAILABLE', 400);
  }
}

export class VariantNotFoundError extends CartError {
  constructor(variantId: string) {
    super(`Variant not found: ${variantId}`, 'VARIANT_NOT_FOUND', 404);
  }
}

export class VariantUnavailableError extends CartError {
  constructor() {
    super('Product variant is no longer available', 'VARIANT_UNAVAILABLE', 400);
  }
}

export class InsufficientStockError extends CartError {
  constructor(available: number) {
    super(
      `Insufficient stock. Available: ${available}`,
      'INSUFFICIENT_STOCK',
      400,
    );
  }
}

export class CartItemNotFoundError extends CartError {
  constructor() {
    super('Cart item not found', 'CART_ITEM_NOT_FOUND', 404);
  }
}

export class VariantRequiredError extends CartError {
  constructor() {
    super('This product requires a variant selection', 'VARIANT_REQUIRED', 400);
  }
}
