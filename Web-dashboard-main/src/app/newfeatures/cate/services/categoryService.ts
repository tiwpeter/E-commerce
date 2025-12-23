import { Category } from "../../../types/category";

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
export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  return fetch("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
}
