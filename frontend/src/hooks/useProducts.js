import { useMemo } from "react";

import { products } from "@/assets/frontend_assets/assets";

export const useProducts = () => {
  return useMemo(() => {
    const sortedByDate = [...products].sort((first, second) => second.date - first.date);
    const bestsellers = products.filter((product) => product.bestseller);
    const latest = sortedByDate.slice(0, 8);

    return {
      products,
      latest,
      bestsellers,
      categories: ["Men", "Women", "Kids"],
      subCategories: ["Topwear", "Bottomwear", "Winterwear"],
    };
  }, []);
};
