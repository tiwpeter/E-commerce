// hooks/useProducts.ts
import { GetProductsParams } from '@/api/generated/model/getProductsParams'
import { useGetProducts } from '@/api/generated/products/products'
import { toProduct } from '@/lib/mappers'

export function useProducts(params?: GetProductsParams) {
  const { data: response, isPending, isError } = useGetProducts(params)

  return {
    products: response?.items.map(toProduct) ?? [],
    isPending,
    isError,
  }
}