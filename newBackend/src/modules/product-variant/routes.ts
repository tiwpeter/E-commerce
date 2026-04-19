// service.ts
import { prisma } from '@/prisma/client'
//import { CreateProductDTO } from './dto'
//import { generateCombinations } from './utils'

export class ProductVariantService {
  /*async createProductWithVariants(dto: CreateProductDTO) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Product
      const product = await tx.product.create({
        data: { name: dto.name }
      })

      // 2. Create Options + Values
      const optionMap: Record<string, string[]> = {}

      for (const opt of dto.options) {
        const option = await tx.productOption.create({
          data: {
            name: opt.name,
            productId: product.id
          }
        })

        const values = await Promise.all(
          opt.values.map(v =>
            tx.optionValue.create({
              data: {
                value: v,
                optionId: option.id
              }
            })
          )
        )

        optionMap[option.id] = values.map(v => v.id)
      }

      // 3. Generate combinations
      const valueArrays = Object.values(optionMap)
      const combinations = generateCombinations(valueArrays)

      // 4. Create Variants
      for (const combo of combinations) {
        const variant = await tx.productVariant.create({
          data: {
            productId: product.id,
            sku: this.generateSKU(combo),
            price: dto.basePrice,
            stock: dto.baseStock
          }
        })

        // Link option values
        await Promise.all(
          combo.map(valueId =>
            tx.variantOptionValue.create({
              data: {
                variantId: variant.id,
                optionValueId: valueId
              }
            })
          )
        )
      }

      return product
    })
  }*/

  async updateStock(variantId: string, stock: number) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stock }
    })
  }

  async getVariants(productId: string) {
    return prisma.productVariant.findMany({
      where: { productId },
      include: {
        variantOption: {
          include: {
            optionValue: {
              include: {
                option: true
              }
            }
          }
        }
      }
    })
  }

  private generateSKU(optionValueIds: string[]) {
    return `SKU-${optionValueIds.join('-').slice(0, 12)}`
  }
}