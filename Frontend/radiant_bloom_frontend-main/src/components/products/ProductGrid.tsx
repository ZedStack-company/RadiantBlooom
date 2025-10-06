import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ProductCard from "./ProductCard";
import { categories } from "@/data/mockData";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  initialCategory?: string;
}

const ProductGrid = ({ products = [], initialCategory }: ProductGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [brandFilters, setBrandFilters] = useState<string[]>([]);

  // Products are passed as props from parent component

  // ✅ Sync initialCategory from props to state
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setSelectedSubcategories([]);
    }
  }, [initialCategory]);

  // Initialize price range when products or category change
  useEffect(() => {
    if (!products || products.length === 0) return;
    const prices = products.map((p) => Number((p as any).price) || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (Number.isFinite(min) && Number.isFinite(max)) {
      setPriceRange([Math.max(0, Math.floor(min)), Math.ceil(max)]);
    }
  }, [products, selectedCategory]);

  // Get unique brands
  const brands = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return [...new Set(products.map((p) => p.brand))].sort();
  }, [products]);

  // Helper: normalize category strings
  const norm = (s: string) => s?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";

  // Get subcategories for selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "all") return [];
    const category =
      categories.find((c) => norm(c.id) === norm(selectedCategory)) ||
      categories.find((c) => norm(c.name) === norm(selectedCategory));
    return category?.subcategories || [];
  }, [selectedCategory]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    
    let filtered = products.filter((product) => {
      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "sale") {
          if (!product.originalPrice || product.originalPrice <= product.price) {
            return false;
          }
        } else if (selectedCategory === "bestsellers") {
          if (!product.isBestseller) {
            return false;
          }
        } else if (norm(product.category || "") !== norm(selectedCategory)) {
          return false;
        }
      }

      // Subcategory filter
      if (
        selectedSubcategories.length > 0 &&
        !selectedSubcategories.includes(product.subcategory!)
      ) {
        return false;
      }

      // Price range filter
      const numericPrice = Number(product.price) || 0;
      if (numericPrice < priceRange[0] || numericPrice > priceRange[1]) {
        return false;
      }

      // Stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Brand filter
      if (brandFilters.length > 0 && !brandFilters.includes(product.brand)) {
        return false;
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return filtered;
  }, [
    searchTerm,
    selectedCategory,
    selectedSubcategories,
    priceRange,
    sortBy,
    inStockOnly,
    brandFilters,
    products, // ✅ dependency me redux products bhi add karo
  ]);
  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handleBrandToggle = (brand: string) => {
    setBrandFilters((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubcategories([]);
    setPriceRange([0, 150]);
    setInStockOnly(false);
    setBrandFilters([]);
  };

  const activeFilterCount = [
    searchTerm,
    selectedCategory !== "all" ? selectedCategory : null,
    ...selectedSubcategories,
    inStockOnly ? "in-stock" : null,
    ...brandFilters,
  ].filter(Boolean).length;

  return (
    <section className="py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-6">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient-navy mb-1 sm:mb-2">
              Our Products
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="relative px-2 sm:px-4"
              >
                <SlidersHorizontal className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 sm:ml-2 bg-secondary text-white text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}
          
          {/* Filters Sidebar */}
          <div 
            className={`fixed lg:sticky lg:top-24 left-0 lg:left-auto h-full lg:h-auto w-4/5 sm:w-96 lg:w-80 bg-background z-50 lg:z-auto transform transition-transform duration-300 ease-in-out ${
              showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } lg:block overflow-y-auto max-h-screen lg:max-h-[calc(100vh-8rem)]`}
          >
            <div className="p-4 sm:p-6 lg:p-4 xl:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs sm:text-sm">
                      Clear All
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden p-1 h-8 w-8"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Category Filter */}
                <div>
                  <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Category</h4>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory Filter */}
                {availableSubcategories.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Subcategory</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto text-xs sm:text-sm">
                      {availableSubcategories.map((subcategory) => (
                        <div
                          key={subcategory}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`sub-${subcategory}`}
                            checked={selectedSubcategories.includes(subcategory)}
                            onCheckedChange={() =>
                              handleSubcategoryToggle(subcategory)
                            }
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`sub-${subcategory}`}
                            className="cursor-pointer truncate"
                          >
                            {subcategory}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                    Price Range: Rs:{priceRange[0]} - Rs:{priceRange[1]}
                  </h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={150}
                      step={5}
                      className="mb-2"
                    />
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Brand</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto text-xs sm:text-sm">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={brandFilters.includes(brand)}
                          onCheckedChange={() => handleBrandToggle(brand)}
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={`brand-${brand}`}
                          className="cursor-pointer truncate"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Filter */}
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in-stock"
                      checked={inStockOnly}
                      onCheckedChange={(checked) =>
                        setInStockOnly(checked === true)
                      }
                      className="h-4 w-4"
                    />
                    <label htmlFor="in-stock" className="text-xs sm:text-sm cursor-pointer">
                      In Stock Only
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Apply Button (Mobile) */}
              <div className="lg:hidden mt-6">
                <Button 
                  className="w-full" 
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <p className="text-lg sm:text-xl text-muted-foreground mb-3 sm:mb-4">
                  No products found
                </p>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button 
                  size="sm" 
                  className="text-xs sm:text-sm"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => console.log('Add to cart:', p)}
                    onQuickView={(p) => console.log('Quick view:', p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
