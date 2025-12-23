// src/components/ProductUi.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useProductViewModel } from "./viewmodel/ProductViewModel";
import "./detail.css";
import Breadcrumb from "./components/Breadcrumb/Breadcrumb";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/model";

interface ProductUiProps {
  id: string;
}
const ProductUi: React.FC<ProductUiProps> = ({ id }) => {
  const {
    product,
    selectedImage,
    selectedPrice,
    selectImage,
    selectPrice,
    cart,
  } = useProductViewModel(id);

  const router = useRouter();
  // mrakbreadcrumb
  const breadcrumbItems = [
    { label: "Lighting & Décor", link: "#" },
    { label: "Décor", link: "#" },
  ];

  const handleOptionClick = (price: number, image?: string) => {
    selectPrice(price); // เปลี่ยนราคา
    if (image) {
      selectImage(image); // เปลี่ยนรูปหลัก
    }
  };

  const { addToCart } = useCart(); // <-- เพิ่มตรงนี้

  const handleBuyToCart = (product: Product) => {
    console.log("Add to Cart clicked:", product); // log สินค้า
    addToCart(product); // เพิ่มสินค้าไปยัง cart
    router.push("/features/ui-cart"); // ไปหน้า cart
  };

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const increaseQuantity = () => setSelectedQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setSelectedQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="faaa">
      <Breadcrumb items={breadcrumbItems} />
      <div className="container-detail">
        <div className="detail-container">
          <div className="box box-small">
            {product.images && product.images.length > 0 ? (
              <div className="fff">
                <img
                  className="product-image"
                  src={selectedImage || product.images[0]} // ใช้ selectedImage ถ้ามีการเลือกภาพ
                  alt={product.title}
                />
              </div>
            ) : (
              <p>No main image available</p>
            )}

            {/* รูปรอง */}
            {product.images && product.images.length > 0 ? (
              <div>
                <div className="boximage2">
                  {product.images.map((image, index) => (
                    <div key={index} className="UBG7wZ">
                      <div
                        className="jA1mTx"
                        onClick={() => selectImage(image)} // เลือกรูปภาพเมื่อคลิก
                      >
                        <div className="YM40Nc">
                          <img
                            className="product-image2"
                            src={image}
                            alt={`Product Thumbnail ${index + 1}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No additional images available</p>
            )}
          </div>
          {/* ส่วนรายละเอียดสินค้า */}
          <div className="box box-large">
            <div>
              <div>
                <span className="LLL">{product.title}</span>
              </div>
              <div className="rate">
                <button className="flex button_under">
                  <div
                    className="undeline color_undeline font_undeline"
                    style={{ height: "20px" }}
                  >
                    4.6
                  </div>
                  <div className="star-rating">
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">☆</span>
                    <span className="star">☆</span>
                  </div>
                </button>
                <button className="flex custom-button">
                  <div
                    className="undeline color_undeline font_undeline"
                    style={{ height: "20px" }}
                  >
                    722K
                  </div>
                  <div className="secod">ratings</div>
                </button>
              </div>
              <div className="flex pr" style={{ marginTop: "10px" }}>
                <div>
                  {/* แสดงราคาที่เลือก (หากไม่มีการเลือก, จะแสดงช่วงราคาตั้งต้น) */}
                  <h1 style={{ color: "#f57224" }}>
                    ฿{selectedPrice !== null ? selectedPrice : "2 - 10"}
                  </h1>
                </div>
                <div className="wssa secod_price">฿15 - ฿30</div>
                <div className="sla">-87%</div>
              </div>
              <div className="detailpirce">
                <div className="flex-colum">
                  <div className="flexsell">
                    <section className="sec">
                      <h3 className="font_comon">การจัดส่ง</h3>
                      <div className="flex"></div>
                      {/* / */}
                      <div className="grid">
                        <div className="car">
                          <img
                            src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/baa823ac1c58392c2031.svg"
                            alt=""
                            className="carimg"
                          />
                        </div>
                        <div className="flex flex-column fwaxw">
                          <div className="flex item-center pllo">
                            <div className="wdkwo">การจัดส่งถึง</div>
                            <div className="flex item-center tesq">
                              <div className="flex item-center">
                                <button className="owdwd">
                                  <span className="awxJLd">
                                    เขตพระนคร, จังหวัดกรุงเทพมหานคร
                                  </span>
                                  <img
                                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/c98ab2426710d89c9f14.svg"
                                    alt=""
                                    className="dwki"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex">
                            <div className="wdkwo">ค่าส่ง</div>
                            <div>29</div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  <section className="daw">
                    <div className="font_comon">ชนิด</div>
                    <div className="options-container">
                      <div className="options-container">
                        {product.sku_options &&
                        product.sku_options.length > 0 ? (
                          product.sku_options.map((option, index) => (
                            <button
                              className="button-cate"
                              key={index}
                              onClick={() =>
                                handleOptionClick(
                                  Number(option.price),
                                  option.image_url
                                )
                              }
                            >
                              <div className="cate">
                                <img
                                  src={option.image_url}
                                  alt={option.option_name}
                                />
                              </div>
                              {option.option_name}
                            </button>
                          ))
                        ) : (
                          <p>No options available</p>
                        )}
                      </div>
                    </div>
                  </section>
                  <section className="daw">
                    <div className="font_comon">จำนวน</div>
                    <div className="counter-container">
                      <button
                        className="button"
                        id="decrease"
                        onClick={decreaseQuantity}
                      >
                        -
                      </button>
                      <div className="count" id="count">
                        {selectedQuantity}
                      </div>
                      <button
                        className="button"
                        id="increase"
                        onClick={increaseQuantity}
                      >
                        +
                      </button>
                    </div>
                  </section>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="buttonsell-A"
                      onClick={() => handleBuyToCart(product)}
                    >
                      <div className="blac"></div>
                      Add to cart
                    </button>
                    <button
                      className="buttonsell-B"
                      onClick={() => handleBuyToCart(product)}
                    >
                      ซื้อสินค้า
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUi;
