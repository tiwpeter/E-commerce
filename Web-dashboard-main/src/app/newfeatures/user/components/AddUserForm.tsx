"use client";

import { useState } from "react";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AddUserForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // เพิ่ม role
  });

  const roles = ["admin", "user", "manager"]; // ตัวอย่าง role

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setForm({ ...form, role: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log("User created:", payload);
        setForm({ name: "", email: "", password: "", role: "" });
        alert("User created successfully!");
      } else {
        const errorData = await res.json();
        console.error("Failed to create user:", errorData);
        alert("Failed to create user");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer border bg-gray-200 w-[115px] h-[25px] flex items-center justify-center mt-[0.3rem] ml-4">
          <span className="text-sm font-medium">+ Add User</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Input
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <Select value={form.role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="mt-2" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
