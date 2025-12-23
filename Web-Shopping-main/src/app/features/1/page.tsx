// src/app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Banner from "./compo/Banner";
import CategoryList from "./compo/CategoryList";
import ProductList from "./compo/ProductCard";
import { categories } from "@/app/data/mockData";
import { Product } from "@/lib/model";
import { fetchAllProducts } from "../produts/[id]/service/mockdetail";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const fetchedProducts = await fetchAllProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    };
    getProducts();
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        color: "#333",
      }}
    >
      <Banner />

      <section
        style={{
          width: "100%",
          maxWidth: "1392px",
          margin: "40px auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.2rem", marginBottom: "20px" }}>
          หมวดหมู่ยอดนิยม
        </h2>

        <CategoryList categories={categories} />

        <h3
          style={{
            fontSize: "2rem",
            marginTop: "30px",
            fontWeight: "bold",
            color: "#003366",
          }}
        >
          ประกาศล่าสุดในหมวดหมู่มือถือ แท็บเล็ต
        </h3>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <ProductList products={products} />
        )}
      </section>
    </div>
  );
};

export default Home;
