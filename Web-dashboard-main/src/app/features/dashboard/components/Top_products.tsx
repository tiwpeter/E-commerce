"use client";
import { useEffect, useState } from "react";

// Type ของ Product
interface Product {
  product_name: string;
  total_sales: number;
  total_quantity: number;
}

// Mock data สำหรับ Top_products
const mockTopSellingProducts: Product[] = [
  {
    product_name: "Smartphone X1",
    total_sales: 25000,
    total_quantity: 50,
  },
];

export default function Top_products() {
  const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([]);

  useEffect(() => {
    // ใช้ mock data แทนการเรียก API
    setTopSellingProducts(mockTopSellingProducts);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-purple-600 text-lg font-bold mb-4 text-center">
        Top Selling Products
      </h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 p-2 text-purple-600">Product</th>
            <th className="border-b-2 p-2 text-purple-600">Order ID</th>
            <th className="border-b-2 p-2 text-purple-600">Price</th>
            <th className="border-b-2 p-2 text-purple-600">In Stock</th>
            <th className="border-b-2 p-2 text-purple-600">Units Sold</th>
          </tr>
        </thead>
        <tbody>
          {topSellingProducts.map((product, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 text-gray-700 font-medium">
                {product.product_name}
              </td>
              <td className="p-2 text-gray-800">Order {index + 1}</td>
              <td className="p-2 text-green-600 font-semibold">
                ${product.total_sales.toLocaleString()}
              </td>
              <td className="p-2 text-gray-500">N/A</td>
              <td className="p-2 text-blue-600 font-semibold">
                {product.total_quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
