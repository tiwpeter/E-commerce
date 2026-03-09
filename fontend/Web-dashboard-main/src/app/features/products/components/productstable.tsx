"use client";
import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { useProductsTableViewModel } from "../viewModel/useProductsTableViewModel";

export default function Productstable({ search }: { search: string }) {
  const { products_table, columns, error, filtered } =
    useProductsTableViewModel(search);

  if (error)
    return (
      <CardContent>
        <p className="text-center py-6 text-red-500">Error: {error}</p>
      </CardContent>
    );

  return (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              {products_table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium ${
                        header.column.id === "actions"
                          ? "text-center"
                          : "text-left"
                      }`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={header.column.getToggleSortingHandler()}
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center gap-2"
                              : ""
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted()
                            ? header.column.getIsSorted() === "desc"
                              ? " ↓"
                              : " ↑"
                            : null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-2 md:px-4 py-6 text-center text-xs md:text-sm text-slate-500"
                  >
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                products_table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="odd:bg-white even:bg-slate-50">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm align-middle"
                      >
                        {cell.column.id === "image" ? (
                          <img
                            src={cell.getValue<string>()}
                            alt="product"
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : cell.column.id === "name" ? (
                          <span className="block max-w-xs truncate">
                            {cell.getValue<string>()}
                          </span>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
