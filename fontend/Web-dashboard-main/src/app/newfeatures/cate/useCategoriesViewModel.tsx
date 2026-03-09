"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Edit, Trash } from "lucide-react";

// ---------------------------
// Types
// ---------------------------
export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  media?: string;
  subcategories?: SubCategory[];
}

// ---------------------------
// Mock Categories
// ---------------------------
const mockCategories: Category[] = [
  {
    id: "1",
    name: "อุปกรณ์อิเล็กทรอนิกส์",
    slug: "/electronics",
    description: "อุปกรณ์และสินค้าอิเล็กทรอนิกส์",
    media:
      "https://down-th.img.susercontent.com/file/f06f0abdf6bb5a65fdc6edf73101b820@resize_w320_nl.webp",
    subcategories: [
      { id: "1-1", name: "มือถือ", slug: "/mobile", productCount: 120 },
      { id: "1-2", name: "แท็บเล็ต", slug: "/tablet", productCount: 34 },
      { id: "1-3", name: "โน้ตบุ๊ก", slug: "/laptop", productCount: 58 },
    ],
  },
  {
    id: "2",
    name: "เครื่องใช้ไฟฟ้าในบ้าน",
    slug: "/home-appliance",
    description: "อุปกรณ์ไฟฟ้าในบ้าน",
    media:
      "https://down-th.img.susercontent.com/file/sg-11134201-7rbn1-lt4y4c1uq8fx5f",
    subcategories: [
      { id: "2-1", name: "พัดลม", slug: "/fan", productCount: 41 },
      { id: "2-2", name: "เครื่องซักผ้า", slug: "/washer", productCount: 12 },
    ],
  },
];

// ---------------------------
// ViewModel
// ---------------------------
export function useCategoriesViewModel(search: string) {
  const [categories_data, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Load mock data
  useEffect(() => {
    setCategories(mockCategories);
  }, []);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleDeleteCategory = (id: string) => {
    if (!confirm("ลบหมวดหมู่?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const openEdit = (cat: Category) => alert("แก้ไข: " + cat.name);

  // ---------------------------
  // Filtering !!
  // ---------------------------
  const filtered = useMemo(() => {
    return categories_data.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories_data, search]);

  // ---------------------------
  // Table Columns
  // ---------------------------
  const columns = useMemo<ColumnDef<Category>[]>(() => {
    return [
      {
        id: "categoryGroup",
        header: "Category",
        cell: ({ row }) => {
          const cat = row.original;
          return (
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleExpand(cat.id)}
                className="mt-1 text-sm"
              >
                {expanded[cat.id] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              <div>
                <div className="font-semibold">{cat.name}</div>
                <div className="text-xs text-gray-500">{cat.slug}</div>
              </div>
            </div>
          );
        },
      },

      { accessorKey: "description", header: "Description" },

      {
        id: "media",
        header: "Image",
        cell: ({ row }) => {
          const cat = row.original;
          return cat.media ? (
            <img
              src={cat.media}
              alt={cat.name}
              className="w-12 h-12 rounded object-cover border"
            />
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          );
        },
      },

      {
        id: "subCount",
        header: "Subcategories",
        cell: ({ row }) => {
          const cat = row.original;
          return (
            <div className="text-center">
              {cat.subcategories ? cat.subcategories.length : 0}
            </div>
          );
        },
      },

      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const cat = row.original;
          return (
            <div className="">
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => openEdit(cat)}
              >
                <Edit size={16} />
              </button>

              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => handleDeleteCategory(cat.id)}
              >
                <Trash size={16} />
              </button>
            </div>
          );
        },
      },
    ];
  }, [expanded]);

  // ---------------------------
  // Tanstack Table Instance
  // ---------------------------
  const categories_table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      expanded,
      toggleExpand,
      handleDeleteCategory,
      openEdit,
    },
  });

  return {
    categories_table,
    expanded,
    categories_data,
    filtered,
    toggleExpand,
  };
}

/*
table → instance ของ Tanstack Table

expanded → object เก็บสถานะขยายของแต่ละ row

toggleExpand(id) → toggle ขยาย/ย่อ row
*/
