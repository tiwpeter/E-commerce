import { Request, Response } from "express";
import { productService } from "./product.service";
import {
  productQuerySchema,
} from "./product.schema";

export const productController = {
  

  async delete(req: Request, res: Response) {
    const id = req.params.id;                        // ← ลบ Number() ออก
    await productService.delete(id);
    res.status(204).send();
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id;                        // ← ลบ Number() ออก
    const product = await productService.getById(id);
    res.json(product);
  },

  async getAll(req: Request, res: Response) {
    const query = productQuerySchema.parse(req.query);
    const result = await productService.getAll(query);
    res.json(result);
  },
};