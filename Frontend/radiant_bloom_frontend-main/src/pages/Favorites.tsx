import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import ProductCard from "@/components/products/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { toggleWishlist } from "@/store/slices/cartSlice";

const Favorites = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.cart.wishlist);

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Your favorites list is empty</h1>
            <p className="text-muted-foreground mb-8">
              Start adding products to your favorites to see them here.
            </p>
            <Link to="/">
              <Button className="bg-gradient-orange text-white">Discover Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-light">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gradient-navy">
            My Favorites ({favorites.length} items)
          </h1>
          <Button 
            variant="outline" 
            onClick={() => favorites.forEach(item => dispatch(toggleWishlist(item)))}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Clear All
          </Button>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {favorites.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} onAddToCart={() => {}} />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={() => dispatch(toggleWishlist(product))}
              >
                <Heart className="h-4 w-4 fill-current text-secondary" />
              </Button>
            </div>
          ))}
        </div>

        {/* Recommended Section */}
        <Card className="p-8 text-center bg-gradient-to-r from-muted/50 to-muted/30">
          <h2 className="text-2xl font-bold text-gradient-navy mb-4">You might also like</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Based on your favorites, we think you'll love these products too.
          </p>
          <Link to="/">
            <Button className="bg-gradient-orange text-white">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Explore More Products
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Favorites;
