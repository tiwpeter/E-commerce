import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { ResponseHelper } from '../utils/response.helper';
import { getFileUrl } from '../middlewares/upload.middleware';

export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { products, meta } = await productService.getAll(
        req.query as Record<string, string>
      );
      ResponseHelper.paginated(res, products, meta);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getById(req.params.id);
      ResponseHelper.success(res, product);
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getBySlug(req.params.slug);
      ResponseHelper.success(res, product);
    } catch (error) {
      next(error);
    }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string ?? '8', 10);
      const products = await productService.getFeatured(limit);
      ResponseHelper.success(res, products);
    } catch (error) {
      next(error);
    }
  }

  async getBestSellers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string ?? '5', 10);
      const products = await productService.getBestSellers(limit);
      ResponseHelper.success(res, products);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create({
        ...req.body,
        price: parseFloat(req.body.price),
        comparePrice: req.body.comparePrice ? parseFloat(req.body.comparePrice) : undefined,
        stock: parseInt(req.body.stock, 10),
      });
      ResponseHelper.created(res, product);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.update(req.params.id, req.body);
      ResponseHelper.success(res, product, 'Product updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.delete(req.params.id);
      ResponseHelper.noContent(res, 'Product deleted');
    } catch (error) {
      next(error);
    }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const url = getFileUrl(req, req.file.filename);
      const isPrimary = req.body.isPrimary === 'true';
      const image = await productService.addImage(req.params.id, url, isPrimary);
      ResponseHelper.created(res, image, 'Image uploaded');
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.deleteImage(req.params.id, req.params.imageId);
      ResponseHelper.noContent(res, 'Image deleted');
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
