"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBox({
  value,
  onChange,
  placeholder,
}: SearchBoxProps) {
  return (
    <div className="mb-4 w-full md:w-1/3 lex items-center">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="w-full"
      />
    </div>
  );
}
