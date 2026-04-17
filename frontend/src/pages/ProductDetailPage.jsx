import { Link, useParams } from "react-router-dom";

import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { useProductDetail } from "@/hooks/useProductDetail";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const {
    addToCart,
    product,
    relatedProducts,
    selectedImage,
    selectedImageIndex,
    selectedSize,
    setSelectedImageIndex,
    setSelectedSize,
  } = useProductDetail(productId);

  if (!product) {
    return (
      <section className="bg-[#FAF9F6] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-6 py-16 text-center">
          <h1 className="text-3xl font-semibold text-[#000000]">Product not found.</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#000000]/70">
            The product you are looking for is unavailable.
          </p>
          <Button
            asChild
            className="mt-8 bg-[#000000] px-6 text-[#FAF9F6] hover:bg-[#000000]/80"
          >
            <Link to="/collection">Back to collection</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FAF9F6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4 sm:grid-cols-[92px_1fr]">
            <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
              {product.image.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square w-20 shrink-0 overflow-hidden rounded-lg border bg-[#E5E5E5] sm:w-full ${
                    selectedImageIndex === index ? "border-[#000000]" : "border-[#E5E5E5]"
                  }`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            <div className="order-1 aspect-[4/5] overflow-hidden rounded-lg bg-[#E5E5E5] sm:order-2">
              <img src={selectedImage} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#000000]">
              {product.category} / {product.subCategory}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#000000] sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-2xl font-semibold text-[#000000]">${product.price}</p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#000000]/70">
              {product.description}
            </p>

            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#000000]">
                Select Size
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 min-w-12 border-[#000000] px-4 ${
                      selectedSize === size
                        ? "bg-[#000000] text-[#FAF9F6] hover:bg-[#000000]/80 hover:text-[#FAF9F6]"
                        : "bg-[#FAF9F6] text-[#000000] hover:bg-[#E5E5E5]"
                    }`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              onClick={addToCart}
              className="mt-8 h-12 w-full bg-[#000000] text-base text-[#FAF9F6] hover:bg-[#000000]/80 sm:w-fit sm:px-10"
            >
              Add to Cart
            </Button>

            <div className="mt-8 border-t border-[#E5E5E5] pt-6 text-sm leading-7 text-[#000000]/70">
              <p>Original product images from the current collection.</p>
              <p>Size must be selected before adding to cart.</p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <div className="mt-20">
            <SectionTitle
              eyebrow="Related"
              title="More from this category"
              description="Similar pieces from the same collection category."
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProductDetailPage;
