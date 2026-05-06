// hooks/useAddToCart.ts
import { useQueryClient } from '@tanstack/react-query'
import { usePostApiCartItems } from '@/api/generated/cart/cart'

export const useAddToCart = () => {
  const queryClient = useQueryClient()
  const { mutate: addToCart, isPending } = usePostApiCartItems()

  const handleAddToCart = (productId: string, quantity: number, variantId?: string) => {
    addToCart({
      data: { productId, variantId, quantity }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/cart/'] })
      },
      onError: (error) => console.error('Failed:', error),
    })
  }

  return { handleAddToCart, isPending }
}