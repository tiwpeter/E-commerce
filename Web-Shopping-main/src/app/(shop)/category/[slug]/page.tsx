// src/app/category/[slug]/page.tsx
// Server Component — runs on server, no "use client"

import { notFound } from "next/navigation";
import { CategoryPageClient } from "@/app/features/category/components/CategoryPageClient";
import { fetchCategoryBySlug } from "@/app/features/category/services/category.service";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

// ────────────────────────────────────────────────
// generateMetadata — SEO from server
// ────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // ✅ await ก่อนใช้
  try {
    const category = await fetchCategoryBySlug(slug);
    return {
      title: `${category.name} | MyShop`,
      description: category.description ?? `Shop ${category.name} products`,
      openGraph: {
        images: category.imageUrl ? [category.imageUrl] : [],
      },
    };
  } catch {
    return { title: "Category | MyShop" };
  }
}
// ────────────────────────────────────────────────
// Page — fetch on server, pass down to client
// ────────────────────────────────────────────────
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  let category;
  try {
    category = await fetchCategoryBySlug(slug);
  } catch {
    notFound(); // renders Next.js not-found.tsx
  }

  // children are already sorted by sortOrder from the API
  const activeSubcategories = category.children.filter((c) => c.isActive);

  return (
    <CategoryPageClient
      slug={slug}
      categoryName={category.name}
      subcategories={activeSubcategories}
    />
  );
}
