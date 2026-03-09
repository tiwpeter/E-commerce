"use client";

import { useState } from "react";
import { Breadcrumb } from "./Breadcrumb";
import { CategorySidebar } from "./CategorySidebar";
import { ProductGrid } from "./ProductGrid";
import type { Category } from "../schemas/category.schema";

interface Props {
  slug: string;
  categoryName: string;
  subcategories: Category[];
}

export function CategoryPageClient({ slug, categoryName, subcategories }: Props) {
  const [selectedSub, setSelectedSub] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const selectedSubName = subcategories.find(
    (s) => s.slug === selectedSub
  )?.name;

  return (
    <div className="bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <Breadcrumb
          slug={slug}
          categoryName={categoryName}
          selectedSubName={selectedSubName}
        />
      </div>

      <div className="max-w-6xl mx-auto flex px-4 pb-12">
        <CategorySidebar
          subcategories={subcategories}
          selectedSub={selectedSub}
          selectedBrand={selectedBrand}
          onSubChange={setSelectedSub}
          onBrandChange={setSelectedBrand}
        />
<ProductGrid
  categoryName={categoryName}
  queryParams={{
    category: slug,
    subSlug: selectedSub ,
    brand: selectedBrand ,
    page: 1,
    limit: 20,
  }}
/>
      </div>
    </div>
  );
}