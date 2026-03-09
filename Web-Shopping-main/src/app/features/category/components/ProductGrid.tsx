"use client";

import Link from "next/link";
import { useCategoryProducts } from "../hooks/useCategoryProducts";
import type { CategoryQuery } from "../schemas/category.schema";

function ProductSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border p-3 rounded-lg flex flex-col gap-2 animate-pulse">
          <div className="bg-gray-200 rounded w-full aspect-square" />
          <div className="bg-gray-200 rounded h-4 w-3/4" />
          <div className="bg-gray-200 rounded h-4 w-1/2" />
          <div className="bg-gray-200 rounded h-3 w-1/4" />
        </div>
      ))}
    </>
  );
}

interface Props {
  categoryName: string;
  queryParams: CategoryQuery;
}

export function ProductGrid({ categoryName, queryParams }: Props) {
  const { data, isLoading, isError, error } = useCategoryProducts(queryParams);

  // ✅ แยก products และ meta ออกจาก data
  const products = data?.products ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <main className="flex-1 pl-6 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{categoryName}</h2>
        {!isLoading && (
          <span className="text-sm text-gray-500">{total} products</span>
        )}
      </div>

      {isError && (
        <div className="col-span-4 text-red-500 py-4">
          เกิดข้อผิดพลาด: {error?.message ?? "โหลดข้อมูลไม่สำเร็จ"}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading && <ProductSkeleton />}

        {!isLoading && products.length === 0 && (
          <div className="col-span-4 text-gray-500 py-8 text-center">
            ไม่พบสินค้าในหมวดหมู่นี้
          </div>
        )}

        {products.map((product) => {
          // ✅ หา primary image ก่อน fallback ไป image แรก
          const image = product.images.find((img) => img.isPrimary) ?? product.images[0];

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}  // ✅ ใช้ slug ดีกว่า id — SEO friendly
              className="border p-3 rounded-lg hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="aspect-square overflow-hidden rounded mb-2 bg-gray-50">
                {image ? (
                  <img
                    src={image.url}                    // ✅ image.url
                    alt={image.alt ?? product.name}    // ✅ image.alt
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                    ไม่มีรูปภาพ
                  </div>
                )}
              </div>

              <div className="text-sm font-medium line-clamp-2 flex-1">
                {product.name}                         {/* ✅ name */}
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-red-600 font-bold">
                  ฿{product.price.toLocaleString()}    {/* ✅ price */}
                </span>
                {product.comparePrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ฿{product.comparePrice.toLocaleString()}  {/* ✅ comparePrice */}
                  </span>
                )}
              </div>

              {/* ✅ category แทน brand */}
              {product.category && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {product.category.name}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}