// ============================================================
// repositories/product.repository.ts
// ============================================================

import { PrismaClient } from "@prisma/client";
import type {
  CreateProductInput,
  UpdateProductInput,
  Product,
} from "./products.schema";

export interface ProductFilters {
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(
    filters: ProductFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<Product>> {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.isFeatured !== undefined && { isFeatured: filters.isFeatured }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" as const } },
          { description: { contains: filters.search, mode: "insensitive" as const } },
          { sku: { contains: filters.search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
        },
      }),
      this.db.product.count({ where }),
    ]);

    return {
      data: data as unknown as Product[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.db.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
        options: {
          orderBy: { order: "asc" },
          include: {
            values: { orderBy: { order: "asc" } },
          },
        },
        variants: {
          where: { isActive: true },
          include: {
            optionValues: {
              include: { optionValue: true },
            },
          },
        },
      },
    });

    return product as unknown as Product | null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = await this.db.product.findFirst({
      where: { slug, deletedAt: null },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
        options: {
          orderBy: { order: "asc" },
          include: { values: { orderBy: { order: "asc" } } },
        },
        variants: {
          where: { isActive: true },
          include: {
            optionValues: {
              include: { optionValue: true },
            },
          },
        },
      },
    });

    return product as unknown as Product | null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.db.product.findFirst({
      where: { sku, deletedAt: null },
    }) as unknown as Product | null;
  }

  async create(data: CreateProductInput): Promise<Product> {
    return this.db.product.create({ data }) as unknown as Product;
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    return this.db.product.update({
      where: { id },
      data,
    }) as unknown as Product;
  }

  async softDelete(id: string): Promise<Product> {
    return this.db.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as unknown as Product;
  }

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const product = await this.db.product.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!product;
  }

  async existsBySku(sku: string, excludeId?: string): Promise<boolean> {
    const product = await this.db.product.findFirst({
      where: {
        sku,
        deletedAt: null,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!product;
  }
}
