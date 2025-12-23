export type Subcategory = {
  id: string;
  name: string;
  slug?: string;
  productCount?: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories?: Subcategory[];
  media?: string;
};
