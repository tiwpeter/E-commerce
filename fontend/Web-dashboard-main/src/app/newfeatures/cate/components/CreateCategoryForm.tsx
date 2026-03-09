"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: number;
  name: string;
}

interface AddCategoryFormProps {
  onSuccess?: () => void;
}

export default function AddCategoryForm({ onSuccess }: AddCategoryFormProps) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentId, setParentId] = useState<string>(""); // ถ้าเลือก → SubCategory
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // fetch Categories หลัก สำหรับ dropdown
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!name) return;

    // ถ้า parentId มีค่า → SubCategory
    const url = parentId ? "/api/subcategories" : "/api/categories";

    const body: any = { name };
    if (parentId) body.categoryId = Number(parentId);

    const formData = new FormData();
    formData.append("name", name);
    if (parentId) formData.append("categoryId", parentId);
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setName("");
      setParentId("");
      setImageFile(null);
      setImagePreview("");
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Add Category</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Category / SubCategory</DialogTitle>
          <DialogDescription>
            Enter a name and optionally upload a category image. Select a parent
            to create a subcategory.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Dropdown เลือก Category หลัก (ถ้าเลือก → SubCategory) */}
          <Select value={parentId} onValueChange={setParentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Main Category (optional)" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Main Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 rounded"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border mt-2"
              />
            )}
          </div>

          <Button onClick={handleSubmit} className="mt-2">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
