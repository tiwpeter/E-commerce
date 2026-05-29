import { useState, useMemo, useCallback } from 'react'
import { useGetProductsSlugSlug } from '@/api/generated/products/products'
import type { ProductVariant } from '@/api/generated/model'
import { usePostCartsUserIdItems } from '@/api/generated/cart/cart'

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectedOptions = Record<string, string>

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProductDetail(slug: string) {
  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useGetProductsSlugSlug(slug)
  const product = data?.data

  // เพิ่ม cart mutation
  const { mutate: addToCart, isPending: isAddingToCart } = usePostCartsUserIdItems()

  // ── UI state ───────────────────────────────────────────────────────────────
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})
  const [quantity, setQuantity] = useState(1)

  // ── Derived: sorted images ─────────────────────────────────────────────────
  const sortedImages = useMemo(() => {
    if (!product?.images?.length) return []
    return [...product.images].sort((a, b) => {
      // isPrimary first, then by order, then by insertion
      if (a.isPrimary && !b.isPrimary) return -1
      if (!a.isPrimary && b.isPrimary) return 1
      return (a.order ?? 0) - (b.order ?? 0)
    })
  }, [product?.images])

  // ── Derived: matched variant ───────────────────────────────────────────────
  /**
   * Find the variant whose options fully match `selectedOptions`.
   * Uses optionValue.value for matching (same field the UI buttons render).
   */
  const selectedVariant = useMemo<ProductVariant | null>(() => {
    if (!product?.hasVariants || !product.variants?.length) return null

    const selectedEntries = Object.entries(selectedOptions)
    if (!selectedEntries.length) return null

    return (
      product.variants.find((variant) => {
        return selectedEntries.every(([optionName, optionValue]) => {
          // Find the option id by name
          const option = product.options.find((o) => o.name === optionName)
          if (!option) return false

          // Check if this variant has a variantOption matching both optionId and value
          return variant.variantOption.some(
            (vo) =>
              vo.optionValue.optionId === option.id &&
              vo.optionValue.value === optionValue
          )
        })
      }) ?? null
    )
  }, [selectedOptions, product?.variants, product?.options, product?.hasVariants])

  // ── Derived: price ─────────────────────────────────────────────────────────
  const displayPrice = useMemo(() => {
    if (product?.hasVariants && selectedVariant) {
      return String(selectedVariant.price)
    }
    return String(product?.basePrice ?? '0')
  }, [product?.hasVariants, product?.basePrice, selectedVariant])

  const displayComparePrice = useMemo(() => {
    if (product?.hasVariants && selectedVariant) {
      return selectedVariant.comparePrice != null
        ? String(selectedVariant.comparePrice)
        : null
    }
    return product?.comparePrice != null ? String(product.comparePrice) : null
  }, [product?.hasVariants, product?.comparePrice, selectedVariant])

  const discountPercent = useMemo(() => {
    if (!displayComparePrice) return null
    const price = parseFloat(displayPrice)
    const compare = parseFloat(displayComparePrice)
    if (!compare || compare <= price) return null
    return Math.round(((price - compare) / compare) * 100) // negative = discount
  }, [displayPrice, displayComparePrice])

  // ── Derived: stock ─────────────────────────────────────────────────────────
  const displayStock = useMemo(() => {
    if (product?.hasVariants && selectedVariant) {
      return selectedVariant.stock ?? 0
    }
    return product?.stock ?? 0
  }, [product?.hasVariants, product?.stock, selectedVariant])

  const isInStock = useMemo(() => {
    if (product?.hasVariants) {
      if (!selectedVariant) return false
      return (selectedVariant.isActive ?? true) && (selectedVariant.stock ?? 0) > 0
    }
    return (product?.isActive ?? true) && displayStock > 0
  }, [product?.hasVariants, product?.isActive, selectedVariant, displayStock])

  // ── Derived: all options selected ──────────────────────────────────────────
  const allOptionsSelected = useMemo(() => {
    if (!product?.hasVariants || !product.options?.length) return true
    return product.options.every((opt) => !!selectedOptions[opt.name])
  }, [product?.hasVariants, product?.options, selectedOptions])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleOptionSelect = useCallback(
    (optionName: string, value: string) => {
      setSelectedOptions((prev) => {
        // Toggle off if same value clicked
        if (prev[optionName] === value) {
          const next = { ...prev }
          delete next[optionName]
          return next
        }
        return { ...prev, [optionName]: value }
      })
      // Reset quantity when options change
      setQuantity(1)
    },
    []
  )

  /**
   * Select a variant directly from the variants table.
   * Reverse-maps the variant's optionValues back into selectedOptions.
   */
  const handleSelectVariantFromTable = useCallback(
    (variantId: string) => {
      if (!product?.variants || !product.options) return

      const variant = product.variants.find((v) => v.id === variantId)
      if (!variant) return

      const newOptions: SelectedOptions = {}
      for (const vo of variant.variantOption) {
        const option = product.options.find(
          (o) => o.id === vo.optionValue.optionId
        )
        if (option) {
          newOptions[option.name] = vo.optionValue.value
        }
      }
      setSelectedOptions(newOptions)
      setQuantity(1)
    },
    [product?.variants, product?.options]
  )

  const onAddToCart = useCallback(() => {
    if (!isInStock || !allOptionsSelected || !product) return
    const userId = "user_dev_001" 
    
    addToCart({
      userId, // คุณต้องมี userId จาก context หรือ state ของคุณ
      data: {
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity,
      }
    })
  }, [isInStock, allOptionsSelected, product, selectedVariant, quantity, addToCart])

  // ── Return ─────────────────────────────────────────────────────────────────
  return {
    // Data
    product,
    isLoading,
    isError,

    // Image state
    sortedImages,
    selectedImage,
    setSelectedImage,

    // Option / variant state
    selectedOptions,
    selectedVariant,

    // Handlers
    handleOptionSelect,
    handleSelectVariantFromTable,

    // Derived price
    displayPrice,
    displayComparePrice,
    discountPercent,

    // Derived stock
    displayStock,
    isInStock,

    // Quantity
    quantity,
    setQuantity,

    // Validation
    allOptionsSelected,
    isAddingToCart,
    onAddToCart,
  }
}