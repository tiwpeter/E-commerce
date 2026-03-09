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
import { ProductRow } from "../viewModel/useProductsTableViewModel";

type AddProductFormProps = {
  onCreated: (product: Partial<ProductRow>) => void;
};

export default function AddProductForm({ onCreated }: AddProductFormProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setForm({ ...form, categoryId: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    let imageUrl = "";
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      imageUrl = data.url;
      setUploading(false);
    }

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category:
        categories.find((c) => c.id.toString() === form.categoryId)?.name ?? "",
      image: imageUrl,
    };

    await onCreated(payload);

    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
    });
    setFile(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Add Product</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Fill details to add a product.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          <Input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
          />

          <Select value={form.categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input type="file" onChange={handleFileChange} />
          {uploading && <p>Uploading...</p>}

          <Button onClick={handleSubmit} disabled={uploading}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
