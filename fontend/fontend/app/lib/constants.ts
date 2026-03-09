// src/lib/constants.ts

export const QUERY_KEYS = {
  PRODUCTS:   ['products'] as const,
  PRODUCT:    (slug: string) => ['products', slug] as const,
  CATEGORIES: ['categories'] as const,
  CART:       ['cart'] as const,
  ORDERS:     ['orders'] as const,
  ORDER:      (id: string) => ['orders', id] as const,
  ME:         ['me'] as const,
} as const;
