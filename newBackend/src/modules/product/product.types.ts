import { Product } from "@prisma/client";

export type ProductDTO = Product;

export type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  isActive?: boolean;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type ProductFilter = {
  categoryId?: string  ;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  page: number;
  limit: number;
};