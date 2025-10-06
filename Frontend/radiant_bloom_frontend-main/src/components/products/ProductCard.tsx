import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
// ❌ yeh galat hai
// import type { Product } from "@/data/mockData";

// ✅ yeh sahi hai
import type { Product } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { addToCart, toggleWishlist } from "@/store/slices/cartSlice";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onQuickView }: ProductCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.cart.wishlist);
  const cartItems = useSelector((state: RootState) => state.cart.cart);
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  
  // Ensure we have at least one image URL
  const mainImage = product.images?.[0] || product.image?.[0] || '/placeholder.svg';
  const isWishlisted = favorites?.some((f) => f.id === product.id) || false;

  const priceNum = Number(product.price) || 0;
  const originalPriceNum = product.originalPrice != null ? Number(product.originalPrice) : undefined;
  const discountPercentage = originalPriceNum 
    ? Math.round((1 - priceNum / originalPriceNum) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="block">
      <Card 
        className="card-product group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-secondary text-white">New</Badge>
          )}
          {product.isBestseller && (
            <Badge className="bg-accent text-primary">Bestseller</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-destructive text-white">-{discountPercentage}%</Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
  variant="ghost"
  size="sm"
  className={`absolute top-3 right-3 rounded-full p-2 transition-all duration-300 z-10 ${
    isWishlisted 
      ? "bg-secondary text-white" 
      : "bg-white/80 hover:bg-white text-muted-foreground hover:text-secondary"
  }`}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  }}
>
  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
</Button>


        {/* Add to Cart Button - Show on Hover */}
        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 z-10 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          <Button
            size="sm"
            className="w-full bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("🛒 Adding to cart:", product);
              
              // Check current quantity in cart
              const existingItem = cartItems.find(item => item.id === product.id);
              const currentQuantity = existingItem ? existingItem.quantity : 0;
              const maxQuantity = 50;
              
              if (currentQuantity >= maxQuantity) {
                toast({
                  title: "Maximum Quantity Reached",
                  description: `You can only add up to ${maxQuantity} items of this product.`,
                  variant: "destructive",
                });
                return;
              }
              
              if (onAddToCart) {
                onAddToCart(product);
              } else {
                dispatch(addToCart({ product, quantity: 1 }));
              }
              console.log("🛒 Dispatched addToCart action");
              
              const newQuantity = currentQuantity + 1;
              if (newQuantity >= maxQuantity) {
                toast({
                  title: "Added to Cart - Maximum Reached",
                  description: `${product.name} added. You've reached the maximum quantity (${maxQuantity}).`,
                });
              } else {
                toast({
                  title: "Added to Cart",
                  description: `${product.name} has been added to your cart. (${newQuantity}/${maxQuantity})`,
                });
              }
            }}
            disabled={!product.inStock}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-4">
        <div className="mb-2">
          <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-secondary transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Interactive Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              const isActive = starValue <= (hoveredStar || userRating || Math.floor(product.rating));
              return (
                <Star
                  key={i}
                  className={`h-4 w-4 cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? "text-secondary fill-current"
                      : "text-muted-foreground hover:text-secondary/50"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUserRating(starValue);
                    // Here you could dispatch an action to save the rating
                    console.log(`User rated product ${product.id} with ${starValue} stars`);
                    toast({
                      title: "Rating Submitted",
                      description: `You rated ${product.name} with ${starValue} star${starValue > 1 ? 's' : ''}.`,
                    });
                  }}
                  onMouseEnter={() => setHoveredStar(starValue)}
                  onMouseLeave={() => setHoveredStar(0)}
                />
              );
            })}
            <span className="text-sm font-medium ml-1">
              {userRating || product.rating}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-secondary">
              Rs:{priceNum.toFixed(2)}
            </span>
            {originalPriceNum != null && !isNaN(originalPriceNum) && (
              <span className="text-sm text-muted-foreground line-through">
                Rs:{originalPriceNum.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Category Badge */}
          <Badge variant="outline" className="text-xs">
            {product.subcategory}
          </Badge>
        </div>

        {/* Features Preview */}
        {product.features.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              {product.features.slice(0, 2).join(" • ")}
              {product.features.length > 2 && " • +more"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
    </Link>
  );
};

export default ProductCard;
