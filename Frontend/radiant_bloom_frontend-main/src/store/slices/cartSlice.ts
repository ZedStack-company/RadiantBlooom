import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  wishlist: Product[];
}

const normalizeProduct = (p: Product): Product => ({
  ...p,
  // Ensure arrays are well-formed
  image: Array.isArray((p as any).image)
    ? ((p as any).image as string[])
    : ((p as any).image ? [String((p as any).image)] : []),
  features: Array.isArray((p as any).features)
    ? ((p as any).features as string[])
    : [],
  // Coerce numeric fields
  price: Number((p as any).price) || 0,
  originalPrice:
    (p as any).originalPrice !== undefined && (p as any).originalPrice !== null
      ? Number((p as any).originalPrice)
      : undefined,
  // Keep timestamps if present, otherwise set sane defaults
  createdAt: (p as any).createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const initialState: CartState = {
  cart: (JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[]).map((i) => ({
    ...i,
    ...normalizeProduct(i),
    quantity: Math.max(1, Number((i as any).quantity) || 1),
  })),
  wishlist: (JSON.parse(localStorage.getItem("wishlist") || "[]") as Product[]).map(normalizeProduct),
};

const saveCartToLocalStorage = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const saveWishlistToLocalStorage = (wishlist: Product[]) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

const mergeTwoCarts = (a: CartItem[], b: CartItem[]): CartItem[] => {
  const map = new Map<string, CartItem>();
  const add = (arr: CartItem[]) => {
    for (const item of arr) {
      const key = item.id;
      const existing = map.get(key);
      if (existing) {
        map.set(key, { ...existing, quantity: Math.max(1, (existing.quantity || 1) + (Number(item.quantity) || 1)) });
      } else {
        map.set(key, { ...item, quantity: Math.max(1, Number(item.quantity) || 1) });
      }
    }
  };
  add(a);
  add(b);
  return Array.from(map.values());
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Cart actions
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      console.log("🛒 Cart Slice: addToCart action received", action.payload);
      const prod = normalizeProduct(action.payload.product);
      console.log("🛒 Cart Slice: normalized product", prod);
      const exists = state.cart.find((i) => i.id === prod.id);
      const maxQuantity = 50; // Maximum quantity per item
      
      if (exists) {
        const newQuantity = exists.quantity + (action.payload.quantity || 1);
        exists.quantity = Math.min(newQuantity, maxQuantity); // Cap at max quantity
        console.log("🛒 Cart Slice: updated existing item quantity", exists.quantity);
      } else {
        const initialQuantity = Math.min(action.payload.quantity || 1, maxQuantity);
        state.cart.push({ ...prod, quantity: initialQuantity });
        console.log("🛒 Cart Slice: added new item to cart");
      }
      console.log("🛒 Cart Slice: current cart", state.cart);
      saveCartToLocalStorage(state.cart);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((i) => i.id !== action.payload);
      saveCartToLocalStorage(state.cart);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.cart.find((i) => i.id === action.payload.id);
      const maxQuantity = 50; // Maximum quantity per item
      if (item) item.quantity = Math.max(1, Math.min(action.payload.quantity, maxQuantity));
      saveCartToLocalStorage(state.cart);
    },
    clearCart: (state) => {
      state.cart = [];
      saveCartToLocalStorage(state.cart);
    },
    // ✅ Replace cart entirely (used during login merge)
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      const normalized = (action.payload || []).map((i) => ({ ...normalizeProduct(i), quantity: Math.max(1, Number((i as any).quantity) || 1) }));
      state.cart = normalized;
      saveCartToLocalStorage(state.cart);
    },
    // ✅ Merge provided items into cart (sum quantities by id)
    mergeCart: (state, action: PayloadAction<CartItem[]>) => {
      const normalizedIncoming = (action.payload || []).map((i) => ({ ...normalizeProduct(i), quantity: Math.max(1, Number((i as any).quantity) || 1) }));
      state.cart = mergeTwoCarts(state.cart, normalizedIncoming);
      saveCartToLocalStorage(state.cart);
    },

    // ✅ Wishlist actions
    // Adds to wishlist only if not already present (idempotent add)
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const prod = normalizeProduct(action.payload);
      const exists = state.wishlist.find((i) => i.id === prod.id);
      if (!exists) {
        state.wishlist.push(prod);
        saveWishlistToLocalStorage(state.wishlist);
      } else {
        // Still persist to ensure normalization is saved if shapes changed
        saveWishlistToLocalStorage(state.wishlist);
      }
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.wishlist.find((i) => i.id === action.payload.id);
      if (exists) {
        state.wishlist = state.wishlist.filter((i) => i.id !== action.payload.id);
      } else {
        state.wishlist.push(action.payload);
      }
      saveWishlistToLocalStorage(state.wishlist);
    },
    clearWishlist: (state) => {
      state.wishlist = [];
      saveWishlistToLocalStorage(state.wishlist);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCart,
  mergeCart,
  addToWishlist,
  toggleWishlist,
  clearWishlist,
} = cartSlice.actions;
export default cartSlice.reducer;
