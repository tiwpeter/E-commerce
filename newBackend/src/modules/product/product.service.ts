import { productRepository } from "./product.repository";
import { CreateProductInput, UpdateProductInput, ProductFilter } from "./product.types";

export const productService = {
  /*create(data: CreateProductInput) {
    return productRepository.create(data);
  },
*/
  update(id: number, data: UpdateProductInput) {
    return productRepository.update(id, data);
  },

  delete(id: number) {
    return productRepository.delete(id);
  },

  getById(id: number) {
    return productRepository.findById(id);
  },

  getAll(filter: ProductFilter) {
    return productRepository.findAll(filter);
  },
};