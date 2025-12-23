import React from "react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onBuy: () => void;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  onBuy,
}) => {
  if (!isOpen) return null; // ไม่แสดง modal ถ้า isOpen = false

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        {/* ปุ่มปิด */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">🛒 ตะกร้าสินค้า</h2>

        {cart.length > 0 ? (
          <ul className="divide-y divide-gray-200 mb-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="py-2 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    จำนวน: {item.quantity}
                  </p>
                </div>
                <span className="text-orange-500 font-semibold">
                  ฿{item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">ตะกร้าของคุณยังว่างอยู่</p>
        )}

        <div className="flex justify-between font-bold mb-4">
          <span>รวมทั้งหมด:</span>
          <span>฿{totalPrice}</span>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            ปิด
          </button>
          {cart.length > 0 && (
            <button
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              onClick={onBuy}
            >
              ซื้อสินค้า
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
