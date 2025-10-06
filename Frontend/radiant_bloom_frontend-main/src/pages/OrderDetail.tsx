import { Link, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAppSelector } from "@/store/hooks";
import { selectAllOrders } from "@/store/slices/ordersSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orders = useAppSelector(selectAllOrders);

  // Derive current user's email from storage (same logic as Orders.tsx)
  const currentUserEmail = useMemo(() => {
    try {
      const storedDirect = localStorage.getItem("currentUserEmail");
      if (storedDirect && storedDirect.trim()) return storedDirect.trim();
    } catch {}
    try {
      const userRaw = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
      if (userRaw) {
        const user = JSON.parse(userRaw) as { email?: string };
        if (user?.email) return user.email;
      }
    } catch {}
    try {
      const checkoutRaw = localStorage.getItem("checkoutForm");
      if (checkoutRaw) {
        const cf = JSON.parse(checkoutRaw) as { email?: string };
        if (cf?.email) return cf.email;
      }
    } catch {}
    return "";
  }, []);

  const order = useMemo(() => {
    const found = orders.find((o) => o._id === id || o.id === id);
    const email = (currentUserEmail || "").toLowerCase();
    if (!found) return undefined;
    if (!email) return undefined; // if no user identity, hide
    // For new API format, we don't need to filter by email as the API handles this
    return found;
  }, [orders, id, currentUserEmail]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link to="/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.orderNumber || order.id}</h1>
            <p className="text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <Link to="/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Items in this order</h2>
            <div className="space-y-4">
              {order.items.map((item) => {
                const img = item.image;
                const unit = Number(item.price) || 0;
                const line = unit * item.quantity;
                return (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      {img ? (
                        <img src={img} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded" />
                      )}
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.brand && (
                          <div className="text-sm text-muted-foreground">{item.brand}</div>
                        )}
                        <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">Rs:{line.toFixed(2)}</div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-muted-foreground">Rs:{unit.toFixed(2)} each</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-6 text-lg font-semibold">
              <span>Total</span>
              <span>Rs:{order.pricing?.total?.toFixed(2) || order.total?.toFixed(2) || '0.00'}</span>
            </div>
          </Card>

          {/* Summary */}
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Customer</h2>
              <div className="text-sm">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</div>
              <div className="text-sm text-muted-foreground">{order.shippingAddress?.phone}</div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
              <div className="text-sm whitespace-pre-wrap">
                {order.shippingAddress?.street}<br/>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br/>
                {order.shippingAddress?.country}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Status</h2>
              <div className="text-sm capitalize">{order.status}</div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
