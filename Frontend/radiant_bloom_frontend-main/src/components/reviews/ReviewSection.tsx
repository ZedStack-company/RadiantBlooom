import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { reviews as mockReviews, type Review } from "@/data/mockData";
import { loadState, saveState, STORAGE_KEYS } from "@/utils/localStorage";

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState(0);
  const [showWriteReview, setShowWriteReview] = useState(false);

  // ✅ Local state for reviews (persisted per product)
  const [allReviews, setAllReviews] = useState<Review[]>(() => {
    const map = loadState<Record<string, Review[]>>(STORAGE_KEYS.REVIEWS, {}) || {};
    // If this product has reviews saved, combine them with other products to keep global list coherent
    const existing = map[productId];
    if (existing && Array.isArray(existing)) {
      // Merge with mock for other products to keep cards working if needed
      const others = mockReviews.filter((r) => r.productId !== productId);
      return [...existing, ...others];
    }
    // Seed this product's reviews from mock on first load
    map[productId] = mockReviews.filter((r) => r.productId === productId);
    saveState(STORAGE_KEYS.REVIEWS, map);
    return mockReviews;
  });

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });

  // ✅ Filter reviews for specific product
  const productReviews = allReviews.filter(
    (review) => review.productId === productId
  );

  // ✅ Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: productReviews.filter((r) => r.rating === rating).length,
    percentage:
      productReviews.length > 0
        ? (productReviews.filter((r) => r.rating === rating).length /
            productReviews.length) *
          100
        : 0,
  }));

  // ✅ Average rating
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
        productReviews.length
      : 0;

  // ✅ Filter + Sort reviews
  const filteredReviews = productReviews
    .filter((review) => filterRating === 0 || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        default: // recent
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  // ✅ Handle Submit Review
  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) return;

    const review: Review = {
      id: String(Date.now()),
      productId,
      userName: "Guest User", // In real app → current user
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString(),
      verified: false,
    };

    // Update local component state (keep other products' reviews as-is)
    setAllReviews((prev) => [review, ...prev]);

    // Persist to localStorage for this product only
    const map = loadState<Record<string, Review[]>>(STORAGE_KEYS.REVIEWS, {}) || {};
    const current = Array.isArray(map[productId]) ? map[productId] : [];
    map[productId] = [review, ...current];
    saveState(STORAGE_KEYS.REVIEWS, map);

    setShowWriteReview(false);
    setNewReview({ rating: 5, comment: "" });
  };

  // ✅ Render stars utility
  const renderStars = (
    rating: number,
    size: "sm" | "md" | "lg" = "md"
  ) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "text-secondary fill-current"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gradient-navy">
          Customer Reviews
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <Card className="card-elegant">
              <CardHeader>
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  {renderStars(Math.round(averageRating), "lg")}
                  <p className="text-muted-foreground mt-2">
                    Based on {productReviews.length} reviews
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {/* Rating Distribution */}
                <div className="space-y-3">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setFilterRating(
                            filterRating === rating ? 0 : rating
                          )
                        }
                        className={`flex items-center gap-2 text-sm transition-colors ${
                          filterRating === rating
                            ? "text-secondary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {renderStars(rating, "sm")}
                        <span>{rating}</span>
                      </button>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground min-w-[2rem]">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Write Review Button */}
                <Button
                  className="w-full mt-6 btn-hero"
                  onClick={() => setShowWriteReview(!showWriteReview)}
                >
                  Write a Review
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {/* Sort and Filter Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="recent">Most Recent</option>
                  <option value="rating-high">Highest Rating</option>
                  <option value="rating-low">Lowest Rating</option>
                </select>

                {filterRating > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-2">
                    {filterRating} star
                    <button
                      onClick={() => setFilterRating(0)}
                      className="hover:text-secondary-dark"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                Showing {filteredReviews.length} of{" "}
                {productReviews.length} reviews
              </p>
            </div>

            {/* Write Review Form */}
            {showWriteReview && (
              <Card className="card-elegant mb-6">
                <CardHeader>
                  <h3 className="font-semibold">Write Your Review</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Rating Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setNewReview({ ...newReview, rating: star })
                          }
                          className="transition-colors"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= newReview.rating
                                ? "text-secondary fill-current"
                                : "text-muted-foreground hover:text-secondary"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Review
                    </label>
                    <Textarea
                      placeholder="Share your experience with this product..."
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      rows={4}
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3">
                    <Button onClick={handleSubmitReview} className="btn-hero">
                      Submit Review
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowWriteReview(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <div className="space-y-6">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {filterRating > 0
                      ? `No ${filterRating}-star reviews found`
                      : "No reviews yet. Be the first to review this product!"}
                  </p>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <Card key={review.id} className="card-elegant">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-orange text-white">
                              {review.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {review.userName}
                              </span>
                              {review.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating, "sm")}
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-foreground/90 leading-relaxed mb-4">
                        {review.comment}
                      </p>

                      {/* Helpful Actions */}
                      <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                        <span className="text-sm text-muted-foreground">
                          Was this helpful?
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-green-600"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Yes
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-red-600"
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            No
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
