import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAllOrders, fetchMyOrders } from "@/store/slices/ordersSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";

const Orders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);

  // Determine the current user's identifier (email) from storage
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

  // Filter orders for the current user only
  const myOrders = useMemo(() => {
    const email = (currentUserEmail || "").toLowerCase();
    if (!email) return [] as typeof orders;
    return (orders || []).filter((o) => (o.customerEmail || "").toLowerCase() === email);
  }, [orders, currentUserEmail]);

  // Load my orders from localStorage for guest users
  useEffect(() => {
    const email = (currentUserEmail || "").trim();
    if (email) {
      dispatch(fetchMyOrders({ email }));
    }
  }, [dispatch, currentUserEmail]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {myOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">You have no orders yet.</p>
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {myOrders.map((o) => (
              <Card key={o.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="font-semibold">Order #{o.id}</div>
                  <div className="text-sm text-muted-foreground">Placed on {new Date(o.createdAt).toLocaleString()}</div>
                  <div className="text-sm">Items: {o.items.reduce((s, i) => s + i.quantity, 0)}</div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="font-semibold">Rs:{o.total.toFixed(2)}</div>
                  <Link to={`/orders/${o.id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
