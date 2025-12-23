"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHeader } from "@/components/ui/card";

type TableHeaderProps = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
};

export function TableHeader({ value, onChange, onReset }: TableHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
            <Input
              placeholder="ค้นหา ชื่อ / อีเมล / บทบาท..."
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </CardHeader>
  );
}
