import { categoryRepository } from '../repositories/category.repository';
import { NotFoundError, ConflictError } from '../utils/errors';
import { slugify } from '../utils/slug.util';

export interface CategoryDto {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive?: boolean;
}

export class CategoryService {
  async getAll(includeInactive = false) {
    return categoryRepository.findAll(includeInactive);
  }

  async getById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  }

  async create(dto: CategoryDto) {
    const slug = slugify(dto.name);
    const exists = await categoryRepository.existsBySlug(slug);
    if (exists) throw new ConflictError(`Category '${dto.name}' already exists`);

    return categoryRepository.create({
      name: dto.name,
      slug,
      description: dto.description,
      image: dto.image,
      isActive: dto.isActive ?? true,
      ...(dto.parentId && { parent: { connect: { id: dto.parentId } } }),
    });
  }

  async update(id: string, dto: Partial<CategoryDto>) {
    const existing = await categoryRepository.findById(id);
    if (!existing) throw new NotFoundError('Category not found');

    const slug = dto.name ? slugify(dto.name) : undefined;
    if (slug) {
      const exists = await categoryRepository.existsBySlug(slug, id);
      if (exists) throw new ConflictError(`Category '${dto.name}' already exists`);
    }

    return categoryRepository.update(id, {
      ...(dto.name && { name: dto.name, slug }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.image !== undefined && { image: dto.image }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.parentId !== undefined && {
        parent: dto.parentId ? { connect: { id: dto.parentId } } : { disconnect: true },
      }),
    });
  }

  async delete(id: string): Promise<void> {
    const category = await categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found');
    await categoryRepository.softDelete(id);
  }
}

export const categoryService = new CategoryService();
