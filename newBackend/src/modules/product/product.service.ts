import { productRepository } from "./product.repository";
import { CreateProductInput, UpdateProductInput, ProductFilter } from "./product.types";

export const productService = {
  create(data: CreateProductInput) {          // ← uncomment
    return productRepository.create(data);
  },

  update(id: string, data: UpdateProductInput) {  // ← number → string
    return productRepository.update(id, data);
  },

  delete(id: string) {                            // ← number → string
    return productRepository.delete(id);
  },

  getById(id: string) {                           // ← number → string
    return productRepository.findById(id);
  },

  getAll(filter: ProductFilter) {
    return productRepository.findAll(filter);
  },
};