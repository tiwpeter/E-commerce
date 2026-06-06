// src/features/products/hooks/useProductDetail.tsx
import { useState, useMemo, useCallback } from 'react';
import { useGetProductsSlugSlug } from '@/api/generated/products/products';
import type { ProductVariant } from '@/api/generated/model';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';

// ─── Types ────────────────────────────────────────────────────────────

type SelectedOptions = Record<string, string>;

// ─── Hook ─────────────────────────────────────────────────────────────

export function useProductDetail(slug: string) {
  // ── Data fetching ─────────────────────────────────────────────────
  const { data: product, isLoading, isError } = useGetProductsSlugSlug(slug);

  // Before: calling usePostCartsUserIdItems() directly bypassed CartContext
  // which prevented invalidation and left cart summary stale.
  // Now: use addItem from CartContext which handles invalidation automatically.
  const { addItem, isLoading: isAddingToCart } = useCart();

  // ── UI state ──────────────────────────────────────────────────────
  const [selectedImage, setSelectedImage]     = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [quantity, setQuantity]               = useState(1);

  const { user }        = useAuth();
  const { requireAuth } = useRequireAuth();

  // ── Derived: sorted images ─────────────────────────────────────────
  const sortedImages = useMemo(() => {
    if (!product?.images?.length) return [];
    return [...product.images].sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [product?.images]);

  // ── Derived: matched variant ───────────────────────────────────────
  const selectedVariant = useMemo<ProductVariant | null>(() => {
    if (!product?.hasVariants || !product.variants?.length) return null;

    const selectedEntries = Object.entries(selectedOptions);
    if (!selectedEntries.length) return null;

    return (
      product.variants.find((variant) =>
        selectedEntries.every(([optionName, optionValue]) => {
          const option = product.options.find((o) => o.name === optionName);
          if (!option) return false;
          return variant.variantOption.some(
            (vo) =>
              vo.optionValue.optionId === option.id &&
              vo.optionValue.value === optionValue,
          );
        }),
      ) ?? null
    );
  }, [selectedOptions, product?.variants, product?.options, product?.hasVariants]);

  // ── Derived: price ─────────────────────────────────────────────────
  const displayPrice = useMemo(() => {
    if (product?.hasVariants && selectedVariant) return String(selectedVariant.price);
    return String(product?.basePrice ?? '0');
  }, [product?.hasVariants, product?.basePrice, selectedVariant]);

  const displayComparePrice = useMemo(() => {
    if (product?.hasVariants && selectedVariant) {
      return selectedVariant.comparePrice != null
        ? String(selectedVariant.comparePrice)
        : null;
    }
    return product?.comparePrice != null ? String(product.comparePrice) : null;
  }, [product?.hasVariants, product?.comparePrice, selectedVariant]);

  const discountPercent = useMemo(() => {
    if (!displayComparePrice) return null;
    const price   = parseFloat(displayPrice);
    const compare = parseFloat(displayComparePrice);
    if (!compare || compare <= price) return null;

    // Before: (price - compare) / compare would always return a negative value because price < compare.
    // Now: (compare - price) / compare gives the correct discount percentage (always positive).
    return Math.round(((compare - price) / compare) * 100);
  }, [displayPrice, displayComparePrice]);

  // ── Derived: stock ─────────────────────────────────────────────────
  const displayStock = useMemo(() => {
    if (product?.hasVariants && selectedVariant) return selectedVariant.stock ?? 0;
    return product?.stock ?? 0;
  }, [product?.hasVariants, product?.stock, selectedVariant]);

  const isInStock = useMemo(() => {
    if (product?.hasVariants) {
      if (!selectedVariant) return false;
      return (selectedVariant.isActive ?? true) && (selectedVariant.stock ?? 0) > 0;
    }
    return (product?.isActive ?? true) && displayStock > 0;
  }, [product?.hasVariants, product?.isActive, selectedVariant, displayStock]);

  // ── Derived: all options selected ──────────────────────────────────
  const allOptionsSelected = useMemo(() => {
    if (!product?.hasVariants || !product.options?.length) return true;
    return product.options.every((opt) => !!selectedOptions[opt.name]);
  }, [product?.hasVariants, product?.options, selectedOptions]);

  // ── Handlers ───────────────────────────────────────────────────────
  const handleOptionSelect = useCallback((optionName: string, value: string) => {
    setSelectedOptions((prev) => {
      if (prev[optionName] === value) {
        const next = { ...prev };
        delete next[optionName];
        return next;
      }
      return { ...prev, [optionName]: value };
    });
    setQuantity(1);
  }, []);

  const handleSelectVariantFromTable = useCallback(
    (variantId: string) => {
      if (!product?.variants || !product.options) return;
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) return;

      const newOptions: SelectedOptions = {};
      for (const vo of variant.variantOption) {
        const option = product.options.find((o) => o.id === vo.optionValue.optionId);
        if (option) newOptions[option.name] = vo.optionValue.value;
      }
      setSelectedOptions(newOptions);
      setQuantity(1);
    },
    [product?.variants, product?.options],
  );

  const onAddToCart = useCallback(() => {
    if (!isInStock || !allOptionsSelected || !product) return;

    requireAuth(() => {
      // Before: addToCart({ userId: user!.id, data: {...} })
      //       required manual userId handling and missed invalidation.
      // Now: addItem() from CartContext manages userId and invalidation automatically.
      addItem({
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity,
      });
    });
  }, [isInStock, allOptionsSelected, product, selectedVariant, quantity, addItem, requireAuth]);

  // ── Return ─────────────────────────────────────────────────────────
  return {
    product,
    isLoading,
    isError,
    sortedImages,
    selectedImage,
    setSelectedImage,
    selectedOptions,
    selectedVariant,
    handleOptionSelect,
    handleSelectVariantFromTable,
    displayPrice,
    displayComparePrice,
    discountPercent,
    displayStock,
    isInStock,
    quantity,
    setQuantity,
    allOptionsSelected,
    isAddingToCart,
    onAddToCart,
  };
}