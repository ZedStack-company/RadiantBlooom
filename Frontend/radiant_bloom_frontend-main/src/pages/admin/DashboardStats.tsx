import { Card } from "@/components/ui/card";
import { Users, Package, ShoppingCart, TrendingUp } from "lucide-react";

const DashboardStats = ({ stats }) => {
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <Card className="card-elegant p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Total Users</p>
                   <p className="text-2xl font-bold text-gradient-navy">
                     {stats.totalUsers.toLocaleString()}
                   </p>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                   <Users className="h-6 w-6 text-primary" />
                 </div>
               </div>
               <div className="flex items-center mt-4 text-sm">
                 <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                 <span className="text-green-600">+12%</span>
                 <span className="text-muted-foreground ml-1">from last month</span>
               </div>
             </Card>
   
             <Card className="card-elegant p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Total Products</p>
                   <p className="text-2xl font-bold text-gradient-navy">
                     {stats.totalProducts}
                   </p>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                   <Package className="h-6 w-6 text-secondary" />
                 </div>
               </div>
               <div className="flex items-center mt-4 text-sm">
                 <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                 <span className="text-green-600">+3</span>
                 <span className="text-muted-foreground ml-1">new this week</span>
               </div>
             </Card>
   
             <Card className="card-elegant p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Total Orders</p>
                   <p className="text-2xl font-bold text-gradient-navy">
                     {stats.totalOrders}
                   </p>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                   <ShoppingCart className="h-6 w-6 text-accent" />
                 </div>
               </div>
               <div className="flex items-center mt-4 text-sm">
                 <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                 <span className="text-green-600">+18%</span>
                 <span className="text-muted-foreground ml-1">from last week</span>
               </div>
             </Card>
   
             <Card className="card-elegant p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Revenue</p>
                   <p className="text-2xl font-bold text-gradient-orange">
                     Rs:{stats.revenue.toLocaleString()}
                   </p>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                   <TrendingUp className="h-6 w-6 text-green-600" />
                 </div>
               </div>
               <div className="flex items-center mt-4 text-sm">
                 <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                 <span className="text-green-600">+25%</span>
                 <span className="text-muted-foreground ml-1">from last month</span>
               </div>
             </Card>
           </div>
   
  );
};

export default DashboardStats;
