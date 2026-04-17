import { useRef } from "react";
import { Search } from "lucide-react";
import ReactPaginateModule from "react-paginate";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useCollectionFilters } from "@/hooks/useCollectionFilters";

const sortOptions = [
  { label: "Latest", value: "latest" },
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];

const ReactPaginate = ReactPaginateModule.default ?? ReactPaginateModule;

const CollectionPage = () => {
  const productsTopRef = useRef(null);
  const {
    categories,
    clearFilters,
    currentPage,
    filteredProducts,
    handlePageChange,
    pageCount,
    paginatedProducts,
    searchTerm,
    selectedCategories,
    selectedTypes,
    setSearchTerm,
    setSortBy,
    sortBy,
    subCategories,
    toggleCategory,
    toggleType,
    totalProducts,
  } = useCollectionFilters();

  const changePageAndScroll = (pageEvent) => {
    handlePageChange(pageEvent);
    productsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-[#FAF9F6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-[#E5E5E5] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#000000]">
              Collection
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-[#000000] sm:text-5xl">
              All products
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#000000]/70">
              Browse {totalProducts} pieces across men, women, kids, topwear,
              bottomwear, and winterwear.
            </p>
          </div>
          <div className="text-sm font-medium text-[#000000]/70">
            {filteredProducts.length} products found
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#000000]">
                Filters
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-[#000000] hover:bg-[#E5E5E5]"
              >
                Clear
              </Button>
            </div>

            <div className="mt-6 space-y-7">
              <div>
                <h3 className="text-sm font-medium text-[#000000]">Category</h3>
                <div className="mt-3 space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex cursor-pointer items-center gap-3 text-sm text-[#000000]/80"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#000000]">Type</h3>
                <div className="mt-3 space-y-3">
                  {subCategories.map((type) => (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center gap-3 text-sm text-[#000000]/80"
                    >
                      <Checkbox
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div
              ref={productsTopRef}
              className="mb-6 scroll-mt-24 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="relative w-full sm:max-w-md">
                <label htmlFor="collection-search" className="sr-only">
                  Search products
                </label>
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#000000]/50" />
                <Input
                  id="collection-search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search products"
                  className="h-11 pl-11 text-base"
                />
              </div>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-10 rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-3 text-sm text-[#000000] outline-none focus:border-[#000000]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pageCount > 1 ? (
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next"
                    previousLabel="Prev"
                    pageCount={pageCount}
                    forcePage={currentPage}
                    onPageChange={changePageAndScroll}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    containerClassName="mt-12 flex flex-wrap items-center justify-center gap-2"
                    pageClassName="rounded-lg"
                    pageLinkClassName="flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-3 text-sm font-medium text-[#000000] hover:border-[#000000]"
                    activeLinkClassName="!border-[#000000] !bg-[#E5E5E5] !text-[#000000]"
                    previousLinkClassName="flex h-10 cursor-pointer items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-4 text-sm font-medium text-[#000000] hover:border-[#000000]"
                    nextLinkClassName="flex h-10 cursor-pointer items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-4 text-sm font-medium text-[#000000] hover:border-[#000000]"
                    breakLinkClassName="flex h-10 min-w-10 items-center justify-center text-sm font-medium text-[#000000]"
                    disabledLinkClassName="pointer-events-none opacity-40"
                  />
                ) : null}
              </>
            ) : (
              <div className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-6 py-16 text-center">
                <h2 className="text-2xl font-semibold text-[#000000]">
                  No products found.
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#000000]/70">
                  Adjust your search, category, or type filters.
                </p>
                <Button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 bg-[#000000] px-6 text-[#FAF9F6] hover:bg-[#000000]/80"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionPage;
