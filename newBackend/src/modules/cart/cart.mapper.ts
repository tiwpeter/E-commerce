import { Decimal } from '@prisma/client/runtime/library';
import {
  CartDto,
  CartItemDto,
  CartItemProductDto,
  CartItemVariantDto,
  CartSummaryDto,
} from './cart.dto';
import { CartItemWithRelations, CartWithItems } from './cart.repository';

function toNumber(value: Decimal | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return typeof value === 'number' ? value : Number(value.toString());
}

function mapVariant(
  variant: CartItemWithRelations['variant'],
): CartItemVariantDto | null {
  if (!variant) return null;
  return {
    id: variant.id,
    sku: variant.sku,
    price: Number(variant.price.toString()),
    comparePrice: toNumber(variant.comparePrice),
    stock: variant.stock,
    image: variant.image,
    options: variant.variantOption.map((vo) => ({
      name: vo.optionValue.option.name,
      value: vo.optionValue.value,
    })),
  };
}

function mapProduct(
  product: CartItemWithRelations['product'],
): CartItemProductDto {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    basePrice: Number(product.basePrice.toString()),
    comparePrice: toNumber(product.comparePrice),
    primaryImage: product.images[0]?.url ?? null,
    stock: product.stock,
    hasVariants: product.hasVariants,
  };
}

export function mapCartItem(item: CartItemWithRelations): CartItemDto {
  const variant = mapVariant(item.variant);
  const product = mapProduct(item.product);

  const unitPrice = variant ? variant.price : product.basePrice;
  const comparePrice = variant ? variant.comparePrice : product.comparePrice;
  const stock = variant ? variant.stock : product.stock;

  const isActive = !item.product.deletedAt && item.product.isActive;
  const variantActive = item.variant ? item.variant.isActive : true;
  const inStock = stock > 0;

  return {
    id: item.id,
    quantity: item.quantity,
    unitPrice,
    comparePrice,
    subtotal: parseFloat((unitPrice * item.quantity).toFixed(2)),
    product,
    variant,
    isAvailable: isActive && variantActive && inStock,
    maxQuantity: Math.min(stock, 100),
  };
}

export function mapCart(cart: CartWithItems): CartDto {
  const items = cart.items.map(mapCartItem);

  // Summary
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const lineCount = items.length;
  const subtotal = parseFloat(
    items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2),
  );

  const hasCompare = items.some((i) => i.comparePrice !== null);
  const compareSubtotal = hasCompare
    ? parseFloat(
        items
          .reduce((sum, i) => {
            const cp = i.comparePrice ?? i.unitPrice;
            return sum + cp * i.quantity;
          }, 0)
          .toFixed(2),
      )
    : null;

  const savings =
    compareSubtotal !== null
      ? parseFloat((compareSubtotal - subtotal).toFixed(2))
      : null;

  const summary: CartSummaryDto = {
    itemCount,
    lineCount,
    subtotal,
    compareSubtotal,
    savings: savings && savings > 0 ? savings : null,
  };

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    summary,
    updatedAt: cart.updatedAt,
  };
}
