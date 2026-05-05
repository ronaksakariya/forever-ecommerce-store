import Hero from "@/components/Hero";
import NewsletterBox from "@/components/NewsletterBox";
import PolicyBanner from "@/components/PolicyBanner";
import ProductSection from "@/components/ProductSection";
import { useProducts } from "@/hooks/useProducts";

const HomePage = () => {
  const { latest, bestsellers } = useProducts();
  console.log("bestsellers", bestsellers);

  return (
    <>
      <Hero />
      <ProductSection
        eyebrow="Latest Collection"
        title="Fresh arrivals"
        description="New essentials selected from the latest drop."
        products={latest}
      />
      <ProductSection
        eyebrow="Bestsellers"
        title="Most wanted"
        description="Customer favorites across topwear, bottomwear, and winter layers."
        products={bestsellers}
      />
      <PolicyBanner />
      <NewsletterBox />
    </>
  );
};

export default HomePage;
