"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatar?: string;
}

export function useUserTableViewModel() {
  const [data, setData] = useState<UserRow[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const users: UserRow[] = await res.json();
        setData(
          users.map((u) => ({
            ...u,
            avatar: `https://i.pravatar.cc/150?u=${u.id}`, // เพิ่ม avatar ตัวอย่าง
            createdAt: new Date(u.createdAt).toLocaleDateString(),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    }
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const columns = useMemo<ColumnDef<UserRow, any>[]>(
    () => [
      {
        accessorKey: "avatar",
        header: "Avatar",
        cell: (info) => (
          <img
            src={info.getValue<string>()}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => (
          <span className="px-2 py-1 rounded-full text-xs bg-slate-100">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button variant="ghost" className="text-yellow-500">
                <SquarePen className="!w-4.5 !h-4.5" />
              </Button>
              <Button
                variant="ghost"
                className="text-red-400"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="!w-4.5 !h-4.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  // ... ข้างบนเหมือนเดิม

  const user_table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return { user_table, columns, data };
}
