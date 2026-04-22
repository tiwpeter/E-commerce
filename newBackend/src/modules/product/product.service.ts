import { productRepository } from "./product.repository";
import { ProductFilter } from "./product.schema";

export const productService = {
 

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