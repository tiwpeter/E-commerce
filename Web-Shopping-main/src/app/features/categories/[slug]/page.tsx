"use client"; // ใส่ถ้า CategoryPageClient เป็น Client Component

import CategoryPageClient from "./components/CategoryPageClient";

interface Params {
  slug: string;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params; // ✅ ต้อง await เพราะ Next.js 15 มอง params เป็น Promise
  return <CategoryPageClient slug={slug} />;
}
