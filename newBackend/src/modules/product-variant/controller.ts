// controller.ts
import { Request, Response } from 'express'
import { ProductVariantService } from './service'
//import { createProductSchema } from './validator'

const service = new ProductVariantService()

export class ProductVariantController {
  /*async create(req: Request, res: Response) {
    const parsed = createProductSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json(parsed.error)
    }

    const result = await service.createProductWithVariants(parsed.data)
    res.json(result)
  }
*/
  async getVariants(req: Request, res: Response) {
    const { productId } = req.params
    const data = await service.getVariants(productId)
    res.json(data)
  }

  async updateStock(req: Request, res: Response) {
    const { variantId } = req.params
    const { stock } = req.body

    const data = await service.updateStock(variantId, stock)
    res.json(data)
  }
}