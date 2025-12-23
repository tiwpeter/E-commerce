// OrderDetails.model.ts
export interface OrderItem {
  product_name: string;
  product_quantity: number;
  product_price: number;
}

export interface Order {
  order_id: string;
  created_at: string;
  payment_method: string;
  user_email: string;
  phone: string;
  items: OrderItem[];
}
