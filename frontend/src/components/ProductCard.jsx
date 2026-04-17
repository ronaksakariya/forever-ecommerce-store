import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <article className="group">
      <Link to={`/product/${product._id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#E5E5E5]">
          <img
            src={product.image[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#000000]/60">
            {product.category} / {product.subCategory}
          </p>
          <h3 className="mt-2 line-clamp-2 min-h-11 text-sm font-medium leading-6 text-[#000000]">
            {product.name}
          </h3>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-[#000000]">${product.price}</p>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#000000] bg-[#FAF9F6] text-[#000000] hover:bg-[#000000] hover:text-[#FAF9F6]"
          >
            <Link to={`/product/${product._id}`}>View</Link>
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
