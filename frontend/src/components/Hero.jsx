import { assets } from "@/assets/frontend_assets/assets";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-[#FAF9F6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] lg:grid-cols-2">
        <div className="flex min-h-[420px] flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#000000]">
            Noir Eternal
          </p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight text-[#000000] sm:text-5xl lg:text-6xl">
            Tailored essentials for every day.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#000000]/70">
            New silhouettes, clean layers, and wardrobe staples made for a
            sharper routine.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-12 bg-[#000000] px-8 text-base text-[#FAF9F6] hover:bg-[#000000]/80"
            >
              <Link to="/collection">Shop Latest</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 border-[#000000] bg-[#FAF9F6] px-8 text-base text-[#000000] hover:bg-[#000000] hover:text-[#FAF9F6]"
            >
              <Link to="/collection">View Bestsellers</Link>
            </Button>
          </div>
        </div>
        <div className="min-h-[420px] bg-[#E5E5E5]">
          <img
            src={assets.hero_img}
            alt="New clothing collection"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
