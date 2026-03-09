import { Category } from "@/app/types/category";

export async function getCategories(): Promise<Category[]> {
  return fetch("/api/categories").then((res) => res.json());
}

export async function deleteCategory(id: string) {
  return fetch(`/api/categories/${id}`, { method: "DELETE" });
}

export async function deleteSubCategory(catId: string, subId: string) {
  return fetch(`/api/categories/${catId}/subcategories/${subId}`, {
    method: "DELETE",
  });
}