'use client'

import { useProductDetail } from '../hooks/useProductDetail'
import type { ProductOption } from '@/api/generated/model'


interface ProductDetailProps {
  slug: string
}

export default function ProductDetail({ slug }: ProductDetailProps) {
    const {
    product, isLoading, isError,
    sortedImages, selectedImage, setSelectedImage,
    selectedOptions, selectedVariant,
    handleOptionSelect, handleSelectVariantFromTable,
    displayPrice, displayComparePrice, displayStock,
    isInStock, //discountPercent,
    quantity, setQuantity,
    allOptionsSelected, onAddToCart, isAddingToCart,
  } = useProductDetail(slug)

  if (isLoading) return <ProductDetailSkeleton />
  //if (isError || !product) return (/* error UI */)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
              {sortedImages.length > 0 ? (
                <img
                  src={sortedImages[selectedImage]?.url}
                  alt={sortedImages[selectedImage]?.alt || product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isFeatured && (
                  <span className="px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wide">
                    Featured
                  </span>
                )}
                {/* {discountPercent && discountPercent < 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {Math.abs(discountPercent)}% OFF
                  </span>
                )} */}
              </div>
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {sortedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === idx
                        ? 'border-gray-900 shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || `${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                SKU: {product.sku}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${parseFloat(displayPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {displayComparePrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${parseFloat(displayComparePrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                )}
                {/* {discountPercent && discountPercent < 0 && (
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Save {Math.abs(discountPercent)}%
                  </span>
                )} */}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Options */}
            {product.options.length > 0 && (
              <div className="flex flex-col gap-5">
                {product.options
                  .sort((a, b) => a.order - b.order)
                  .map((option: ProductOption) => (
                    <div key={option.id}>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {option.name}
                        {selectedOptions[option.name] && (
                          <span className="ml-2 text-gray-400 font-normal">
                            — {selectedOptions[option.name]}
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {option.values
                          .sort((a, b) => a.order - b.order)
                          .map((val) => (
                            <button
                              key={val.id}
                              onClick={() => handleOptionSelect(option.name, val.value)}
                              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-150 ${
                                selectedOptions[option.name] === val.value
                                  ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                              }`}
                            >
                              {val.value}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isInStock ? 'bg-green-500' : 'bg-red-400'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isInStock ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {isInStock
                  ? `In Stock ${displayStock > 0 && displayStock <= 10 ? `— Only ${displayStock} left` : ''}`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors text-lg font-semibold"
                >
                  −
                </button>
                <span className="px-5 py-3 text-gray-900 font-bold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(displayStock, q + 1))}
                  disabled={quantity >= displayStock || !isInStock}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors text-lg font-semibold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={onAddToCart}
                disabled={!isInStock || !allOptionsSelected|| isAddingToCart}
                className="flex-1 py-3.5 px-6 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
              >
                {!isInStock
                  ? 'Out of Stock'
                  : !allOptionsSelected
                  ? 'Select Options'
                  : isAddingToCart
                  ? 'Adding...'
                  : 'Add to Cart'}
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="rounded-2xl bg-gray-50 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                  Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              {product.weight && (
                <span>Weight: {product.weight}g</span>
              )}
              <span>
                Updated: {new Date(product.updatedAt ?? '').toLocaleDateString('en-US')}
              </span>
            </div>
          </div>
        </div>

        {/* Variants Table (if has variants) */}
        {product.hasVariants && product.variants.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-5">All Variants</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">SKU</th>
                    {product.options.map((opt) => (
                      <th key={opt.id} className="text-left px-5 py-3.5 font-semibold text-gray-600">
                        {opt.name}
                      </th>
                    ))}
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Price</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Stock</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant, idx) => {
                    const isSelected = selectedVariant?.id === variant.id
                    return (
                      <tr
                        key={variant.id}
                        className={`border-b border-gray-50 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-gray-900 text-white'
                            : idx % 2 === 0
                            ? 'bg-white hover:bg-gray-50'
                            : 'bg-gray-50/50 hover:bg-gray-100'
                        }`}
                        onClick={() => handleSelectVariantFromTable(variant.id)}
                      >
                        <td className={`px-5 py-3.5 font-mono text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                          {variant.sku}
                        </td>
                        {product.options.map((opt) => {
                          const vo = variant.variantOption.find(
                            (v) => v.optionValue.optionId === opt.id
                          )
                          return (
                            <td key={opt.id} className={`px-5 py-3.5 ${isSelected ? 'text-white font-medium' : 'text-gray-700'}`}>
                              {vo?.optionValue.value || '—'}
                              
                            </td>
                          )
                        })}
                        <td className={`px-5 py-3.5 font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          ${Number(variant.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`px-5 py-3.5 ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                          {variant.stock}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              variant.isActive && variant.stock > 0
                                ? isSelected
                                  ? 'bg-green-400/20 text-green-300'
                                  : 'bg-green-50 text-green-700'
                                : isSelected
                                ? 'bg-red-400/20 text-red-300'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {variant.isActive && variant.stock > 0 ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-gray-100 animate-pulse" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-9 w-3/4 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 w-40 bg-gray-100 rounded animate-pulse" />
            <div className="h-px bg-gray-100" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
            <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}