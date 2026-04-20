import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import {
  createCategorySchema,
  updateCategorySchema,
  querySchema,
} from './category.schema';

export const CategoryController = {
  async create(req: Request, res: Response) {
    const parsed = createCategorySchema.parse(req.body);
    const data = await CategoryService.create(parsed);
    res.json(data);
  },

  async findAll(req: Request, res: Response) {
    const query = querySchema.parse(req.query);
    const data = await CategoryService.findAll(query);
    res.json(data);
  },

  async findOne(req: Request, res: Response) {
    const data = await CategoryService.findOne(req.params.id);
    res.json(data);
  },

  async update(req: Request, res: Response) {
    const parsed = updateCategorySchema.parse(req.body);
    const data = await CategoryService.update(req.params.id, parsed);
    res.json(data);
  },

  async delete(req: Request, res: Response) {
    await CategoryService.delete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  },

  async tree(req: Request, res: Response) {
    const data = await CategoryService.getTree();
    res.json(data);
  },
};