// hooks/useProductDetail.ts
import { useState } from 'react'
import { useGetApiProductsSlugSlug } from '@/api/generated/products/products'
import { useAddToCart } from './useAddToCart'
import type { ProductVariant } from '@/api/generated/model'

export const useProductDetail = (slug: string) => {
  const { data, isLoading, isError } = useGetApiProductsSlugSlug(slug)
  const { handleAddToCart, isPending } = useAddToCart()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)

  const product = data?.data ?? null

  const getSelectedVariant = (): ProductVariant | null => {
    if (!product || !product.hasVariants || product.variants.length === 0) return null
    return (
      product.variants.find((variant) =>
        variant.variantOption.every((vo) => {
          const option = product.options.find((o) => o.id === vo.optionValue.optionId)
          if (!option) return false
          return selectedOptions[option.name] === vo.optionValue.value
        })
      ) || null
    )
  }

  const selectedVariant = getSelectedVariant()

  const images = product?.images ?? []
  const primaryImage = images.find((img) => img.isPrimary) || images[0]
  const sortedImages = primaryImage
    ? [primaryImage, ...images.filter((img) => img.id !== primaryImage.id)]
    : images

  const displayPrice = selectedVariant?.price ?? product?.basePrice ?? '0'
  const displayComparePrice = selectedVariant?.comparePrice ?? product?.comparePrice
  const displayStock = selectedVariant?.stock ?? product?.stock ?? 0
  const isInStock = displayStock > 0

  const discountPercent = displayComparePrice
    ? Math.round(
        ((parseFloat(displayComparePrice) - parseFloat(displayPrice)) /
          parseFloat(displayComparePrice)) * 100
      )
    : null

  const allOptionsSelected =
    !product?.hasVariants ||
    product.options.every((opt) => selectedOptions[opt.name])

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }))
  }

  const handleSelectVariantFromTable = (variantId: string) => {
    const variant = product?.variants.find((v) => v.id === variantId)
    if (!variant) return
    const newOptions: Record<string, string> = {}
    variant.variantOption.forEach((vo) => {
      const option = product?.options.find((o) => o.id === vo.optionValue.optionId)
      if (option) newOptions[option.name] = vo.optionValue.value
    })
    setSelectedOptions(newOptions)
  }

  const onAddToCart = () => {
    if (!product) return
    handleAddToCart(product.id, quantity, selectedVariant?.id)
  }

  return {
    // data
    product,
    isLoading,
    isError,
    // images
    sortedImages,
    selectedImage,
    setSelectedImage,
    // options
    selectedOptions,
    selectedVariant,
    handleOptionSelect,
    handleSelectVariantFromTable,
    // price/stock
    displayPrice,
    displayComparePrice,
    displayStock,
    isInStock,
    discountPercent,
    // cart
    quantity,
    setQuantity,
    allOptionsSelected,
    onAddToCart,
    isPending,
  }
}