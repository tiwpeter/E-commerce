"use client";

import React, { useState } from "react";
import { flexRender } from "@tanstack/react-table";
import { useCategoriesViewModel } from "./useCategoriesViewModel";
import {
  Plus,
  Edit,
  Trash,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import CreateCategoryForm from "./components/CreateCategoryForm";
import SearchBox from "./components/SearchBox";
import CategoriesTable from "./components/CategoriesTable";
import AddCategoryForm from "./components/CreateCategoryForm";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="mt-[170px] flex-none w-full max-w-full px-3">
      <div className="relative flex flex-col bg-white mt-[-9rem] p-4">
        <h1 className="text-2xl font-bold mb-4">Category</h1>

        <div className="flex justify-between ">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search category or subcategory..."
          />
          <CreateCategoryForm />
        </div>
        <div>
          <CategoriesTable search={search} />
        </div>
      </div>
    </div>
  );
}
