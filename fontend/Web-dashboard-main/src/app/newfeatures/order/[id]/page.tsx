"use client";

import { useParams } from "next/navigation";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
import { useOrderViewModel } from "./OrderViewModel";

// --------- helper functions ---------
const detectCardType = (cardNumber: string) => {
  const cleaned = cardNumber.replace(/-/g, "");
  if (/^4[0-9]{12,15}$/.test(cleaned)) return "Visa Card";
  if (/^(5[1-5][0-9]{14}|2[2-7][0-9]{14})$/.test(cleaned)) return "MasterCard";
  if (/^3[47][0-9]{13}$/.test(cleaned)) return "American Express";
  if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cleaned)) return "Discover";
  return "Unknown";
};

const censorCardNumber = (cardNumber?: string) => {
  if (!cardNumber) return "**** **** **** ****";
  return `**** **** **** ${cardNumber.slice(-4)}`;
};

const getCardImage = (cardType: string) => {
  switch (cardType) {
    case "Visa Card":
      return "/card-logos/VISA.png";
    case "MasterCard":
      return "/card-logos/mastercard.png";
    case "American Express":
      return "/card-logos/amex.png";
    case "Discover":
      return "/card-logos/discover.png";
    default:
      return "/card-logos/unknown.png";
  }
};

// --------- view ---------
export default function OrderDetailsPage() {
  const { id } = useParams();
  const {
    order,
    orders,
    loading,
    error,
    totalPrice,
    shippingCost,
    taxAmount,
    finalTotal,
  } = useOrderViewModel(id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>No order found.</div>;

  return (
    <div className="mt-[170px] flex-none w-full max-w-full px-3">
      <div className="relative flex flex-col bg-white mt-[-10rem] p-4">
        {/* Header */}
        <div className="flex items-center gap-4 pb-4">
          <div>
            <h1 className="text-2xl font-bold">OrderID: #{order.order_id}</h1>
            <h2 className="text-gray-600">Time: {order.created_at}</h2>
          </div>
          <div className="border w-[80px] h-[25px] flex items-center justify-center rounded ml-4">
            <span className="text-sm text-yellow-500">Pending</span>
          </div>
        </div>

        <hr className="my-2 border-gray-300" />

        {/* Payment + Note */}
        <div className="flex space-x-6">
          {/* Payment */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-700">
              Payment Method
            </h3>
            <div className="border border-gray-300 p-4 rounded-lg shadow-sm mt-2">
              {order.payment_method && (
                <div className="flex items-center mb-2">
                  <img
                    src={getCardImage(detectCardType(order.payment_method))}
                    alt={detectCardType(order.payment_method)}
                    className="w-10 h-6 mr-2"
                  />
                  <p className="text-sm text-gray-600">
                    {detectCardType(order.payment_method)}
                  </p>
                  <p className="ml-2 text-sm text-gray-600">
                    {censorCardNumber(order.payment_method)}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500">
                Email: <span className="font-semibold">{order.user_email}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Phone:{" "}
                <span className="font-semibold">(+66) {order.phone}</span>
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-700">Note</h3>
            <div className="border border-gray-300 p-14 rounded-lg shadow-sm mt-2">
              {/* Note content here */}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Order Items</h2>
          <table className="min-w-full mt-4 border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Product Name</th>
                <th className="border px-4 py-2 text-left">Quantity</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{item.product_name}</td>
                  <td className="border px-4 py-2">{item.product_quantity}</td>
                  <td className="border px-4 py-2">${item.product_price}</td>
                  <td className="border px-4 py-2">
                    ${(item.product_quantity * item.product_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-semibold">Sales Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
