// src/features/category/components/CategorySidebar.tsx

"use client";

import type { Category } from "../schemas/category.schema";

const BRANDS = ["Xiaomi", "Samsung", "Apple", "Huawei", "Oppo"] as const;

interface Props {
  subcategories: Category[];
  selectedSub: string;
  selectedBrand: string;
  onSubChange: (slug: string) => void;
  onBrandChange: (brand: string) => void;
}

export function CategorySidebar({
  subcategories,
  selectedSub,
  selectedBrand,
  onSubChange,
  onBrandChange,
}: Props) {
  const sortedSubs = [...subcategories].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return (
    <aside className="w-56 pr-6 border-r shrink-0">
      {/* Subcategories */}
      <section className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Subcategories</h3>
        <ul className="text-sm space-y-1">
          <li
            className={`cursor-pointer px-2 py-1 rounded transition-colors ${
              selectedSub === ""
                ? "bg-orange-100 font-medium text-orange-700"
                : "hover:bg-gray-100"
            }`}
            onClick={() => onSubChange("")}
          >
            All Products
          </li>
          {sortedSubs.map((sub) => (
            <li
              key={sub.id}
              className={`cursor-pointer px-2 py-1 rounded transition-colors ${
                selectedSub === sub.slug
                  ? "bg-orange-100 font-medium text-orange-700"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => onSubChange(sub.slug)}
            >
              {sub.name}
            </li>
          ))}
        </ul>
      </section>

      {/* Brand filter */}
      <section>
        <h3 className="font-semibold text-lg mb-2">Brand</h3>
        <ul className="text-sm space-y-2">
          {BRANDS.map((brand) => {
            const value = brand.toLowerCase();
            return (
              <li key={brand} className="flex items-center gap-2">
                <input
                  id={`brand-${value}`}
                  type="checkbox"
                  className="accent-orange-500"
                  checked={selectedBrand === value}
                  onChange={() =>
                    onBrandChange(selectedBrand === value ? "" : value)
                  }
                />
                <label
                  htmlFor={`brand-${value}`}
                  className="cursor-pointer select-none"
                >
                  {brand}
                </label>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
