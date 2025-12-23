import { ProductRow } from "../viewModel/useProductsTableViewModel";

export async function fetchProducts(): Promise<ProductRow[]> {
  const res = await fetch("http://localhost:3000/api/Product", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
}

export async function createProduct(product: Partial<ProductRow>) {
  const res = await fetch("http://localhost:3000/api/Product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id: string, product: Partial<ProductRow>) {
  const res = await fetch(`http://localhost:3000/api/Product/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`http://localhost:3000/api/Product/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete product");
}
