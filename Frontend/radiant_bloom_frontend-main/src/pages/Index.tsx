import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import CategoryShowcase from "@/components/sections/CategoryShowcase";
import CategoryGrid from "@/components/sections/CategoryGrid";
import ProductGrid from "@/components/products/ProductGrid";
import ReviewSection from "@/components/reviews/ReviewSection";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, selectAllProducts } from "@/store/slices/productSlice";

const Index = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const { status } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CategoryShowcase />
        <HeroSection />
        <CategoryGrid />
        <ProductGrid products={products} />
        {/* Use a site-wide bucket so landing page reviews persist across refreshes */}
        <ReviewSection productId="site" />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
