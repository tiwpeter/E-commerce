// src/compo/ProductCard.tsx
"use client";
import Link from "next/link";
import React from "react";
import { Product } from "@/lib/model";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <Link href={`/features/produts/${product.id}`} passHref>
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        gridAutoRows: "1fr",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={product.images[0]}
        alt={product.title}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "10px",
          marginBottom: "15px",
        }}
      />
      <h3
        style={{
          fontSize: "1.25rem",
          marginBottom: "8px",
          fontWeight: "600",
          height: "60px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {product.title}
      </h3>
      <p
        style={{
          fontSize: "1.1rem",
          color: "#ff6200",
          fontWeight: "500",
        }}
      >
        ฿ {product.price}
      </p>
    </div>
  </Link>
);

interface ProductListProps {
  products: Product[];
  maxDisplay?: number; // เพิ่ม optional prop สำหรับจำนวนสูงสุด
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  maxDisplay = 12,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: "10px",
      marginTop: "40px",
    }}
  >
    {products.slice(0, maxDisplay).map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);

export default ProductList;
