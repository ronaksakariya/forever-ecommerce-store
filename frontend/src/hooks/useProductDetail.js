import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";

export const useProductDetail = (productId) => {
  const { products } = useProducts();
  const { addToCart: addCartItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  const product = useMemo(
    () => products.find((currentProduct) => currentProduct._id === productId),
    [productId, products],
  );

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter(
        (currentProduct) =>
          currentProduct._id !== product._id &&
          currentProduct.category === product.category,
      )
      .slice(0, 4);
  }, [product, products]);

  const addToCart = () => {
    if (!product) {
      return;
    }

    if (!selectedSize) {
      toast.error("Please select size.");
      return;
    }

    addCartItem(product, selectedSize);
    toast.success(`${product.name} added to cart.`);
  };

  return {
    addToCart,
    product,
    relatedProducts,
    selectedImageIndex,
    selectedSize,
    selectedImage: product?.image[selectedImageIndex],
    setSelectedImageIndex,
    setSelectedSize,
  };
};
