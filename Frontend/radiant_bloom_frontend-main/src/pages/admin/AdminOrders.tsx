import AdminHeader from "@/components/admin/AdminHeader";
import OrdersTable from "@/pages/admin/OrdersTable";

const AdminOrders = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Management</h1>
          <p className="text-muted-foreground">
            View and manage all customer orders
          </p>
        </div>
        <OrdersTable />
      </main>
    </div>
  );
};

export default AdminOrders;
