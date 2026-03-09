// components/Category/CategoryList.tsx

"use client";

import React from "react";
import Link from "next/link";
import "./CategoryList.css";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface Props {
  categories: Category[];
}

const CategoryList: React.FC<Props> = ({ categories }) => {
  const displayedCategories = categories.slice(0, 7);

  return (
    <div className="features-section grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {displayedCategories.map((category) => (
        <Link
          key={category.id}
          href={`/features/categories/mobile`}
          className="feature-item block rounded-lg border p-4 hover:shadow-lg transition"
        >
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-32 object-cover rounded-md"
          />
          <p className="mt-2 text-center font-medium">{category.name}</p>
        </Link>
      ))}

      {/* Card เฉพาะตัว "เพิ่มเติม" จัดกึ่งกลาง */}
      {categories.length > 7 && (
        <Link
          href="/features/categories"
          className="feature-item rounded-lg border p-4 hover:shadow-lg transition bg-gray-100 flex flex-col items-center justify-center h-32"
        >
          <svg
            viewBox="0 0 49 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 md:h-16 md:w-16"
          >
            <path
              d="M12.5 20.98a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm12 0a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm12 0a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"
              fill="#293D93"
            />
          </svg>
          <p className="mt-2 text-center font-medium">เพิ่มเติม</p>
        </Link>
      )}
    </div>
  );
};

export default CategoryList;
