import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchProducts, selectAllProducts } from "@/store/slices/productSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CategoryProducts = () => {
  const dispatch = useAppDispatch();
  const { category = '' } = useParams<{ category: string }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const brand = params.get("brand");
  const sort = params.get("sort");

  // Get products and loading state from Redux
  const products = useAppSelector(selectAllProducts);
  const { status, error } = useAppSelector((state) => state.products);

  // Fetch products on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Helper to normalize category strings: lowercase and remove non-alphanumerics
  const norm = (s: string) => s?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";

  // Filter products based on category and other filters
  let filteredProducts = [...products];

  if (status === 'succeeded') {
    if (category === "bestsellers") {
      filteredProducts = products.filter((p) => p.isBestseller);
    } else if (category === "sale") {
      filteredProducts = products.filter(
        (p) => p.originalPrice && p.originalPrice > p.price
      );
    } else if (category) {
      filteredProducts = products.filter(
        (p) => norm(p.category) === norm(category)
      );
      // Fallbacks if exact category match returns nothing
      if (filteredProducts.length === 0) {
        // Try substring/contains match on normalized category
        filteredProducts = products.filter((p) =>
          norm(p.category).includes(norm(category))
        );
      }
      if (filteredProducts.length === 0) {
        // Try subcategory match
        filteredProducts = products.filter((p) =>
          norm(p.subcategory || "").includes(norm(category))
        );
      }
    }
  }

  // Loading skeleton
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'failed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading products</AlertTitle>
          <AlertDescription>{error || 'Failed to load products. Please try again later.'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Display name capitalized
  const displayCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All Products';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="bg-gradient-subtle py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gradient-navy mb-4">
              {displayCategory}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our {displayCategory} collection
            </p>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <ProductGrid 
            products={filteredProducts} 
            initialCategory={category} 
          />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-muted-foreground mt-2">
              {category ? `No products available in ${displayCategory}` : 'No products available'}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryProducts;
