import React, { createContext, useContext, useState, ReactNode } from "react";
import store from "@/store/store";
import { setCart } from "@/store/slices/cartSlice";
import { authService, User } from "@/services/authService";

// Use User type from authService

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    // Only restore user if both user data and token exist
    if (savedUser && token) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return null;
      }
    }
    
    // Clear any orphaned data
    if (savedUser && !token) {
      localStorage.removeItem("user");
    }
    if (!savedUser && token) {
      localStorage.removeItem("token");
    }
    
    return null;
  });

  const preserveCurrentCartForUser = (email: string) => {
    try {
      const userKey = `radiant_bloom_cart_user_${email}`;
      const guestCartRaw = localStorage.getItem("cart");
      const guestCart = guestCartRaw ? JSON.parse(guestCartRaw) as any[] : [];

      // Only preserve the current session's cart (guest cart)
      // Do NOT merge with old user cart to avoid auto-adding old items
      console.log("🛒 Preserving current session cart only, not merging with old user cart");
      console.log("🛒 Current cart items:", guestCart.length);

      // Normalize the current cart items
      const normalizedCart = guestCart.map((item: any) => ({
        ...item,
        quantity: Math.max(1, Number(item.quantity) || 1)
      }));

      // Save the current cart as the user's cart (no merging with old data)
      localStorage.setItem("cart", JSON.stringify(normalizedCart));
      localStorage.setItem(userKey, JSON.stringify(normalizedCart));
      
      // Update Redux cart state with current cart only
      store.dispatch(setCart(normalizedCart as any));
      
      console.log("✅ Cart preserved for user:", email, "Items:", normalizedCart.length);
    } catch (e) {
      // Silent fail to avoid blocking auth
      console.warn("Cart preservation failed:", e);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      // Preserve current session cart for user (no auto-adding old items)
      if (email) preserveCurrentCartForUser(email);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await authService.register({ firstName, lastName, email, password });
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      // Preserve current session cart for new user (no auto-adding old items)
      if (email) preserveCurrentCartForUser(email);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Get user data before clearing it
      const userFromStorage = localStorage.getItem("user");
      let userEmail = null;
      
      if (userFromStorage) {
        try {
          const userData = JSON.parse(userFromStorage);
          userEmail = userData?.email;
        } catch (e) {
          console.warn("Failed to parse user data during logout:", e);
        }
      }
      
      // Clear user data
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      // Clear any user-specific cart data to prevent auto-merging on next login
      if (userEmail) {
        const userCartKey = `radiant_bloom_cart_user_${userEmail}`;
        localStorage.removeItem(userCartKey);
        console.log("🧹 Cleared old user cart data for:", userEmail);
      }
    }
  };

  // More robust authentication check
  const isAuthenticated = !!(user && localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
