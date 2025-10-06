import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2, MoreHorizontal, Loader2, CheckCircle, Truck, PackageCheck, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { useEffect, useMemo, useState } from "react";
import { selectAllOrders, fetchOrders, patchOrderStatus, deleteOrder, acceptOrder, declineOrder } from "@/store/slices/ordersSlice";
import { fetchAnalytics } from "@/store/slices/analyticsSlice";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { simulateOrderNotification } from "@/services/notificationService";
import type { Order } from "@/store/slices/ordersSlice";

const OrdersTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectAllOrders);
  const status = useSelector((s: RootState) => s.orders.status);
  const { toast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"view" | "edit">("view");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [orderToDecline, setOrderToDecline] = useState<string | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOrders());
    }
  }, [dispatch, status]);

  // Add CSS to hide any slider elements
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .slider, [class*="slider-"], [class^="slider-"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500 text-white";
      case "paid": return "bg-blue-500 text-white";
      case "shipped": return "bg-indigo-500 text-white";
      case "delivered": return "bg-green-600 text-white";
      case "cancelled": return "bg-red-500 text-white";
      default: return "bg-gray-300";
    }
  };

  const selectedOrder = useMemo(() => {
    if (!selectedId) return null as Order | null;
    return (orders || []).find((o) => o._id === selectedId || o.id === selectedId) || null;
  }, [selectedId, orders]);

  const openDrawer = (id: string, mode: "view" | "edit") => {
    setSelectedId(id);
    setDrawerMode(mode);
    setDrawerOpen(true);
  };

  const handleSaveStatus = async (id: string, newStatus: Order["status"]) => {
    setSaving(true);
    try {
      await dispatch(patchOrderStatus({ id, status: newStatus })).unwrap();
    } finally {
      setSaving(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const result = await dispatch(acceptOrder(orderId)).unwrap();
      
      // Simulate user notification
      const order = orders.find(o => o._id === orderId || o.id === orderId);
      if (order) {
        simulateOrderNotification('accepted', order.orderNumber || orderId);
      }
      
      // Refresh orders and analytics to update the dashboard
      dispatch(fetchOrders());
      dispatch(fetchAnalytics());
      
      toast({
        title: "Order Accepted",
        description: `Order has been accepted and customer has been notified.`,
      });
      console.log("📧 User notification:", result.notification);
      console.log("💰 Order accepted, refreshing orders and analytics for revenue update");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeclineOrder = async () => {
    if (!orderToDecline) return;
    
    try {
      const result = await dispatch(declineOrder({ 
        id: orderToDecline, 
        reason: declineReason 
      })).unwrap();
      
      // Simulate user notification
      const order = orders.find(o => o._id === orderToDecline || o.id === orderToDecline);
      if (order) {
        simulateOrderNotification('declined', order.orderNumber || orderToDecline, declineReason);
      }
      
      // Refresh orders and analytics to update the dashboard
      dispatch(fetchOrders());
      dispatch(fetchAnalytics());
      
      toast({
        title: "Order Declined",
        description: `Order has been declined and customer has been notified.`,
      });
      
      console.log("📧 User notification:", result.notification);
      console.log("💰 Order declined, refreshing orders and analytics for revenue update");
      setDeclineDialogOpen(false);
      setDeclineReason("");
      setOrderToDecline(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openDeclineDialog = (orderId: string) => {
    setOrderToDecline(orderId);
    setDeclineDialogOpen(true);
  };

  const OrderDrawer = () => (
    <Sheet open={drawerOpen} onOpenChange={(o) => { if (!o) setDrawerOpen(false); }}>
      <SheetContent side="right" className="min-w-[380px] sm:min-w-[520px]">
        <SheetHeader>
          <SheetTitle>{drawerMode === "edit" ? "Edit Order" : "Order Details"}</SheetTitle>
          <SheetDescription>
            {drawerMode === "edit" ? "Update the order status." : "Full details for the selected order."}
          </SheetDescription>
        </SheetHeader>

        {!selectedOrder ? (
          <div className="py-10 text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Order ID</Label>
                <p className="mt-1 font-medium">{selectedOrder._id || selectedOrder.id}</p>
              </div>
              <div>
                <Label className="text-sm">Order Number</Label>
                <p className="mt-1 font-medium">{selectedOrder.orderNumber || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-sm">Created</Label>
                <p className="mt-1 text-muted-foreground">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm">Payment Method</Label>
                <p className="mt-1 text-muted-foreground">{selectedOrder.paymentMethod}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm">Shipping Address</Label>
              <div className="mt-1 space-y-1">
                <p className="font-medium">
                  {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                </p>
                {selectedOrder.shippingAddress?.phone && (
                  <p className="text-muted-foreground">{selectedOrder.shippingAddress.phone}</p>
                )}
                <div className="text-muted-foreground">
                  <p>{selectedOrder.shippingAddress?.street}</p>
                  <p>
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                  </p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm">Items</Label>
              <div className="mt-2 border rounded-lg divide-y">
                {selectedOrder.items?.map((it, index) => (
                  <div key={it.product || index} className="flex items-center justify-between p-3 text-sm">
                    <div className="flex items-center flex-1">
                      {it.image && (
                        <img 
                          src={it.image} 
                          alt={it.name}
                          className="w-12 h-12 object-cover rounded mr-3"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      )}
                      <div>
                        <p className="font-medium">{it.name}</p>
                        {it.brand && <p className="text-muted-foreground text-xs">{it.brand}</p>}
                        <p className="text-muted-foreground text-xs">Rs:{it.price}</p>
                      </div>
                    </div>
                    <div className="w-24 text-right">Qty: {it.quantity}</div>
                    <div className="w-28 text-right font-medium">Rs:{(it.price * it.quantity).toFixed(2)}</div>
                  </div>
                )) || <p className="p-3 text-muted-foreground">No items found</p>}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div>
              <Label className="text-sm">Order Summary</Label>
              <div className="mt-2 border rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rs:{selectedOrder.pricing?.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>Rs:{selectedOrder.pricing?.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Rs:{selectedOrder.pricing?.shipping?.toFixed(2) || '0.00'}</span>
                </div>
                {selectedOrder.pricing?.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-Rs:{selectedOrder.pricing.discount.toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total:</span>
                  <span>Rs:{selectedOrder.pricing?.total?.toFixed(2) || selectedOrder.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Payment Status</Label>
                <div className="mt-1">
                  <Badge className={selectedOrder.paymentStatus === 'paid' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
              </div>
              {selectedOrder.trackingNumber && (
                <div>
                  <Label className="text-sm">Tracking Number</Label>
                  <p className="mt-1 font-mono text-sm">{selectedOrder.trackingNumber}</p>
                </div>
              )}
            </div>

            {selectedOrder.notes && (
              <div>
                <Label className="text-sm">Notes</Label>
                <p className="mt-1 text-muted-foreground text-sm">{selectedOrder.notes}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm">Status</Label>
                {drawerMode === "edit" ? (
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(val: Order["status"]) => handleSaveStatus(selectedOrder._id || selectedOrder.id, val)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          {drawerMode === "edit" && (
            <Button className="bg-gradient-orange text-white" disabled={saving}>
              {saving ? "Saving..." : "Saved"}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  if (status === "loading") {
    return (
      <Card className="card-elegant p-8 flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Loading orders...
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="card-elegant p-8 text-center text-muted-foreground">No orders found</Card>
    );
  }

  return (
    <Card className="card-elegant">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o._id || o.id}>
              <TableCell className="font-medium cursor-pointer hover:underline" onClick={() => openDrawer(o._id || o.id, "view")}>
                {o.orderNumber || o._id || o.id}
              </TableCell>
              <TableCell>
                {o.shippingAddress ? `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}` : o.customerName || 'N/A'}
              </TableCell>
              <TableCell>Rs:{Number(o.pricing?.total || o.total || 0).toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(o.status)}>{o.status}</Badge>
              </TableCell>
              <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {o.status === 'pending' && (
                      <>
                        <DropdownMenuItem 
                          onClick={() => handleAcceptOrder(o._id || o.id)}
                          className="text-green-600 focus:text-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Accept Order
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeclineDialog(o._id || o.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Decline Order
                        </DropdownMenuItem>
                        <hr className="my-1" />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => openDrawer(o._id || o.id, "view")}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDrawer(o._id || o.id, "edit")}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => dispatch(patchOrderStatus({ id: o._id || o.id, status: "pending" }))}>
                      <Clock className="mr-2 h-4 w-4" /> Mark Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => dispatch(patchOrderStatus({ id: o._id || o.id, status: "confirmed" }))}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Mark Confirmed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => dispatch(patchOrderStatus({ id: o._id || o.id, status: "shipped" }))}>
                      <Truck className="mr-2 h-4 w-4" /> Mark Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => dispatch(patchOrderStatus({ id: o._id || o.id, status: "delivered" }))}>
                      <PackageCheck className="mr-2 h-4 w-4" /> Mark Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => dispatch(patchOrderStatus({ id: o._id || o.id, status: "cancelled" }))}>
                      <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => dispatch(deleteOrder(o._id || o.id))}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Drawer for View/Edit */}
      <OrderDrawer />

      {/* Decline Order Dialog */}
      <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this order. The customer will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="decline-reason">Reason for declining</Label>
              <Textarea
                id="decline-reason"
                placeholder="Enter reason for declining the order..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeclineDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeclineOrder}
              disabled={!declineReason.trim()}
            >
              Decline Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default OrdersTable;