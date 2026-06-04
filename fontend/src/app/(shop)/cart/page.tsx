"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { useCart } from "@/app/context/cart-context";
import { CartItemRow } from "@/app/(shop)/features/cart/components/cart-item-row";
import { ProtectedRoute } from "@/app/(auth)/components/protected-route";

function CartContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart, summary, isLoading, clearCart } = useCart();

  const items = cart?.items ?? [];
  const isEmpty = !isLoading && items.length === 0;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <main className="cart-page">
      {/* ── Nav ── */}
      <nav className="top-nav">
        <div className="nav-logo">⬡ Shop</div>
        <div className="nav-right">
          <span className="user-pill">{user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="cart-body">
        <div className="page-header">
          <h1 className="page-title">
            ตะกร้าสินค้า
            {summary?.itemCount != null && (
              <span className="item-badge">{summary.itemCount}</span>
            )}
          </h1>
          {items.length > 0 && (
            <button className="clear-btn" onClick={clearCart}>
              ล้างตะกร้า
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="state-box">
            <div className="spinner" />
            <p>กำลังโหลด…</p>
          </div>
        )}

        {/* Empty */}
        {isEmpty && (
          <div className="state-box">
            <span className="empty-icon">🛒</span>
            <p>ตะกร้าว่างเปล่า</p>
            <button
              className="shop-btn"
              onClick={() => router.push("/products")}
            >
              เลือกซื้อสินค้า
            </button>
          </div>
        )}

        {/* Items + Summary */}
        {!isLoading && items.length > 0 && (
          <div className="cart-grid">
            {/* Items */}
            <ul className="item-list">
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </ul>

            {/* Summary */}
            <div className="summary-card">
              <h2>สรุปคำสั่งซื้อ</h2>

              <div className="summary-row">
                <span>สินค้า ({summary?.itemCount ?? 0} ชิ้น)</span>
                <span>${summary?.totalPrice?.toFixed(2) ?? "0.00"}</span>
              </div>
              <div className="summary-row">
                <span>ค่าจัดส่ง</span>
                <span className="free">ฟรี</span>
              </div>

              <div className="divider" />

              <div className="summary-row total">
                <span>รวมทั้งหมด</span>
                <span>${summary?.totalPrice?.toFixed(2) ?? "0.00"}</span>
              </div>

              <button className="checkout-btn">
                ดำเนินการชำระเงิน
              </button>
              <div className="secure-badge">🔒 ชำระเงินปลอดภัย</div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* ── Page ── */
        .cart-page {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e8e8f0;
          font-family: "DM Sans", system-ui, sans-serif;
        }

        /* ── Nav ── */
        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          border-bottom: 1px solid #1e1e2e;
          background: #111118;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .nav-logo {
          font-size: 1.25rem;
          font-weight: 700;
          color: #6366f1;
          letter-spacing: -0.02em;
        }
        .nav-right { display: flex; align-items: center; gap: 0.75rem; }
        .user-pill {
          background: #1a1a28;
          border: 1px solid #2a2a40;
          border-radius: 999px;
          padding: 0.3rem 0.85rem;
          font-size: 0.8rem;
          color: #9090aa;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .logout-btn {
          background: transparent;
          border: 1px solid #2a2a40;
          border-radius: 0.5rem;
          color: #9090aa;
          padding: 0.35rem 0.85rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .logout-btn:hover { color: #f87171; border-color: rgba(248,113,113,0.4); }

        /* ── Body ── */
        .cart-body {
          max-width: 960px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
        }
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        .page-title {
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .item-badge {
          font-size: 0.85rem;
          font-weight: 600;
          background: #6366f1;
          color: #fff;
          border-radius: 999px;
          padding: 0.1rem 0.6rem;
        }
        .clear-btn {
          background: transparent;
          border: 1px solid #2a2a40;
          border-radius: 0.5rem;
          color: #6b6b85;
          font-size: 0.8rem;
          padding: 0.35rem 0.85rem;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .clear-btn:hover { color: #f87171; border-color: rgba(248,113,113,0.4); }

        /* ── State boxes ── */
        .state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 4rem 2rem;
          color: #6b6b85;
        }
        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #1e1e2e;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .empty-icon { font-size: 3rem; }
        .state-box p { font-size: 1rem; margin: 0; }
        .shop-btn {
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 0.6rem;
          padding: 0.7rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .shop-btn:hover { background: #4f52e0; }

        /* ── Grid ── */
        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 700px) {
          .cart-grid { grid-template-columns: 1fr; }
        }

        /* ── Item list ── */
        .item-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* ── Summary ── */
        .summary-card {
          background: #111118;
          border: 1px solid #1e1e2e;
          border-radius: 0.9rem;
          padding: 1.5rem;
          position: sticky;
          top: 80px;
        }
        .summary-card h2 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1.25rem;
          color: #c8c8e0;
          letter-spacing: -0.01em;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #8080a0;
          margin-bottom: 0.65rem;
        }
        .summary-row.total {
          font-size: 1rem;
          font-weight: 700;
          color: #e8e8f0;
          margin-top: 0.25rem;
        }
        .free { color: #4ade80; }
        .divider { height: 1px; background: #1e1e2e; margin: 0.9rem 0; }
        .checkout-btn {
          width: 100%;
          margin-top: 1.25rem;
          padding: 0.85rem;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 0.6rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .checkout-btn:hover { background: #4f52e0; }
        .secure-badge {
          text-align: center;
          margin-top: 0.85rem;
          font-size: 0.78rem;
          color: #5a5a75;
        }
      `}</style>
    </main>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}