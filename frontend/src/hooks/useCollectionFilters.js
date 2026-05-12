import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useProducts } from "@/hooks/useProducts";

const PRODUCTS_PER_PAGE = 12;
const SORT_OPTIONS = ["latest", "featured", "price-low", "price-high"];

const normalizeFilterValue = (value) => String(value ?? "").trim().toLowerCase();

const isBestseller = (product) => Boolean(product.isBestseller ?? product.bestseller);

const getSortFromParams = (searchParams) => {
  const sortParam = searchParams.get("sort");

  return SORT_OPTIONS.includes(sortParam) ? sortParam : "latest";
};

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
      (first, second) => Number(isBestseller(second)) - Number(isBestseller(first)),
    );
  }

  return sortedProducts.sort((first, second) => second.date - first.date);
};

export const useCollectionFilters = () => {
  const { products, categories, subCategories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const sortBy = getSortFromParams(searchParams);

  const updateSearchTerm = (value) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const updateSortBy = (value) => {
    const nextSort = SORT_OPTIONS.includes(value) ? value : "latest";

    setCurrentPage(0);
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set("sort", nextSort);

        return nextParams;
      },
      { replace: true },
    );
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
    setSelectedCategories([]);
    setSelectedTypes([]);
    setCurrentPage(0);
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set("sort", "latest");

        return nextParams;
      },
      { replace: true },
    );
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedCategories = selectedCategories.map(normalizeFilterValue);
    const normalizedTypes = selectedTypes.map(normalizeFilterValue);

    const matchingProducts = products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name?.toLowerCase().includes(normalizedSearch) ||
        product.description?.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        normalizedCategories.length === 0 ||
        normalizedCategories.includes(normalizeFilterValue(product.category));
      const matchesType =
        normalizedTypes.length === 0 ||
        normalizedTypes.includes(normalizeFilterValue(product.subCategory));

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
