import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2, MoreHorizontal, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { useEffect, useMemo, useState } from "react";
import { selectAllCustomers, fetchCustomers, selectCustomersStatus, selectCustomersByQuery, deleteCustomer, updateCustomer, type Customer } from "@/store/slices/customersSlice";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "inactive": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

type DrawerMode = "view" | "edit";

interface CustomerDrawerProps {
  open: boolean;
  mode: DrawerMode;
  customer: Customer | null;
  onClose: () => void;
  onSave: (updated: Customer) => Promise<void>;
  saving: boolean;
}

const CustomerDrawer = ({ open, mode, customer, onClose, onSave, saving }: CustomerDrawerProps) => {
  const [local, setLocal] = useState<Customer | null>(customer);

  useEffect(() => {
    setLocal(customer);
  }, [customer]);

  const isEdit = mode === "edit";

  const handleSubmit = async () => {
    if (!local) return;
    try {
      await onSave(local);
      toast.success("Customer updated successfully");
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update customer";
      toast.error(msg);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="min-w-[380px] sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Customer" : "Customer Details"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Update customer information and save changes." : "Full profile and stats for this customer."}
          </SheetDescription>
        </SheetHeader>

        {!customer ? (
          <div className="py-10 text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="mt-6 space-y-4">
            {/* Name */}
            <div>
              <Label className="text-sm">Name</Label>
              {isEdit ? (
                <Input
                  value={local?.name || ""}
                  onChange={(e) => setLocal((prev) => prev ? { ...prev, name: e.target.value } : prev)}
                />
              ) : (
                <p className="mt-1 font-medium">{customer.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className="text-sm">Email</Label>
              {isEdit ? (
                <Input
                  type="email"
                  value={local?.email || ""}
                  onChange={(e) => setLocal((prev) => prev ? { ...prev, email: e.target.value } : prev)}
                />
              ) : (
                <p className="mt-1 text-blue-600 hover:underline"><a href={`mailto:${customer.email}`}>{customer.email}</a></p>
              )}
            </div>

            {/* Status */}
            <div>
              <Label className="text-sm">Status</Label>
              {isEdit ? (
                <Select
                  value={local?.status || "active"}
                  onValueChange={(val: Customer["status"]) => setLocal((prev) => prev ? { ...prev, status: val } : prev)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                </div>
              )}
            </div>

            {/* Orders */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Orders</Label>
                {isEdit ? (
                  <Input
                    type="number"
                    value={local?.orders ?? 0}
                    onChange={(e) => setLocal((prev) => prev ? { ...prev, orders: Number(e.target.value) || 0 } : prev)}
                  />
                ) : (
                  <p className="mt-1">{customer.orders}</p>
                )}
              </div>
              <div>
                <Label className="text-sm">Total Spent</Label>
                {isEdit ? (
                  <Input
                    type="number"
                    value={local?.spent ?? 0}
                    onChange={(e) => setLocal((prev) => prev ? { ...prev, spent: Number(e.target.value) || 0 } : prev)}
                  />
                ) : (
                  <p className="mt-1">Rs:{Number(customer.spent).toFixed(2)}</p>
                )}
              </div>
            </div>

            {/* Created At */}
            <div>
              <Label className="text-sm">Created</Label>
              <p className="mt-1 text-muted-foreground">{new Date(customer.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}

        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          {isEdit && (
            <Button className="bg-gradient-orange text-white" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const CustomersTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectCustomersStatus);
  const [query, setQuery] = useState("");
  const filteredSelector = selectCustomersByQuery(query);
  const customers = useSelector((s: RootState) => filteredSelector(s));

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("view");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedCustomer = useMemo(() => {
    if (!selectedId) return null;
    const all = customers || [];
    return all.find((c) => c.id === selectedId) || null;
  }, [selectedId, customers]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCustomers());
    }
  }, [dispatch, status]);

  const handleDeactivate = (id: string) => {
    const c = customers.find((x) => x.id === id);
    if (!c) return;
    dispatch(updateCustomer({ ...c, status: c.status === "active" ? "inactive" : "active" }));
  };

  const openDrawer = (id: string, mode: DrawerMode) => {
    setSelectedId(id);
    setDrawerMode(mode);
    setDrawerOpen(true);
  };

  const handleSave = async (updated: Customer) => {
    setSaving(true);
    try {
      await dispatch(updateCustomer(updated)).unwrap();
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <Card className="card-elegant p-8 flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Loading customers...
      </Card>
    );
  }

  return (
    <Card className="card-elegant">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-4">Customer Management</h2>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {(!customers || customers.length === 0) ? (
        <div className="p-6 text-center text-muted-foreground">No customers found</div>
      ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium cursor-pointer hover:underline" onClick={() => openDrawer(c.id, "view")}>{c.name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.orders}</TableCell>
              <TableCell>Rs:{Number(c.spent).toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(c.status)}>{c.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openDrawer(c.id, "view")}>
                      <Eye className="mr-2 h-4 w-4" /> View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDrawer(c.id, "edit")}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => dispatch(deleteCustomer(c.id))}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}

      {/* Drawer for View/Edit */}
      <CustomerDrawer
        open={drawerOpen}
        mode={drawerMode}
        customer={selectedCustomer}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        saving={saving}
      />
    </Card>
  );
};

export default CustomersTable;
