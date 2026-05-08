// ============================================================
// services/category.service.ts
// ============================================================

import type { CategoryRepository } from "./category.repository";
import type {
  Category,
  CategoryTree,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.schema";

export class CategoryNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Category not found: ${identifier}`);
    this.name = "CategoryNotFoundError";
  }
}

export class CategoryConflictError extends Error {
  constructor(field: string, value: string) {
    super(`Category with ${field} "${value}" already exists`);
    this.name = "CategoryConflictError";
  }
}

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  // สำหรับ Sidebar
  async getCategoryTree(): Promise<CategoryTree[]> {
    return this.categoryRepository.findTree();
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new CategoryNotFoundError(id);
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) throw new CategoryNotFoundError(slug);
    return category;
  }

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    const slugExists = await this.categoryRepository.existsBySlug(data.slug);
    if (slugExists) throw new CategoryConflictError("slug", data.slug);
    return this.categoryRepository.create(data);
  }

  async updateCategory(id: string, data: UpdateCategoryInput): Promise<Category> {
    await this.getCategoryById(id); // throws if not found

    if (data.slug) {
      const slugExists = await this.categoryRepository.existsBySlug(data.slug, id);
      if (slugExists) throw new CategoryConflictError("slug", data.slug);
    }

    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.getCategoryById(id); // throws if not found
    await this.categoryRepository.softDelete(id);
  }
}
