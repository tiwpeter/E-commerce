export interface ProductViewModel {
  product: Product | null;
  selectedImage: string | null;
  selectedPrice: number | null; // number เพราะเราต้องคำนวณได้
  cart: { title: string; quantity: number; price: number }[]; // price เป็น number
  isModalOpen: boolean;
  selectImage: (image: string) => void;
  selectPrice: (price: number) => void;
}

// Interface Product ให้ตรงกับ fields ของ Firebase
export interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;           // price ปัจจุบัน
  original_price: number;  // ราคาเต็ม
  discount: number;        // %
  rating: number;          
  total_reviews: number;
  sold: number;
  sku_options: Option[];   // map จาก sku_options
  images: string[];        // รูปภาพทั้งหมด
  shop: string;
  description: string;
  breadcrumb: string[];
  url: string;
}

export interface Option {
  option_name: string;
  price: number;           // number เพื่อคำนวณ
  image_url: string;
}
