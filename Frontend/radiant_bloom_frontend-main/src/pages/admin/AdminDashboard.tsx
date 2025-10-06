import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Package, ShoppingCart, TrendingUp } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import OrdersTable from "@/pages/admin/OrdersTable";
import ProductsTable from "@/pages/admin/ProductsTable";
import CustomersTable from "@/pages/admin/CustomersTable";
import Analytics from "@/pages/admin/Analytics";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAllProducts, selectProductsStatus, fetchProducts } from "@/store/slices/productSlice";
import { selectAllOrders, selectOrdersState, fetchOrders } from "@/store/slices/ordersSlice";
import { selectAllCustomers, selectCustomersStatus, fetchCustomers } from "@/store/slices/customersSlice";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const orders = useAppSelector(selectAllOrders);
  const customers = useAppSelector(selectAllCustomers);

  const { status: productsStatus } = useAppSelector(selectProductsStatus);
  const customersStatus = useAppSelector(selectCustomersStatus);
  const ordersState = useAppSelector(selectOrdersState);

  // Add CSS to hide any slider elements
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .slider, [class*="slider-"], [class^="slider-"],
      .carousel, [class*="carousel-"], [class^="carousel-"],
      .swiper, [class*="swiper-"], [class^="swiper-"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (productsStatus === "idle") dispatch(fetchProducts());
    if (customersStatus === "idle") dispatch(fetchCustomers());
    if (ordersState.status === "idle") dispatch(fetchOrders());
  }, [dispatch, productsStatus, customersStatus, ordersState.status]);

  const totalUsers = customers.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  
  // Calculate revenue from confirmed/paid orders only
  const revenue = orders
    .filter(order => order.status === 'confirmed' || order.status === 'delivered' || order.paymentStatus === 'paid')
    .reduce((sum, order) => {
      const orderTotal = order.pricing?.total || order.total || 0;
      console.log(`💰 Revenue calculation - Order ${order._id || order.id}: Status=${order.status}, PaymentStatus=${order.paymentStatus}, Total=${orderTotal}`);
      return sum + orderTotal;
    }, 0);

  console.log(`💰 Total Revenue: Rs:${revenue} from ${orders.length} total orders`);
  console.log(`💰 Orders breakdown:`, orders.map(o => ({
    id: o._id || o.id,
    status: o.status,
    paymentStatus: o.paymentStatus,
    total: o.pricing?.total || o.total || 0
  })));

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-navy mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your beauty store from one central location
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-blue-800">
                  {totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-pink-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Total Products</p>
                <p className="text-2xl font-bold text-orange-800">
                  {totalProducts.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-green-800">
                  {totalOrders.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Revenue</p>
                <p className="text-2xl font-bold text-purple-800">
                  Rs:{revenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs for content */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <OrdersTable />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <ProductsTable />
          </TabsContent>

          <TabsContent value="customers" className="mt-6">
            <CustomersTable />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;