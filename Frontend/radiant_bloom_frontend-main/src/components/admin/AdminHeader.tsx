import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  Shield,
  Menu,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories, products } from "@/data/mockData";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(
    [
      { id: "n1", title: "New order #1024", time: "2m ago", read: false },
      { id: "n2", title: "Low stock: Lipstick", time: "1h ago", read: false },
      { id: "n3", title: "New review on Serum", time: "3h ago", read: true },
    ] as { id: string; title: string; time: string; read: boolean }[]
  );

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [] as Array<{ label: string; href: string }>;
    const q = searchQuery.toLowerCase();
    const cat = categories
      .filter((c) => c.name.toLowerCase().includes(q))
      .map((c) => ({ label: `Category: ${c.name}`, href: `/category/${c.id}` }));
    const prods = products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((p) => ({ label: `Product: ${p.name}`, href: `/product/${p.id}` }));
    return [...cat.slice(0, 3), ...prods];
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Placeholder: navigate to a generic search page or admin query
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    // Placeholder for navigation based on notification type
    // e.g., navigate(`/admin/orders/1024`)
  };

  const markAllAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const signOut = () => {
    // Placeholder sign-out handler
    console.log("Sign out clicked");
    navigate("/login");
  };

  return (
    <header className="bg-card border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-orange flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-navy">
                BeautyStore Admin
              </span>
            </Link>
          </div>

          

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products, categories..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              {searchQuery && (
                <div className="absolute top-full mt-1 w-full bg-background border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                  {suggestions.length > 0 ? (
                    suggestions.map((s, idx) => (
                      <Link
                        key={idx}
                        to={s.href}
                        className="block px-3 py-2 text-sm hover:bg-muted/40"
                        onClick={() => setSearchQuery("")}
                      >
                        {s.label}
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
                  )}
                </div>
              )}
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full p-0 flex items-center justify-center bg-secondary text-white text-[10px]">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>Mark all as read</Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {notifications.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <DropdownMenuItem key={n.id} className="flex items-start gap-2" onSelect={(e) => { e.preventDefault(); handleNotificationClick(n.id); }}>
                        <span className={`mt-1 h-2 w-2 rounded-full ${n.read ? "bg-muted" : "bg-secondary"}`} />
                        <div className="flex-1">
                          <div className="text-sm">{n.title}</div>
                          <div className="text-xs text-muted-foreground">{n.time}</div>
                        </div>
                        {!n.read && <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleNotificationClick(n.id); }}>Mark read</Button>}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Store */}
            <Link to="/">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                <Home className="h-4 w-4" />
                View Store
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-orange flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="hidden md:inline font-medium">Admin User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@beautystore.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/admin?tab=profile") }>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate("/admin?tab=settings") }>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onSelect={(e) => { e.preventDefault(); signOut(); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="mt-4 space-y-4">
                  {/* Mobile Search */}
                  <form onSubmit={(e) => { handleSearchSubmit(e); setMobileOpen(false); }} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products, categories..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>

                  {/* Quick Links */}
                  <nav className="grid gap-2">
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-2 py-2 rounded-md hover:bg-muted/50">Dashboard</Link>
                    <Link to="/products" onClick={() => setMobileOpen(false)} className="px-2 py-2 rounded-md hover:bg-muted/50">Products</Link>
                    <Link to="/orders" onClick={() => setMobileOpen(false)} className="px-2 py-2 rounded-md hover:bg-muted/50">Orders</Link>
                    <Link to="/analytics" onClick={() => setMobileOpen(false)} className="px-2 py-2 rounded-md hover:bg-muted/50">Analytics</Link>
                    <Link to="/" onClick={() => setMobileOpen(false)} className="px-2 py-2 rounded-md hover:bg-muted/50 flex items-center gap-2"><Home className="h-4 w-4" /> View Store</Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;