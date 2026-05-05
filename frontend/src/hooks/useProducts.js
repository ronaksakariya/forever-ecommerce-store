import { useMemo } from "react";
import { useShop } from "@/context/ShopContext";

export const useProducts = () => {
  const { products } = useShop();

  return useMemo(() => {
    if (!products || products.length === 0) {
      return {
        products: [],
        latest: [],
        bestsellers: [],
        categories: ["Men", "Women", "Kids"],
        subCategories: ["Topwear", "Bottomwear", "Winterwear"],
      };
    }

    const sortedByDate = [...products].sort((first, second) => {
      return new Date(second.date) - new Date(first.date);
    });

    const bestsellers = products.filter((product) => product.isBestseller);
    const latest = sortedByDate.slice(0, 8);

    return {
      products,
      latest,
      bestsellers,
      categories: ["Men", "Women", "Kids"],
      subCategories: ["Topwear", "Bottomwear", "Winterwear"],
    };
  }, [products]);
};
