import { useParams, Link } from "react-router-dom";
import React, { useState } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reviews as mockReviews } from "@/data/mockData";
import { loadState, saveState, STORAGE_KEYS } from "@/utils/localStorage";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { addToCart, toggleWishlist } from "@/store/slices/cartSlice";
import { fetchProducts, selectAllProducts } from "@/store/slices/productSlice";
import ProductCard from "@/components/products/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectAllProducts);
  const { status } = useSelector((state: RootState) => state.products);
  const favorites = useSelector((state: RootState) => state.cart.wishlist);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // ✅ Reviews state (persisted per product in localStorage)
  const [reviews, setReviews] = useState<any[]>([]);

  // Load persisted reviews when a valid product id is available
  React.useEffect(() => {
    if (!id) return;
    const map = loadState<Record<string, any[]>>(STORAGE_KEYS.REVIEWS, {} as Record<string, any[]>) || {};
    const existing = map[id];
    if (existing && Array.isArray(existing)) {
      setReviews(existing);
    } else {
      const seeded = mockReviews.filter((r) => r.productId === id);
      map[id] = seeded;
      saveState(STORAGE_KEYS.REVIEWS, map);
      setReviews(seeded);
    }
  }, [id]);

  // ✅ New Review form states
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Ensure products are loaded
  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const product = products.find((p) => p.id === id);
  const isFavorite = product && favorites ? favorites.some((f) => f.id === product.id) : false;

  // Show loading state while fetching products
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Only show not found after products have loaded
  if (status === 'succeeded' && !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast({
      title: "Added to cart",
      description: `${product.name} (x${quantity}) has been added to your cart.`,
    });
  };

  const handleAddToFavorites = () => {
    dispatch(toggleWishlist(product));
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${product.name} has been ${
        isFavorite ? "removed from" : "added to"
      } your favorites.`,
    });
  };

  // ✅ Handle Review Submit
  const handleSubmitReview = () => {
    if (!reviewText.trim() || rating === 0) {
      toast({
        title: "Error",
        description: "Please provide both a rating and a comment.",
        variant: "destructive",
      });
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      productId: product.id,
      userName: "Guest User", // 🔹 You can integrate with auth later
      rating,
      comment: reviewText,
      verified: false,
      date: new Date().toLocaleDateString(),
    };

    // Update local state
    setReviews((prev) => [newReview, ...prev]);
    // Persist to localStorage per product
    const map = loadState<Record<string, any[]>>(STORAGE_KEYS.REVIEWS, {} as Record<string, any[]>) || {};
    const pid = product.id;
    const current = Array.isArray(map[pid]) ? map[pid] : [];
    map[pid] = [newReview, ...current];
    saveState(STORAGE_KEYS.REVIEWS, map);

    setReviewText("");
    setRating(0);

    toast({
      title: "Review Submitted",
      description: "Your review has been added successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Breadcrumb and Back Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground overflow-x-auto pb-1.5 sm:pb-0">
              <Link to="/" className="hover:text-primary whitespace-nowrap">
                Home
              </Link>
              <span className="text-muted-foreground/50">/</span>
              <Link to={`/category/${product.category}`} className="capitalize hover:text-primary whitespace-nowrap">
                {product.category}
              </Link>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-foreground truncate max-w-[150px] sm:max-w-none">{product.name}</span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors w-fit"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Products</span>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={product.images?.[selectedImage] || product.images?.[0] || product.image?.[selectedImage] || product.image?.[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>

              {/* Thumbnail images - show only if more than 1 image */}
              {(product.images || product.image) && (product.images || product.image)!.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {(product.images || product.image)!.map((img, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${
                        selectedImage === i ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(i)}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.isBestseller && (
                    <Badge className="bg-secondary text-white">Bestseller</Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-accent text-primary">New</Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gradient-navy mb-2">
                  {product.name}
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  {product.brand}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-gradient-orange">
                  Rs:{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg sm:text-xl text-muted-foreground line-through">
                    Rs:{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Description moved below Add to Cart */}

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center border rounded-xl">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 bg-gradient-orange text-white hover:opacity-90"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddToFavorites}
                    className={isFavorite ? "border-red-500 text-red-500" : ""}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </Button>
                </div>
                
                {/* Key Features placed after CTAs */}
                {product.features && product.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Description placed below CTAs with heading */}
                {product.description && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Product Guarantees */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t">
                <div className="text-center">
                  <Truck className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders Rs:50+</p>
                </div>
                <div className="text-center">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Authentic</p>
                  <p className="text-xs text-muted-foreground">100% Original</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">30-Day Return</p>
                  <p className="text-xs text-muted-foreground">Easy returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12 lg:mt-16">
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              </TabsList>

              {/* ✅ Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                {/* Review Form */}
                <Card className="p-4 sm:p-6 mb-6">
                  <h3 className="font-semibold mb-4">Write a Review</h3>
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 sm:h-6 sm:w-6 cursor-pointer ${
                          i < rating
                            ? "fill-orange-400 text-orange-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRating(i + 1)}
                      />
                    ))}
                  </div>
                  <textarea
                    className="w-full border rounded-lg p-3 text-sm outline-none"
                    rows={3}
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />

                  <Button
                    type="button"
                    onClick={handleSubmitReview}
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-4 py-2 mt-3"
                  >
                    Submit Review
                  </Button>
                </Card>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    <>
                      {/* ✅ Sirf 2 reviews show karo initially */}
                      {reviews
                        .slice(0, showAll ? reviews.length : 2)
                        .map((review) => (
                          <Card
                            key={review.id}
                            className="p-4 sm:p-6 border border-orange-200 shadow-sm hover:shadow-md transition"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {review.userName}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < review.rating
                                            ? "text-orange-500 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  {review.verified && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-orange-100 text-orange-700 border border-orange-200 text-xs"
                                    >
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500 mt-2 sm:mt-0">
                                {review.date}
                              </span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </Card>
                        ))}

                      {/* ✅ Show More / Show Less Button */}
                      {reviews.length > 2 && (
                        <div className="text-center">
                          <Button
                            onClick={() => setShowAll(!showAll)}
                            className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg mt-4"
                          >
                            {showAll ? "Show Less" : "Show More Reviews"}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <Card className="p-4 sm:p-6">
                  <h3 className="font-semibold mb-4">Product Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Brand:</p>
                      <p className="text-muted-foreground">{product.brand}</p>
                    </div>
                    <div>
                      <p className="font-medium">Category:</p>
                      <p className="text-muted-foreground capitalize">
                        {product.category}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Subcategory:</p>
                      <p className="text-muted-foreground">
                        {product.subcategory}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Stock Status:</p>
                      <p
                        className={
                          product.inStock ? "text-green-600" : "text-red-600"
                        }
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="mt-6">
                <Card className="p-4 sm:p-6">
                  <h3 className="font-semibold mb-4">Shipping & Returns</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Shipping Information</h4>
                      <p className="text-muted-foreground">
                        Free standard shipping on orders over Rs:50. Express
                        shipping available. Orders are processed within 1-2
                        business days.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Return Policy</h4>
                      <p className="text-muted-foreground">
                        30-day return policy. Items must be unused and in original
                        packaging. Return shipping is free for defective items.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products Section */}
          <div className="mt-12 lg:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gradient-navy mb-6 sm:mb-8">
              Related Products
            </h2>

            {products.filter(
              (p) => p.id !== product.id && p.category === product.category
            ).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {products
                  .filter(
                    (p) => p.id !== product.id && p.category === product.category
                  )
                  .slice(0, 4)
                  .map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct.id}
                      product={relatedProduct}
                      onAddToCart={(p) => console.log("Add to Cart", p)}
                      onQuickView={(p) => console.log("Quick View", p)}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No related products found.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;