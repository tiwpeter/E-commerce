import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { prisma } from '../config/database';
import { orderRepository } from '../repositories/order.repository';
import { cartRepository } from '../repositories/cart.repository';
import { productRepository } from '../repositories/product.repository';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';
import { generateOrderNumber, generateTransactionId } from '../utils/slug.util';
import { buildPaginationMeta, parsePagination } from '../utils/response.helper';

export interface CreateOrderDto {
  addressId: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  trackingNumber?: string;
}

export class OrderService {
  async createFromCart(userId: string, dto: CreateOrderDto) {
    // Get cart with items
    const cart = await cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError('Cart is empty');
    }

    // Validate all items have sufficient stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}`
        );
      }
      if (!item.product.isActive) {
        throw new BadRequestError(`Product "${item.product.name}" is no longer available`);
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const shippingFee = subtotal >= 100 ? 0 : 9.99; // Free shipping over $100
    const total = subtotal + shippingFee;

    // Create order + items + payment in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          addressId: dto.addressId,
          subtotal,
          shippingFee,
          total,
          notes: dto.notes,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              total: Number(item.product.price) * item.quantity,
            })),
          },
        },
        include: {
          items: { include: { product: { select: { id: true, name: true } } } },
          address: true,
        },
      });

      // Decrement stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Simulate payment processing
      const payment = await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: total,
          method: dto.paymentMethod,
          status: PaymentStatus.PENDING,
        },
      });

      // Simulate payment success (mock gateway)
      const paymentSuccess = await this.simulatePayment(dto.paymentMethod);
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: paymentSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
          transactionId: generateTransactionId(),
          paidAt: paymentSuccess ? new Date() : null,
          failedAt: paymentSuccess ? null : new Date(),
        },
      });

      if (paymentSuccess) {
        await tx.order.update({
          where: { id: newOrder.id },
          data: { status: OrderStatus.PAID },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return { ...newOrder, payment: updatedPayment };
    });

    return orderRepository.findById(order.id);
  }

  async getOrders(userId: string, query: Record<string, string | undefined>) {
    const { page, limit, skip } = parsePagination(query);
    const [orders, total] = await orderRepository.findAll({
      skip,
      take: limit,
      userId,
      status: query.status as OrderStatus | undefined,
    });
    return { orders, meta: buildPaginationMeta(total, page, limit) };
  }

  async getAllOrders(query: Record<string, string | undefined>) {
    const { page, limit, skip } = parsePagination(query);
    const [orders, total] = await orderRepository.findAll({
      skip,
      take: limit,
      status: query.status as OrderStatus | undefined,
      search: query.search,
    });
    return { orders, meta: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string, userId?: string) {
    const order = await orderRepository.findById(id);
    if (!order) throw new NotFoundError('Order not found');

    // Non-admin can only view their own orders
    if (userId && order.userId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderDto) {
    const order = await orderRepository.findById(id);
    if (!order) throw new NotFoundError('Order not found');

    // Validate status transitions
    this.validateStatusTransition(order.status, dto.status!);

    const updateData: any = {
      ...(dto.status && { status: dto.status }),
      ...(dto.trackingNumber && { trackingNumber: dto.trackingNumber }),
    };

    if (dto.status === 'SHIPPED') updateData.shippedAt = new Date();
    if (dto.status === 'COMPLETED') updateData.completedAt = new Date();
    if (dto.status === 'CANCELED') updateData.canceledAt = new Date();

    return orderRepository.update(id, updateData);
  }

  async getDashboardStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      dailyRevenue,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] } },
      }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      orderRepository.getDailyRevenue(30),
    ]);

    return {
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.total ?? 0),
      pendingOrders,
      completedOrders,
      dailyRevenue,
    };
  }

  private validateStatusTransition(current: OrderStatus, next: OrderStatus): void {
    const allowed: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['PAID', 'CANCELED'],
      PAID: ['SHIPPED', 'CANCELED'],
      SHIPPED: ['COMPLETED', 'CANCELED'],
      COMPLETED: [],
      CANCELED: [],
    };

    if (!allowed[current].includes(next)) {
      throw new BadRequestError(
        `Cannot transition from ${current} to ${next}`
      );
    }
  }

  private async simulatePayment(method: PaymentMethod): Promise<boolean> {
    // Simulate async payment gateway call
    await new Promise((r) => setTimeout(r, 100));
    // Mock: always succeeds except BANK_TRANSFER has 10% failure
    if (method === PaymentMethod.BANK_TRANSFER) {
      return Math.random() > 0.1;
    }
    return true;
  }
}

export const orderService = new OrderService();
