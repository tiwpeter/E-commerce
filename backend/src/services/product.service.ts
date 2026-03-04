import { productRepository, ProductFilters } from '../repositories/product.repository';
import { categoryRepository } from '../repositories/category.repository';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';
import { slugify, generateUniqueSlug } from '../utils/slug.util';
import { buildPaginationMeta, parsePagination } from '../utils/response.helper';

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  categoryId: string;
  isFeatured?: boolean;
  weight?: number;
}

export interface ProductQueryDto {
  page?: string;
  limit?: string;
  search?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  sort?: string;
  featured?: string;
  isActive?: string;
}

export class ProductService {
  async getAll(query: ProductQueryDto) {
    const { page, limit, skip } = parsePagination(query);

    const filters: ProductFilters = {
      skip,
      take: limit,
      search: query.search,
      categoryId: query.categoryId,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      sort: query.sort as ProductFilters['sort'],
      isFeatured: query.featured === 'true' ? true : undefined,
      isActive: query.isActive !== undefined ? query.isActive === 'true' : true,
    };

    const [products, total] = await productRepository.findAll(filters);
    const meta = buildPaginationMeta(total, page, limit);

    // Enrich with avg rating
    const enriched = products.map((p) => ({
      ...p,
      averageRating:
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0,
      reviewCount: p._count.reviews,
    }));

    return { products: enriched, meta };
  }

  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    return this.enrichProduct(product);
  }

  async getBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw new NotFoundError('Product not found');
    return this.enrichProduct(product);
  }

  async create(dto: CreateProductDto) {
    // Validate category exists
    const category = await categoryRepository.findById(dto.categoryId);
    if (!category) throw new NotFoundError('Category not found');

    // Check SKU uniqueness
    const skuExists = await productRepository.existsBySku(dto.sku);
    if (skuExists) throw new ConflictError(`SKU '${dto.sku}' already in use`);

    // Generate unique slug
    const baseSlug = slugify(dto.name);
    const slugExists = await productRepository.findBySlug(baseSlug);
    const slug = slugExists ? generateUniqueSlug(dto.name) : baseSlug;

    const product = await productRepository.create({
      name: dto.name,
      slug,
      description: dto.description,
      price: dto.price,
      comparePrice: dto.comparePrice,
      stock: dto.stock,
      sku: dto.sku,
      isFeatured: dto.isFeatured ?? false,
      weight: dto.weight,
      category: { connect: { id: dto.categoryId } },
    });

    return this.enrichProduct(product);
  }

  async update(id: string, dto: Partial<CreateProductDto> & { isActive?: boolean }) {
    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError('Product not found');

    if (dto.sku && dto.sku !== existing.sku) {
      const skuExists = await productRepository.existsBySku(dto.sku, id);
      if (skuExists) throw new ConflictError(`SKU '${dto.sku}' already in use`);
    }

    const product = await productRepository.update(id, {
      ...(dto.name && { name: dto.name, slug: slugify(dto.name) }),
      ...(dto.description && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.comparePrice !== undefined && { comparePrice: dto.comparePrice }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
      ...(dto.sku && { sku: dto.sku }),
      ...(dto.categoryId && { category: { connect: { id: dto.categoryId } } }),
      ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.weight !== undefined && { weight: dto.weight }),
    });

    return this.enrichProduct(product);
  }

  async delete(id: string): Promise<void> {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    await productRepository.softDelete(id);
  }

  async addImage(id: string, url: string, isPrimary: boolean) {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found');

    const order = product.images.length;
    return productRepository.addImage(id, url, isPrimary, order);
  }

  async deleteImage(productId: string, imageId: string): Promise<void> {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');

    const image = product.images.find((img) => img.id === imageId);
    if (!image) throw new NotFoundError('Image not found');

    await productRepository.deleteImage(imageId);
  }

  async getFeatured(limit = 8) {
    const [products] = await productRepository.findAll({
      skip: 0,
      take: limit,
      isFeatured: true,
      isActive: true,
    });
    return products.map((p) => this.enrichProduct(p));
  }

  async getBestSellers(limit = 5) {
    return productRepository.findBestSellers(limit);
  }

  private enrichProduct(product: any) {
    const ratings = product.reviews?.map((r: any) => r.rating) ?? [];
    return {
      ...product,
      averageRating: ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0,
      reviewCount: product._count?.reviews ?? 0,
    };
  }
}

export const productService = new ProductService();
