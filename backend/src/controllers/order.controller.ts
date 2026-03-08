import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { ResponseHelper } from '../utils/response.helper';

export class OrderController {
  // ─── User Endpoints ───────────────────────────────────────────────

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.createFromCart(req.user!.sub, req.body);
      ResponseHelper.created(res, order, 'Order placed successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await orderService.getOrders(
        req.user!.sub,
        req.query as Record<string, string>
      );
      ResponseHelper.paginated(res, result.orders, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getMyOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.getById(req.params.id, req.user!.sub);
      ResponseHelper.success(res, order);
    } catch (error) {
      next(error);
    }
  }

  // ─── Admin Endpoints ──────────────────────────────────────────────

  async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await orderService.getAllOrders(req.query as Record<string, string>);
      ResponseHelper.paginated(res, result.orders, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.getById(req.params.id);
      ResponseHelper.success(res, order);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.updateStatus(req.params.id, req.body);
      ResponseHelper.success(res, order, 'Order status updated');
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await orderService.getDashboardStats();
      ResponseHelper.success(res, stats);
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
