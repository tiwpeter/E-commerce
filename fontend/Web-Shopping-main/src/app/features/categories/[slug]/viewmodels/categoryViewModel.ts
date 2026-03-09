import { useState, useEffect } from "react";
import { Product, productService } from "../services/productService";

export const useCategoryViewModel = () => {
  const [selectedSub, setSelectedSub] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedSub) return setProducts([]);

    const fetchProducts = async () => {
      setLoading(true);
      const prods = await productService.getProducts(selectedSub, selectedBrand || undefined);
      setProducts(prods);
      setLoading(false);
      console.log("Products state updated:", prods);
    };

    fetchProducts();
  }, [selectedSub, selectedBrand]);

  return {
    selectedSub,
    setSelectedSub,
    selectedBrand,
    setSelectedBrand,
    products,
    loading,
  };
};
