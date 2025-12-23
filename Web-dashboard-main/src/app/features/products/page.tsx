"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddProductForm from "./components/AddProductForm";
import Productstable from "./components/productstable";
import SearchBox from "./components/SearchBox";
import { createProduct } from "./service/productService";

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <div className="mt-[170px] flex-none w-full max-w-full px-3">
      <div className="relative flex flex-col bg-white mt-[-9rem] p-4">
        <h1 className="text-2xl font-bold mb-4">All Products</h1>

        <div className="flex justify-between ">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
          />

          <AddProductForm onCreated={createProduct} />
        </div>

        <Productstable search={search} />
      </div>
    </div>
  );
}
