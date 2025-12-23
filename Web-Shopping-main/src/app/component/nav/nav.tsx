"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation"; // นำเข้า useRouter จาก next/router
import Image from "next/image";

import "./nav.css";

const Nav = () => {
  const router = useRouter(); // ใช้ useRouter จาก next/router

  // ฟังก์ชันสำหรับการไปที่หน้า CartPage
  const goToCart = () => {
    router.push("/pages/Cart"); // นำทางไปที่หน้า /cart
  };

  return (
    <nav>
      <section className="space">
        <div className="header-container">
          <div className=" w-[1200px] flex">
            {/* */}
            <div className="shopkun">
              <div className="logo-text">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7KtN6V_VWlz0z6ksWMhA-ym3KjX2fa2b26bPSpt3rMM-kaB8TPJW_4RaPpDVdrC_6xoU&usqp=CAU"
                  alt="ShopKun Logo"
                  className="image-border"
                />
                <div className="ml-4">
                  <img
                    src="/shopkum.png"
                    alt="ShopKun Logo"
                    className="shop-text"
                  />
                </div>
              </div>
            </div>

            <div className="search-bar">
              <input type="text" placeholder="ค้นหาสินค้า..." />
              <button className="search-button">
                <img
                  className="search-icon"
                  src="data:image/svg+xml;charset=utf-8,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M695.467 622.933h-38.4l-12.8-12.8c46.933-55.466 76.8-128 76.8-204.8 0-174.933-140.8-315.733-315.734-315.733s-320 136.533-320 311.467S226.133 716.8 401.067 716.8c76.8 0 149.333-29.867 204.8-76.8l12.8 12.8v38.4l243.2 243.2 72.533-72.533-238.933-238.934zm-294.4 0c-119.467 0-217.6-98.133-217.6-217.6s98.133-217.6 217.6-217.6 217.6 98.134 217.6 217.6c4.266 119.467-93.867 217.6-217.6 217.6z' fill='%23FFF'/%3E%3C/svg%3E"
                  alt="Search icon"
                />
              </button>
            </div>

            {/* ไอคอนตะกร้า */}
            <div className="cart-icon flex items-center" onClick={goToCart}>
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {/* แสดงจำนวนสินค้าที่อยู่ในตะกร้า */}
            </div>
          </div>
        </div>
      </section>
    </nav>
  );
};

export default Nav;
