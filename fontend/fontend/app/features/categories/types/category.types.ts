// src/features/categories/types/category.types.ts

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  _count?: {
    products: number;
  };
}
