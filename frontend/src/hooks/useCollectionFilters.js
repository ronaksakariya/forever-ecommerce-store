import { useMemo, useState } from "react";

import { useProducts } from "@/hooks/useProducts";

const PRODUCTS_PER_PAGE = 12;

const sortProducts = (products, sortBy) => {
  const sortedProducts = [...products];

  if (sortBy === "price-low") {
    return sortedProducts.sort((first, second) => first.price - second.price);
  }

  if (sortBy === "price-high") {
    return sortedProducts.sort((first, second) => second.price - first.price);
  }

  if (sortBy === "featured") {
    return sortedProducts.sort(
      (first, second) => Number(second.bestseller) - Number(first.bestseller),
    );
  }

  return sortedProducts.sort((first, second) => second.date - first.date);
};

export const useCollectionFilters = () => {
  const { products, categories, subCategories } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const updateSearchTerm = (value) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const updateSortBy = (value) => {
    setSortBy(value);
    setCurrentPage(0);
  };

  const toggleCategory = (category) => {
    setCurrentPage(0);
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((item) => item !== category)
        : [...currentCategories, category],
    );
  };

  const toggleType = (type) => {
    setCurrentPage(0);
    setSelectedTypes((currentTypes) =>
      currentTypes.includes(type)
        ? currentTypes.filter((item) => item !== type)
        : [...currentTypes, type],
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("latest");
    setSelectedCategories([]);
    setSelectedTypes([]);
    setCurrentPage(0);
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchingProducts = products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.subCategory);

      return matchesSearch && matchesCategory && matchesType;
    });

    return sortProducts(matchingProducts, sortBy);
  }, [products, searchTerm, selectedCategories, selectedTypes, sortBy]);

  const pageCount = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const pageStart = currentPage * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(pageStart, pageStart + PRODUCTS_PER_PAGE);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return {
    categories,
    clearFilters,
    currentPage,
    filteredProducts,
    handlePageChange,
    pageCount,
    paginatedProducts,
    productsPerPage: PRODUCTS_PER_PAGE,
    searchTerm,
    selectedCategories,
    selectedTypes,
    setSearchTerm: updateSearchTerm,
    setSortBy: updateSortBy,
    sortBy,
    subCategories,
    toggleCategory,
    toggleType,
    totalProducts: products.length,
  };
};
