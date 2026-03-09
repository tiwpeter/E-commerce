import { useState, useMemo, useEffect } from "react";
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
import {
  fetchProducts as serviceFetchProducts,
  createProduct as serviceCreateProduct,
  updateProduct as serviceUpdateProduct,
  deleteProduct as serviceDeleteProduct,
} from "../service/productService";

export type ProductRow = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  createdAt: string;
};

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export function useProductsTableViewModel(search: string) {
  const [product_data, setData] = useState<ProductRow[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      const products = await serviceFetchProducts();
      setData(products);
    } catch (err: any) {
      console.error(err);
      setData([]);
      setError(err.message || "Failed to fetch products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // -------- FILTER HERE ---------
  const filtered = useMemo(() => {
    return product_data.filter((p) =>
      (p.name + p.category).toLowerCase().includes(search.toLowerCase())
    );
  }, [product_data, search]);

  // Upload to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error("Cloudinary config missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url as string;
  };

  const createProduct = async (product: Partial<ProductRow>, file?: File) => {
    let imageUrl = "";
    if (file) imageUrl = await uploadToCloudinary(file);
    const newProduct = await serviceCreateProduct({
      ...product,
      image: imageUrl,
    });
    await loadProducts();
    return newProduct;
  };

  const updateProduct = async (
    id: string,
    product: Partial<ProductRow>,
    file?: File
  ) => {
    let imageUrl = product.image || "";
    if (file) imageUrl = await uploadToCloudinary(file);
    const updated = await serviceUpdateProduct(id, {
      ...product,
      image: imageUrl,
    });
    await loadProducts();
    return updated;
  };

  const deleteProduct = async (id: string) => {
    await serviceDeleteProduct(id);
    await loadProducts();
  };

  const columns = useMemo<ColumnDef<ProductRow, any>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        cell: (info) => (
          <img
            src={info.getValue<string>()}
            alt=""
            className="w-14 h-14 rounded object-cover"
          />
        ),
        enableSorting: false,
      },
      { accessorKey: "name", header: "Product Name" },
      { accessorKey: "price", header: "Price (THB)" },
      { accessorKey: "stock", header: "Stock" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "createdAt", header: "Created At" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button variant="ghost">
              <SquarePen />
            </Button>
            <Button
              variant="ghost"
              onClick={() => deleteProduct(row.original.id)}
            >
              <Trash2 />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const products_table = useReactTable({
    data: filtered, // 👈 ใช้ filtered โดยตรง
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return {
    products_table,
    columns,
    filtered,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    product_data,
  };
}
