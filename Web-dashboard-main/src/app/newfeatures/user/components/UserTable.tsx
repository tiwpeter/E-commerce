import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import { CardContent } from "@/components/ui/card";
import { useUserTableViewModel, UserRow } from "../viewModel/useUsersViewModel";

interface UserTableProps {
  search: string;
}

export default function UserTable({ search }: UserTableProps) {
  const { user_table, columns, data } = useUserTableViewModel();

  // 🔍 Filter ก่อน render
  const filteredData = data.filter((user: UserRow) =>
    (user.name + user.email + user.role)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // set data เข้า table
  user_table.setOptions((prev) => ({
    ...prev,
    data: filteredData,
  }));

  return (
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-slate-50 sticky top-0">
            {user_table.getHeaderGroups().map((hg) => (
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
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center gap-2"
                            : "",
                        }}
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
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-2 md:px-4 py-6 text-center text-xs md:text-sm text-slate-500"
                >
                  No data
                </td>
              </tr>
            ) : (
              user_table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="odd:bg-white even:bg-slate-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
  );
}
