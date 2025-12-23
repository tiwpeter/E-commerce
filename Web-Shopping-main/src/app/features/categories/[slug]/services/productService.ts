import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Product {
  id: string;
  title: string;
  galleryImages: string;
  salePrice: number;
  categorySlug: string;
  brand: string;
}

export const productService = {
  getProducts: async (subcategorySlug: string, brand?: string): Promise<Product[]> => {
    try {
      console.log("🔥 Fetching products:");
      console.log("subcategorySlug:", subcategorySlug, "brand:", brand);

      const conditions = [where("subcategory", "==", subcategorySlug)];
      if (brand) conditions.push(where("brand", "==", brand));

      const q = query(collection(db, "products"), ...conditions);
      const snapshot = await getDocs(q);

      console.log("Snapshot docs length:", snapshot.docs.length);
      snapshot.docs.forEach(doc => console.log("Doc:", doc.id, doc.data()));

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (err) {
      console.error("Error fetching products:", err);
      return [];
    }
  },
};
