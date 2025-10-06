import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { updateQuantity, removeFromCart, clearCart } from "@/store/slices/cartSlice";
import { createOrder } from "@/store/slices/ordersSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("manual");

  // Load saved checkout form data on mount
  useEffect(() => {
    try {
      // First try to load from checkoutData (from guest flow)
      const checkoutData = localStorage.getItem("checkoutData");
      if (checkoutData) {
        const data = JSON.parse(checkoutData);
        
        // Check if data is not too old (24 hours)
        const isDataValid = !data.timestamp || (Date.now() - data.timestamp < 24 * 60 * 60 * 1000);
        
        if (isDataValid) {
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setCity(data.city || "");
          setPostal(data.postal || "");
          setPaymentMethod(data.paymentMethod || "manual");
          
          console.log("✅ Checkout data restored from previous session");
          toast({
            title: "Form Restored",
            description: "Your shipping details have been restored.",
          });
        } else {
          console.log("⏰ Checkout data expired, clearing...");
        }
        
        // Clear the saved data after loading (whether valid or expired)
        localStorage.removeItem("checkoutData");
      } else {
        // Fallback to regular saved form data
        const saved = localStorage.getItem("checkoutForm");
        if (saved) {
          const data = JSON.parse(saved) as Partial<{
            fullName: string;
            email: string;
            phone: string;
            address: string;
            city: string;
            postal: string;
            paymentMethod: string;
          }>;
          if (data.fullName) setFullName(data.fullName);
          if (data.email) setEmail(data.email);
          if (data.phone) setPhone(data.phone);
          if (data.address) setAddress(data.address);
          if (data.city) setCity(data.city);
          if (data.postal) setPostal(data.postal);
          if (data.paymentMethod) setPaymentMethod(data.paymentMethod);
        }
      }
    } catch (e) {
      console.warn("Failed to load checkout form from localStorage", e);
    }
  }, []);

  // Save checkout form data whenever fields change (debounced)
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(
          "checkoutForm",
          JSON.stringify({ fullName, email, phone, address, city, postal, paymentMethod })
        );
        // Also persist a simple key for user filtering on orders pages
        if (email && email.trim()) {
          localStorage.setItem("currentUserEmail", email.trim());
        }
      } catch (e) {
        console.warn("Failed to save checkout form to localStorage", e);
      }
    }, 200);
    return () => window.clearTimeout(id);
  }, [fullName, email, phone, address, city, postal, paymentMethod]);

  const handlePay = async () => {
    if (cart.length === 0) return;
    
    // Debug authentication state
    console.log("🔍 Checkout Debug:", {
      isAuthenticated,
      user,
      userFromStorage: localStorage.getItem("user"),
      token: localStorage.getItem("token")
    });
    
    // Enhanced authentication check
    const token = localStorage.getItem("token");
    const userFromStorage = localStorage.getItem("user");
    
    if (!isAuthenticated || !user || !token || !userFromStorage) {
      console.log("🚫 Authentication failed - redirecting to login");
      toast({
        title: "Login Required",
        description: "Please login or register first to place your order.",
        variant: "destructive",
      });
      
      // Save checkout data for restoration after login
      const checkoutData = {
        fullName,
        email,
        phone,
        address,
        city,
        postal,
        paymentMethod,
        cart: cart,
        timestamp: Date.now()
      };
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      
      // Clear any invalid auth data
      if (!token) {
        localStorage.removeItem("user");
      }
      
      navigate("/login");
      return;
    }
    
    console.log("✅ User authenticated, proceeding with order placement");
    
    // Basic validation
    if (!fullName || !email || !address || !city || !postal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const items = cart.map((i) => ({
      id: i.id,
      name: i.name,
      price: Number(i.price) || 0,
      quantity: i.quantity,
      image: i.image,
      brand: i.brand,
    }));
    const total = items.reduce((s, it) => s + (Number(it.price) || 0) * it.quantity, 0);
    
    try {
      // Create order with new API format
      const resultAction = await dispatch(
        createOrder({
          items: items.map(item => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress: {
            firstName: fullName.split(' ')[0] || '',
            lastName: fullName.split(' ').slice(1).join(' ') || '',
            street: address,
            city: city,
            state: 'N/A', // Default state value
            zipCode: postal,
            country: 'USA',
            phone: phone
          },
          paymentMethod: paymentMethod,
          notes: ''
        })
      );
      
      // If fulfilled, navigate to that order's detail
      if (createOrder.fulfilled.match(resultAction)) {
        const created = resultAction.payload;
        dispatch(clearCart());
        // Clear saved checkout data
        localStorage.removeItem("checkoutData");
        toast({
          title: "Order Placed Successfully",
          description: "Your order has been placed and will be processed by our team.",
        });
        navigate(`/orders/${created._id}`);
        return;
      }
      // If not fulfilled, fall through to generic handling
      throw new Error("Order creation not fulfilled");
    } catch (e: any) {
      console.error("Order creation error:", e);
      
      // Check if it's an authentication error
      if (e?.isAuthError || e?.message?.includes('Authentication failed') || e?.message?.includes('Access denied') || e?.message?.includes('token') || e?.statusCode === 401) {
        toast({
          title: "Authentication Required",
          description: "Please log in again to place your order.",
          variant: "destructive",
        });
        // Save checkout data and redirect to login
        localStorage.setItem("checkoutData", JSON.stringify({
          fullName, email, phone, address, city, postal, items
        }));
        navigate('/login');
        return;
      }
      
      toast({
        title: "Order Failed",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ✅ Navbar */}
      <Header />

      {/* ✅ Main Content */}
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Section: Order Items */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>
            {cart.length > 0 && (
              <Button
                variant="outline"
                className="text-red-500 border-red-300 hover:bg-red-50 text-sm sm:text-base"
                onClick={() => dispatch(clearCart())}
              >
                Clear Checkout
              </Button>
            )}
          </div>

          {cart.length === 0 ? (
            <Card className="p-4 sm:p-6">
              <p className="text-center text-muted-foreground">
                Your cart is empty. Add some products to continue.
              </p>
            </Card>
          ) : (
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Order Summary</h2>

              <div className="space-y-4 sm:space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4 sm:gap-0"
                  >
                    {/* Product Image */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img
                        src={Array.isArray(item.images) ? item.images[0] : Array.isArray(item.image) ? item.image[0] : item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                      />
                      <div className="max-w-[140px] sm:max-w-none">
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{item.name}</h3>
                        {item.brand && (
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {item.brand}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm font-medium text-orange-600">
                          Rs:{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                      {/* Quantity Control in one box */}
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-none h-8 w-8 sm:h-9 sm:w-9"
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>

                        <span className="px-2 sm:px-4 py-1 sm:py-2 text-center font-medium min-w-[30px] sm:min-w-[40px] text-xs sm:text-sm">
                          {item.quantity}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-none h-8 w-8 sm:h-9 sm:w-9"
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between mt-4 sm:mt-6 font-semibold text-base sm:text-lg">
                <span>Total:</span>
                <span>Rs:{totalPrice.toFixed(2)}</span>
              </div>
            </Card>
          )}
        </div>

        {/* Right Section: Payment + Shipping */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Shipping Information</h2>
            <div className="space-y-3 sm:space-y-4">
              <Input 
                placeholder="Full Name" 
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="text-sm sm:text-base"
              />
              <Input 
                placeholder="Email Address" 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="text-sm sm:text-base"
              />
              <Input 
                placeholder="Phone Number" 
                type="tel" 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="text-sm sm:text-base"
              />
              <Input 
                placeholder="Shipping Address" 
                required 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className="text-sm sm:text-base"
              />
              <Input 
                placeholder="City" 
                required 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                className="text-sm sm:text-base"
              />
              <Input 
                placeholder="Postal Code" 
                required 
                value={postal} 
                onChange={(e) => setPostal(e.target.value)} 
                className="text-sm sm:text-base"
              />
            </div>
          </Card>

          <Card className="p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Order Summary</h2>
            
            {/* Order Total */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <span className="text-orange-600">Rs:{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Manual Payment Processing</h3>
                  <p className="text-sm text-blue-700">
                    Your order will be processed manually by our team. You will receive payment instructions via email after order confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Authentication Warning for Non-logged Users */}
            {!isAuthenticated && (
              <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900 mb-1">Login Required</h3>
                    <p className="text-sm text-yellow-700">
                      You need to login or register to place an order. Your cart and shipping details will be saved for after login.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Place Order Button */}
            <Button 
              onClick={handlePay} 
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 text-base sm:text-lg py-4 sm:py-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isAuthenticated ? `Place Order - Rs:${totalPrice.toFixed(2)}` : "Login to Place Order"}
            </Button>
          </Card>
        </div>
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default Checkout;