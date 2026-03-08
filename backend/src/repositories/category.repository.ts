import { Prisma, Category } from '@prisma/client';
import { prisma } from '../config/database';

export class CategoryRepository {
  async findAll(includeInactive = false) {
    return prisma.category.findMany({
      where: {
        deletedAt: null,
        parentId: null, // top-level only
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        children: {
          where: { deletedAt: null, ...(includeInactive ? {} : { isActive: true }) },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findFirst({ where: { id, deletedAt: null } });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findFirst({ where: { slug, deletedAt: null } });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.category.count({
      where: { slug, deletedAt: null, ...(excludeId && { id: { not: excludeId } }) },
    });
    return count > 0;
  }
}

export const categoryRepository = new CategoryRepository();
