import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, selectAllProducts } from "@/store/slices/productSlice";

const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const { status } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Convert URL slug into a proper display name
  const getCategoryDisplayName = (cat: string) => {
    switch (cat) {
      case "skincare":
        return "Skincare";
      case "makeup":
        return "Makeup";
      case "haircare":
        return "Hair Care";
      case "fragrance":
        return "Fragrance";
      case "tools":
        return "Tools";
      case "sale":
        return "Sale";
      default:
        return "Products";
    }
  };

  const displayName = getCategoryDisplayName(category || "");
  const isOnSale = category === "sale";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-gradient-subtle py-8 sm:py-10 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-navy mb-2 sm:mb-3 md:mb-4">
              {displayName}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {isOnSale
                ? "Discover amazing deals on premium beauty products"
                : `Explore our collection of ${displayName.toLowerCase()} products`}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <ProductGrid initialCategory={category} products={products} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CategoryProducts;
