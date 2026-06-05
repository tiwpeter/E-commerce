"use client";

import { useState } from "react";
import type { CartItem } from "@/api/generated";
import { useCart } from "@/store/cart";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQty, removeItem } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleQty(newQty: number) {
    if (newQty < 0) return;
    setLoading(true);
    try {
      if (newQty === 0) {
        await removeItem(item.productId);
      } else {
        await updateQty(item.productId, newQty);
      }
    } finally {
      setLoading(false);
    }
  }

  const subtotal = (item.price * item.quantity).toFixed(2);

  return (
    <li className={`cart-row ${loading ? "cart-row--loading" : ""}`}>
      {/* Thumbnail */}
      <div className="row-thumb">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.name} />
        ) : (
          <span className="row-thumb-placeholder">๐๏ธ</span>
        )}
      </div>

      {/* Info */}
      <div className="row-info">
        <p className="row-name">{item.name}</p>
        {item.variantLabel && (
          <p className="row-variant">{item.variantLabel}</p>
        )}
        <p className="row-unit-price">${item.price.toFixed(2)} / เธเธดเนเธ</p>
      </div>

      {/* Qty controls */}
      <div className="row-qty">
        <button
          className="qty-btn"
          onClick={() => handleQty(item.quantity - 1)}
          disabled={loading}
          aria-label="เธฅเธ”"
        >
          โ’
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => handleQty(item.quantity + 1)}
          disabled={loading}
          aria-label="เน€เธเธดเนเธก"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <p className="row-subtotal">${subtotal}</p>

      {/* Remove */}
      <button
        className="row-remove"
        onClick={() => handleQty(0)}
        disabled={loading}
        aria-label="เธฅเธเธชเธดเธเธเนเธฒ"
      >
        โ•
      </button>

      <style jsx>{`
        .cart-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: #111118;
          border: 1px solid #1e1e2e;
          border-radius: 0.9rem;
          transition: opacity 0.2s, border-color 0.2s;
        }
        .cart-row--loading { opacity: 0.5; pointer-events: none; }
        .cart-row:hover { border-color: #2e2e48; }

        /* Thumb */
        .row-thumb {
          width: 60px;
          height: 60px;
          border-radius: 0.5rem;
          overflow: hidden;
          background: #1a1a28;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .row-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .row-thumb-placeholder { font-size: 1.75rem; }

        /* Info */
        .row-info { flex: 1; min-width: 0; }
        .row-name {
          font-size: 0.92rem;
          font-weight: 500;
          color: #e0e0f0;
          margin: 0 0 0.2rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .row-variant {
          font-size: 0.75rem;
          color: #6b6b85;
          margin: 0 0 0.2rem;
        }
        .row-unit-price { font-size: 0.78rem; color: #6b6b85; margin: 0; }

        /* Qty */
        .row-qty {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #0d0d16;
          border: 1px solid #1e1e2e;
          border-radius: 0.5rem;
          padding: 0.2rem 0.4rem;
        }
        .qty-btn {
          width: 26px;
          height: 26px;
          background: transparent;
          border: none;
          color: #9090aa;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 0.3rem;
          transition: background 0.15s, color 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qty-btn:hover:not(:disabled) { background: #1e1e2e; color: #e0e0f0; }
        .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .qty-value {
          min-width: 1.5rem;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 600;
          color: #e0e0f0;
        }

        /* Subtotal */
        .row-subtotal {
          font-size: 0.95rem;
          font-weight: 600;
          color: #a5b4fc;
          margin: 0;
          min-width: 60px;
          text-align: right;
        }

        /* Remove */
        .row-remove {
          background: transparent;
          border: none;
          color: #3a3a55;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0.3rem;
          border-radius: 0.3rem;
          transition: color 0.15s;
          flex-shrink: 0;
        }
        .row-remove:hover:not(:disabled) { color: #f87171; }
        .row-remove:disabled { opacity: 0.3; cursor: not-allowed; }
      `}</style>
    </li>
  );
}
