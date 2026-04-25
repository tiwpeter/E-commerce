// ============================================================
// services/product.service.ts
// ============================================================

import type { ProductRepository, ProductFilters, PaginationOptions, PaginatedResult } from "./product.repository";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "./products.schema";

export class ProductNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Product not found: ${identifier}`);
    this.name = "ProductNotFoundError";
  }
}

export class ProductConflictError extends Error {
  constructor(field: string, value: string) {
    super(`Product with ${field} "${value}" already exists`);
    this.name = "ProductConflictError";
  }
}

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts(
    filters: ProductFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<Product>> {
    return this.productRepository.findAll(filters, pagination);
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new ProductNotFoundError(id);
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product) throw new ProductNotFoundError(slug);
    return product;
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    const [slugExists, skuExists] = await Promise.all([
      this.productRepository.existsBySlug(data.slug),
      this.productRepository.existsBySku(data.sku),
    ]);

    if (slugExists) throw new ProductConflictError("slug", data.slug);
    if (skuExists) throw new ProductConflictError("sku", data.sku);

    return this.productRepository.create(data);
  }

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    await this.getProductById(id); // throws if not found

    if (data.slug) {
      const slugExists = await this.productRepository.existsBySlug(data.slug, id);
      if (slugExists) throw new ProductConflictError("slug", data.slug);
    }

    if (data.sku) {
      const skuExists = await this.productRepository.existsBySku(data.sku, id);
      if (skuExists) throw new ProductConflictError("sku", data.sku);
    }

    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.getProductById(id); // throws if not found
    await this.productRepository.softDelete(id);
  }
}
