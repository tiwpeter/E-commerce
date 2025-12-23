// src/hooks/useProductViewModel.ts
import { useEffect, useState } from "react";
import { fetchProductById } from "../service/mockdetail";
import { ProductViewModel , Product} from "@/lib/model";

export const useProductViewModel = (id: string): ProductViewModel => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [cart, setCart] = useState<{ title: string; quantity: number; price: number }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    if (!id) {
      console.log("❌ ไม่มี id ส่งเข้ามา");
      return;
    }

    console.log("📡 กำลังดึงข้อมูล Firebase:", id);
    const productData = await fetchProductById(id);

    if (!productData) {
      console.log("❌ ไม่พบสินค้าใน Firebase: ", id);
      return;
    }

    console.log("✅ Firebase ส่งข้อมูลกลับมา:", productData);

    setProduct(productData);
    setSelectedPrice(productData.price);
    setSelectedImage(productData.images?.[0] || null);
  };

  fetchData();
}, [id]);


  const selectImage = (image: string) => setSelectedImage(image);
  const selectPrice = (price: number) => setSelectedPrice(price);

  return {
    product,
    selectedImage,
    selectedPrice,
    cart,
    isModalOpen,
    selectImage,
    selectPrice
  };
};
