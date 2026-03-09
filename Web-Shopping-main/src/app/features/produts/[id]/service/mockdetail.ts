// services/productService.ts
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Product } from "@/lib/model";

export const fetchProductById = async (id: string): Promise<Product | null> => {
  console.log("fetchProductById called with id:", id); // log id ที่รับเข้ามา

  try {
    const docRef = doc(db, "products", id); 
    const docSnap = await getDoc(docRef);

    console.log("Document snapshot:", docSnap.exists());

    if (!docSnap.exists()) {
      console.log("❌ No such product!");
      return null;
    }

    const data = docSnap.data();
    console.log("Document data:", data);

    return {
      id: docSnap.id,
      title: data.title,
      brand: data.brand,
      price: Number(data.price),
      original_price: Number(data.original_price),
      discount: Number(data.discount),
      rating: Number(data.rating),
      total_reviews: Number(data.total_reviews),
      sold: Number(data.sold),
      sku_options: (data.sku_options || []).map((o: any) => {
        console.log("Mapping option:", o);
        return {
          option_name: o.name,
          price: Number(o.price),
          image_url: o.img,
        };
      }),
      images: data.images || [],
      shop: data.shop,
      description: data.description,
      breadcrumb: data.breadcrumb || [],
      url: data.url,
    } as Product;
  } catch (error) {
    console.error("🔥 Error fetching product by id:", error);
    return null;
  }
};

// ====================
// 🔥 Fetch all products
// ====================
export const fetchAllProducts = async (): Promise<Product[]> => {
  const result: Product[] = [];

  try {
    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      result.push({
        id: docSnap.id,
        title: data.title,
        price: Number(data.price),
        images: data.images || [],
        sku_options: data.sku_options || [],
        description: data.description || "",
        original_price: Number(data.original_price),
        discount: Number(data.discount),
        rating: Number(data.rating),
        total_reviews: Number(data.total_reviews),
        sold: Number(data.sold),
        shop: data.shop,
        breadcrumb: data.breadcrumb || [],
        url: data.url,
          brand: data.brand || "No Brand" // ✅ เพิ่มตรงนี้

      });
    });
  } catch (error) {
    console.error("🔥 Error fetching all products:", error);
  }

  return result;
};
