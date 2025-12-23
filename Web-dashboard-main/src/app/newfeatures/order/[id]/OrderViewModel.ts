"use client";

import { useState, useEffect } from "react";
import { getOrderById, fetchOrders, Order } from "../service/orderService";

export function useOrderViewModel(id?: string | string[]) {
  const [order, setOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch single order by ID
  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Fetch all orders
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const totalPrice =
    order?.items.reduce(
      (total, item) => total + item.product_quantity * item.product_price,
      0
    ) || 0;

  const shippingCost = 20.0;
  const taxRate = 0.1;
  const taxAmount = totalPrice * taxRate;
  const finalTotal = totalPrice + shippingCost + taxAmount;

  return { order, orders, loading, error, totalPrice, shippingCost, taxAmount, finalTotal };
}
