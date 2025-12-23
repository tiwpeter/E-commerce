"use client";
import { useCart } from "@/app/context/CartContext";
import StepNavigation from "./componet/Step_Navigation";

export default function CartPage() {
  const { cart, addToCart, clearCart } = useCart();

  // คำนวณราคาสุทธิ
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );
  const vat = 68;
  const total = subtotal + vat;

  // เพิ่ม/ลดจำนวนสินค้า
  const updateQuantity = (id: string, delta: number) => {
    const item = cart.find((p) => p.id === id);
    if (!item) return;

    // addToCart({ ...item }, delta); // ปรับ delta ใน context
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <StepNavigation currentStep={1} />
      {/* Products list */}
      <div className="flex justify-between space-x-6">
        {/* Products list */}
        <div className="flex-1 space-y-6">
          {cart.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-24 h-24 object-contain"
                />
                <div>
                  <p className="font-semibold text-sm">{product.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  className="px-3 py-1 border border-gray-300 rounded"
                  onClick={() => updateQuantity(product.id, -1)}
                >
                  -
                </button>
                <span>{product.quantity || 1}</span>
                <button
                  className="px-3 py-1 border border-gray-300 rounded"
                  onClick={() => updateQuantity(product.id, 1)}
                >
                  +
                </button>
                <button
                  className="ml-6 text-gray-500 hover:text-red-600"
                  // onClick={() => removeFromCart(product.id)}
                  aria-label="Remove item"
                >
                  🗑️
                </button>
                <span className="w-20 text-right font-semibold">
                  ฿{Number(product.price) * (product.quantity || 1)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="w-72 bg-blue-900 text-white p-6 rounded-lg">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>฿{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>V.A.T</span>
            <span>฿{vat.toFixed(2)}</span>
          </div>
          <div className="mb-4">
            <label htmlFor="coupon" className="block mb-1">
              Add a coupon
            </label>
            <div className="flex">
              <input
                id="coupon"
                type="text"
                placeholder="Enter your code"
                className="flex-grow p-2 rounded-l bg-blue-800 border border-blue-700 focus:outline-none"
              />
              <button className="bg-blue-600 px-4 rounded-r hover:bg-blue-700">
                →
              </button>
            </div>
          </div>
          <hr className="border-blue-700 mb-4" />
          <div className="flex justify-between mb-6 font-semibold">
            <span>Total</span>
            <span>฿{total.toFixed(2)}</span>
          </div>
          <button
            onClick={clearCart}
            className="bg-yellow-400 text-black font-semibold w-full py-2 rounded hover:bg-yellow-300"
          >
            Proceed to checkout
          </button>
        </div>
      </div>

      {/* Help and go back */}
      <div className="flex justify-between items-center mt-8 text-sm text-gray-600">
        <p>
          Need help? Check our{" "}
          <a href="#" className="underline">
            help and support
          </a>{" "}
          or{" "}
          <a href="#" className="underline">
            contact us
          </a>
        </p>
        <button className="flex items-center space-x-1 text-gray-600 hover:text-black">
          <span>← Go back to shopping</span>
        </button>
      </div>
    </div>
  );
}
