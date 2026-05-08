// ============================================================
// repositories/category.repository.ts
// ============================================================

import { PrismaClient } from "@prisma/client";
import type {
  Category,
  CategoryTree,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.schema";

export class CategoryRepository {
  constructor(private readonly db: PrismaClient) {}

  // ─── สำหรับ Sidebar ─────────────────────────────────────────
  async findTree(): Promise<CategoryTree[]> {
    // ดึงเฉพาะ parent (parentId = null) พร้อม children
    const categories = await this.db.category.findMany({
      where: {
        parentId: null,
        isActive: true,
        deletedAt: null,
      },
      orderBy: { name: "asc" },
      include: {
        children: {
          where: { isActive: true, deletedAt: null },
          orderBy: { name: "asc" },
          include: {
            children: {
              where: { isActive: true, deletedAt: null },
              orderBy: { name: "asc" },
            },
          },
        },
      },
    });

    return categories as unknown as CategoryTree[];
  }

  // ─── CRUD ────────────────────────────────────────────────────
  async findAll(): Promise<Category[]> {
    return this.db.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    }) as unknown as Category[];
  }

  async findById(id: string): Promise<Category | null> {
    return this.db.category.findFirst({
      where: { id, deletedAt: null },
    }) as unknown as Category | null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.db.category.findFirst({
      where: { slug, deletedAt: null },
    }) as unknown as Category | null;
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    return this.db.category.create({ data }) as unknown as Category;
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    return this.db.category.update({
      where: { id },
      data,
    }) as unknown as Category;
  }

  async softDelete(id: string): Promise<Category> {
    return this.db.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as unknown as Category;
  }

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const category = await this.db.category.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!category;
  }
}
