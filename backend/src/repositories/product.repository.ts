import { Prisma, Product } from '@prisma/client';
import { prisma } from '../config/database';

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  skip: number;
  take: number;
}

const productWithRelations = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    images: { orderBy: { order: 'asc' } },
    category: { select: { id: true, name: true, slug: true } },
    reviews: { select: { rating: true } },
    _count: { select: { orderItems: true, reviews: true } },
  },
});

export type ProductWithRelations = Prisma.ProductGetPayload<typeof productWithRelations>;

export class ProductRepository {
  async findAll(filters: ProductFilters): Promise<[ProductWithRelations[], number]> {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.isFeatured !== undefined && { isFeatured: filters.isFeatured }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { sku: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
      ...((filters.minPrice !== undefined || filters.maxPrice !== undefined) && {
        price: {
          ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
          ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
        },
      }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
      switch (filters.sort) {
        case 'price_asc': return { price: 'asc' };
        case 'price_desc': return { price: 'desc' };
        case 'popular': return { orderItems: { _count: 'desc' } };
        case 'newest':
        default: return { createdAt: 'desc' };
      }
    })();

    return prisma.$transaction([
      prisma.product.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy,
        ...productWithRelations,
      }),
      prisma.product.count({ where }),
    ]);
  }

  async findById(id: string): Promise<ProductWithRelations | null> {
    return prisma.product.findFirst({
      where: { id, deletedAt: null },
      ...productWithRelations,
    });
  }

  async findBySlug(slug: string): Promise<ProductWithRelations | null> {
    return prisma.product.findFirst({
      where: { slug, deletedAt: null },
      ...productWithRelations,
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<ProductWithRelations> {
    return prisma.product.create({ data, ...productWithRelations });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<ProductWithRelations> {
    return prisma.product.update({ where: { id }, data, ...productWithRelations });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async addImage(productId: string, url: string, isPrimary: boolean, order: number) {
    return prisma.productImage.create({ data: { productId, url, isPrimary, order } });
  }

  async deleteImage(imageId: string): Promise<void> {
    await prisma.productImage.delete({ where: { id: imageId } });
  }

  async findBestSellers(limit = 5) {
    return prisma.product.findMany({
      where: { deletedAt: null, isActive: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        _count: { select: { orderItems: true } },
      },
      orderBy: { orderItems: { _count: 'desc' } },
      take: limit,
    });
  }

  async existsBySku(sku: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.product.count({
      where: { sku, deletedAt: null, ...(excludeId && { id: { not: excludeId } }) },
    });
    return count > 0;
  }

  async decrementStock(productId: string, quantity: number): Promise<void> {
    await prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });
  }
}

export const productRepository = new ProductRepository();
