import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchCategories, selectAllCategories } from "@/store/slices/categorySlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cartCount = useSelector((state: RootState) => state.cart.cart.length);
  const favoritesCount = useSelector((state: RootState) => state.cart.wishlist.length);
  const categories = useSelector(selectAllCategories);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("");
  const maskedEmail = useMemo(() => (userEmail ? `${userEmail.slice(0, 2)}...` : ""), [userEmail]);
  const adminInitial = useMemo(() => (adminName ? adminName.charAt(0).toUpperCase() : "A"), [adminName]);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Derive login state from storage (UI-only; ready to swap with real auth later)
  useEffect(() => {
    const derive = () => {
      let email = "";
      let admin = false;
      let name = "";
      try {
        const direct = localStorage.getItem("currentUserEmail");
        if (direct && direct.trim()) email = direct.trim();
      } catch {}
      if (!email) {
        try {
          const u = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
          if (u) {
            const parsed = JSON.parse(u) as { email?: string; role?: string; firstName?: string; lastName?: string };
            if (parsed?.email) email = parsed.email;
            if (parsed?.role === 'admin') admin = true;
            if (parsed?.firstName) name = parsed.firstName;
          }
        } catch {}
      }
      // Also check user data from auth context
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          if (user.email) email = user.email;
          if (user.role === 'admin') admin = true;
          if (user.firstName) name = user.firstName;
        }
      } catch {}
      setIsLoggedIn(!!email);
      setUserEmail(email);
      setIsAdmin(admin);
      setAdminName(name);
    };
    derive();
    // Listen to storage changes across tabs
    const onStorage = () => derive();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const navItems = [
    ...categories.map(category => ({
      name: category.name,
      href: `/category/${category.id}`,
      isRoute: true
    })),
    { name: "Sale", href: "/category/sale", isRoute: true, highlight: true },
  ];

  // ✅ Filter suggestions
  const suggestions = searchQuery
    ? categories.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // ✅ Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      {/* Top Banner */}
      <div className="bg-gradient-orange text-white text-center py-2 text-sm font-medium">
        Free shipping on orders over Rs:50 • Use code: BEAUTY20 for 20% off
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold text-gradient-orange">
                Radiant Bloom
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors hover:text-secondary ${
                    item.highlight
                      ? "text-secondary font-semibold"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors hover:text-secondary ${
                    item.highlight
                      ? "text-secondary font-semibold"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {item.name}
                </a>
              )
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-0 focus:bg-background"
                />
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {searchQuery && suggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {suggestions.slice(0, 6).map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted/50"
                    onClick={() => setSearchQuery("")}
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            )}

            {/* No results */}
            {searchQuery && suggestions.length === 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border border-border rounded-lg shadow-lg z-50">
                <p className="px-4 py-2 text-sm text-muted-foreground">
                  No products found
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link to="/favorites">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  {isAdmin ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                            {adminInitial}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Admin: {adminName || "Administrator"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <>
                      <User className="h-5 w-5" />
                      {isLoggedIn && (
                        <span className="hidden md:inline text-sm max-w-[80px]">{maskedEmail}</span>
                      )}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAdmin ? (
                  <>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin")}
                      className="text-orange-600 font-medium"
                    >
                      🛠️ Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/orders")}
                    >
                      📋 View Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/profile")}
                    >
                      👤 Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        try {
                          localStorage.removeItem("currentUserEmail");
                          localStorage.removeItem("currentUser");
                          localStorage.removeItem("user");
                          localStorage.removeItem("token");
                          sessionStorage.removeItem("currentUser");
                        } catch {}
                        setIsLoggedIn(false);
                        setUserEmail("");
                        setIsAdmin(false);
                        navigate("/");
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : isLoggedIn ? (
                  <>
                    <DropdownMenuItem
                      onClick={() => navigate("/orders")}
                    >
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        try {
                          localStorage.removeItem("currentUserEmail");
                          localStorage.removeItem("currentUser");
                          localStorage.removeItem("user");
                          localStorage.removeItem("token");
                          sessionStorage.removeItem("currentUser");
                        } catch {}
                        setIsLoggedIn(false);
                        setUserEmail("");
                        setIsAdmin(false);
                        navigate("/");
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate("/login")}>Login</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border/50">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-0"
                />
              </div>

              {/* Mobile Suggestions */}
              {searchQuery && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {suggestions.slice(0, 6).map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted/50"
                      onClick={() => {
                        setSearchQuery("");
                        setIsMenuOpen(false);
                      }}
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              )}

              {searchQuery && suggestions.length === 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-border rounded-lg shadow-lg z-50">
                  <p className="px-4 py-2 text-sm text-muted-foreground">
                    No products found
                  </p>
                </div>
              )}
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-3">
              {navItems.map((item) =>
                item.isRoute ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block font-medium py-2 transition-colors ${
                      item.highlight
                        ? "text-secondary font-semibold"
                        : "text-foreground/80 hover:text-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block font-medium py-2 transition-colors ${
                      item.highlight
                        ? "text-secondary font-semibold"
                        : "text-foreground/80 hover:text-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                )
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
