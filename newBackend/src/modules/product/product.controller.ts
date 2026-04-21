import { Request, Response } from "express";
import { productService } from "./product.service";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "./product.schema";

export const productController = {
  async create(req: Request, res: Response) {
    const data = createProductSchema.parse(req.body);
    const product = await productService.create(data);
    res.status(201).json(product);
  },

  async update(req: Request, res: Response) {
    const id = req.params.id;                        // ← ลบ Number() ออก
    const data = updateProductSchema.parse(req.body);
    const product = await productService.update(id, data);
    res.json(product);
  },

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