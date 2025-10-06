// Cart.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { addToCart, removeFromCart, updateQuantity, clearCart, addToWishlist, CartItem as ReduxCartItem } from "@/store/slices/cartSlice";
import { useAuth } from "@/context/AuthContext";

const Cart: React.FC = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  const handleProceedToCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items before checkout.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Proceeding to checkout",
      description: "Redirecting to checkout...",
    });
    navigate("/checkout");
  };

  const handleSaveForLater = (e: React.MouseEvent, item: ReduxCartItem) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove quantity before saving for later
    const { quantity, ...product } = item;
    // Add to wishlist (idempotent) then remove from cart
    dispatch(addToWishlist(product));
    dispatch(removeFromCart(item.id));
    toast({
      title: "Saved for later",
      description: `${item.name} has been moved to your wishlist.`,
    });
  };

  const handleClearCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(clearCart());
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(0.1);
      toast({ title: "Promo code applied", description: "10% discount applied to your order." });
    } else {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal - discountAmount + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/">
            <Button className="bg-gradient-orange text-white">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gradient-navy mb-6 sm:mb-8">
          Shopping Cart ({cart.length} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center mx-auto sm:mx-0">
                    <img
                      src={Array.isArray(item.images) ? item.images[0] : Array.isArray(item.image) ? item.image[0] : item.image}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-product.png';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-0">
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.id}`}
                          className="font-semibold hover:text-primary transition-colors text-base sm:text-lg line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {item.isBestseller && (
                            <Badge className="bg-secondary text-white text-xs">Bestseller</Badge>
                          )}
                          {item.isNew && (
                            <Badge className="bg-accent text-primary text-xs">New</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-muted-foreground hover:text-destructive self-end sm:self-start"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 sm:mt-0">
                      <div className="flex items-center border rounded-xl w-fit">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 sm:h-9 sm:w-9"
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 sm:w-12 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 sm:h-9 sm:w-9"
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        {(() => {
                          const unitPrice = Number(item.price) || 0;
                          const lineTotal = unitPrice * item.quantity;
                          return (
                            <>
                              <div className="font-semibold text-gradient-orange text-base sm:text-lg">
                                Rs:{lineTotal.toFixed(2)}
                              </div>
                              {item.quantity > 1 && (
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                  Rs:{unitPrice.toFixed(2)} each
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleSaveForLater(e, item)}
                      className="flex items-center gap-2 mt-3 w-full sm:w-auto"
                      type="button"
                    >
                      <Heart className="h-4 w-4" /> Save for Later
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex justify-end items-center pt-4">
              <Button
                variant="ghost"
                onClick={handleClearCart}
                className="text-muted-foreground hover:text-destructive text-sm sm:text-base"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-6 sticky top-20 sm:top-24">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Order Summary</h2>

              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="text-sm"
                  />
                  <Button variant="outline" onClick={applyPromoCode} className="text-sm whitespace-nowrap">
                    Apply
                  </Button>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-600 mt-2">✓ SAVE10 applied (10% off)</p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>Rs:{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm sm:text-base">
                    <span>Discount (10%)</span>
                    <span>-Rs:{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `Rs:${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs sm:text-sm text-green-600">✓ Free shipping on orders over Rs:50</p>
                )}

                <div className="border-t pt-2 sm:pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-gradient-orange">Rs:{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-orange text-white hover:opacity-90 mb-3 sm:mb-4 py-3 sm:py-4 text-sm sm:text-base"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">Secure checkout with SSL encryption</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;