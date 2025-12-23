"use client";

import React from "react";
import { flexRender } from "@tanstack/react-table";
import { useCategoriesViewModel } from "../useCategoriesViewModel";
import { ChevronDown, ChevronRight, Edit, Trash } from "lucide-react";

export default function CategoriesTable({ search }: { search: string }) {
  const { categories_table, expanded } = useCategoriesViewModel(search);

  return (
    <div>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-50">
          {categories_table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header, index) => (
                <th
                  key={header.id}
                  className={`p-3 border-b ${
                    index === 3 ? "text-center" : "text-left"
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {categories_table.getRowModel().rows.map((row) => {
            const cat = row.original;

            return (
              <React.Fragment key={cat.id}>
                {/* ⭐ main row */}
                <tr className="border-t">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 border-b">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>

                {/* ⭐ expanded subcategory row */}
                {expanded[cat.id] && (
                  <tr className="bg-gray-50">
                    <td
                      colSpan={categories_table.getAllColumns().length}
                      className="p-3"
                    >
                      <div className="mb-2 font-medium">หมวดย่อย</div>
                      {(cat.subcategories || []).map((sub) => (
                        <div
                          key={sub.id}
                          className="flex justify-between p-2 border rounded mb-2"
                        >
                          <div>
                            <div className="font-semibold">{sub.name}</div>
                            <div className="text-xs text-gray-600">
                              slug: {sub.slug} • สินค้า {sub.productCount} ชิ้น
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button className="text-blue-500">
                              {" "}
                              <Edit size={16} />
                            </button>

                            <button className="text-red-500">
                              {" "}
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {(!cat.subcategories ||
                        cat.subcategories.length === 0) && (
                        <div className="text-gray-500">ยังไม่มีหมวดย่อย</div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
