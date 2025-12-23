"use client";

import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useOrderViewModel } from "./[id]/OrderViewModel";
import Link from "next/link";

// Order type สำหรับ frontend display (สอดคล้องกับ API)
type DisplayOrder = {
  id: string;
  type: "buy" | "sell";
  userName: string;
  timeISO: string;
  asset: string;
  amount: number;
  status: "pending" | "completed";
};

export default function OrdersPage() {
  const { orders, loading, error } = useOrderViewModel();

  const [filter, setFilter] = useState<"all" | "buy" | "sell">("all");

  // แปลง orders จาก API ให้ตรงกับ DisplayOrder
  const displayOrders: DisplayOrder[] = orders.map((o) => ({
    id: String(o.order_id),
    type: o.total_price > 0 ? "buy" : "sell", // ตัวอย่าง logic กำหนด type
    userName: o.user_email,
    timeISO: o.created_at,
    asset: o.items[0]?.product_name || "Unknown",
    amount: o.items[0]?.product_quantity || 0,
    status: "pending", // สามารถปรับตามสถานะจริงจาก API
  }));

  const filtered = useMemo(() => {
    if (filter === "all") return displayOrders;
    return displayOrders.filter((o) => o.type === filter);
  }, [displayOrders, filter]);

  if (loading)
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-8 text-sm text-red-500">
        Error: {error}
      </div>
    );
  if (filtered.length === 0)
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        ไม่มีคำสั่งในขณะนี้
      </div>
    );

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle>Orders</CardTitle>
            <p className="text-sm text-muted-foreground">
              รายการคำสั่งซื้อ-ขาย (แบบไม่เป็นตาราง)
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "buy" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("buy")}
            >
              Buy
            </Button>
            <Button
              variant={filter === "sell" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("sell")}
            >
              Sell
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {filtered.map((o) => (
            <div
              key={o.id}
              className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-slate-200 transition-colors"
            >
              <Avatar className="w-11 h-11">
                <AvatarFallback>{o.userName.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{o.userName}</div>
                    <Badge
                      variant={o.type === "buy" ? "secondary" : "destructive"}
                    >
                      {o.type.toUpperCase()}
                    </Badge>
                    <Badge
                      variant={o.status === "pending" ? "outline" : "default"}
                    >
                      {o.status}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground text-right">
                    <div>
                      {format(new Date(o.timeISO), "yyyy-MM-dd HH:mm:ss")}
                    </div>
                    <div className="text-xs">
                      {o.asset} • {o.amount}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mt-1">
                  คำสั่ง: {o.type === "buy" ? "ซื้อ" : "ขาย"} {o.amount}{" "}
                  {o.asset}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Link href={`/newfeatures/order/${o.id}`}>
                  <Button size="sm" variant="ghost">
                    Details
                  </Button>
                </Link>
                {o.status === "pending" && <Button size="sm">Accept</Button>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
