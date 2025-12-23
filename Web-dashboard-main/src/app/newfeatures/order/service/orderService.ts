export type OrderItem = {
  order_item_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  product_quantity: number;
};

export type Order = {
  order_id: number;
  user_email: string;
  total_price: number;
  shipping_address: string;
  phone: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
};

// Fetch order by ID
export async function getOrderById(id: string | string[]): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch order");
  }

  return data;
}

// Fetch all orders
export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders");
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  return res.json();
}
