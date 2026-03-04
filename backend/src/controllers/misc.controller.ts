import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service';
import { categoryService } from '../services/category.service';
import { reviewService } from '../services/review.service';
import { addressService } from '../services/address.service';
import { ResponseHelper } from '../utils/response.helper';

// ─── Cart Controller ──────────────────────────────────────────────────────────

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.getCart(req.user!.sub);
      ResponseHelper.success(res, cart);
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.addItem(req.user!.sub, productId, quantity);
      ResponseHelper.success(res, cart, 'Item added to cart');
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.updateItem(
        req.user!.sub,
        req.params.productId,
        req.body.quantity
      );
      ResponseHelper.success(res, cart, 'Cart updated');
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.removeItem(req.user!.sub, req.params.productId);
      ResponseHelper.success(res, cart, 'Item removed');
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.clearCart(req.user!.sub);
      ResponseHelper.success(res, cart, 'Cart cleared');
    } catch (error) {
      next(error);
    }
  }
}

// ─── Category Controller ──────────────────────────────────────────────────────

export class CategoryController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const categories = await categoryService.getAll(includeInactive);
      ResponseHelper.success(res, categories);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.getById(req.params.id);
      ResponseHelper.success(res, category);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.create(req.body);
      ResponseHelper.created(res, category);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.update(req.params.id, req.body);
      ResponseHelper.success(res, category, 'Category updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await categoryService.delete(req.params.id);
      ResponseHelper.noContent(res, 'Category deleted');
    } catch (error) {
      next(error);
    }
  }
}

// ─── Review Controller ────────────────────────────────────────────────────────

export class ReviewController {
  async getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await reviewService.getProductReviews(
        req.params.productId,
        req.query as Record<string, string>
      );
      ResponseHelper.paginated(res, result.reviews, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const review = await reviewService.create(
        req.user!.sub,
        req.params.productId,
        req.body
      );
      ResponseHelper.created(res, review, 'Review submitted');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = req.user!.role === 'ADMIN';
      await reviewService.delete(req.params.id, req.user!.sub, isAdmin);
      ResponseHelper.noContent(res, 'Review deleted');
    } catch (error) {
      next(error);
    }
  }

  async getAllReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await reviewService.getAllReviews(req.query as Record<string, string>);
      ResponseHelper.paginated(res, result.reviews, result.meta);
    } catch (error) {
      next(error);
    }
  }
}

// ─── Address Controller ───────────────────────────────────────────────────────

export class AddressController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const addresses = await addressService.getUserAddresses(req.user!.sub);
      ResponseHelper.success(res, addresses);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const address = await addressService.create(req.user!.sub, req.body);
      ResponseHelper.created(res, address);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const address = await addressService.update(req.user!.sub, req.params.id, req.body);
      ResponseHelper.success(res, address, 'Address updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await addressService.delete(req.user!.sub, req.params.id);
      ResponseHelper.noContent(res, 'Address deleted');
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
export const categoryController = new CategoryController();
export const reviewController = new ReviewController();
export const addressController = new AddressController();
