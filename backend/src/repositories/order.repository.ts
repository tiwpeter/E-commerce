import { Prisma, Order, OrderStatus } from '@prisma/client';
import { prisma } from '../config/database';

const orderWithRelations = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: {
    items: {
      include: {
        product: {
          select: { id: true, name: true, slug: true, images: { where: { isPrimary: true }, take: 1 } },
        },
      },
    },
    address: true,
    payment: true,
    user: { select: { id: true, name: true, email: true } },
  },
});

export type OrderWithRelations = Prisma.OrderGetPayload<typeof orderWithRelations>;

export class OrderRepository {
  async findAll(params: {
    skip: number;
    take: number;
    userId?: string;
    status?: OrderStatus;
    search?: string;
  }): Promise<[OrderWithRelations[], number]> {
    const where: Prisma.OrderWhereInput = {
      ...(params.userId && { userId: params.userId }),
      ...(params.status && { status: params.status }),
      ...(params.search && {
        OR: [
          { orderNumber: { contains: params.search, mode: 'insensitive' } },
          { user: { name: { contains: params.search, mode: 'insensitive' } } },
        ],
      }),
    };

    return prisma.$transaction([
      prisma.order.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        ...orderWithRelations,
      }),
      prisma.order.count({ where }),
    ]);
  }

  async findById(id: string): Promise<OrderWithRelations | null> {
    return prisma.order.findUnique({ where: { id }, ...orderWithRelations });
  }

  async findByNumber(orderNumber: string): Promise<OrderWithRelations | null> {
    return prisma.order.findUnique({ where: { orderNumber }, ...orderWithRelations });
  }

  async create(data: Prisma.OrderCreateInput): Promise<OrderWithRelations> {
    return prisma.order.create({ data, ...orderWithRelations });
  }

  async update(id: string, data: Prisma.OrderUpdateInput): Promise<OrderWithRelations> {
    return prisma.order.update({ where: { id }, data, ...orderWithRelations });
  }

  async getRevenueStats(startDate: Date, endDate: Date) {
    return prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] },
      },
      _sum: { total: true },
      _count: true,
    });
  }

  async getDailyRevenue(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.$queryRaw<{ date: Date; revenue: number; orders: number }[]>`
      SELECT
        DATE(created_at) as date,
        SUM(total) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE created_at >= ${startDate}
        AND status IN ('PAID', 'SHIPPED', 'COMPLETED')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
  }
}

export const orderRepository = new OrderRepository();
