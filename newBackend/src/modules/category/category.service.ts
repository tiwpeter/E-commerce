import { CategoryRepository } from './category.repository';
import { generateSlug, buildTree } from './category.utils';

export const CategoryService = {
  async create(data: any) {
    const slug = generateSlug(data.name);
    return CategoryRepository.create({ ...data, slug });
  },

  async findAll(query: any) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      CategoryRepository.findMany(skip, limit, search),
      CategoryRepository.count(search),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findOne(id: string) {
    const category = await CategoryRepository.findById(id);
    if (!category) throw new Error('Category not found');
    return category;
  },

  async update(id: string, data: any) {
    if (data.name) {
      data.slug = generateSlug(data.name);
    }
    return CategoryRepository.update(id, data);
  },

  async delete(id: string) {
    return CategoryRepository.softDelete(id);
  },

  async getTree() {
    const categories = await CategoryRepository.findAll();
    return buildTree(categories, null);
  },
};