import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import ordersReducer from "./slices/ordersSlice";
import customersReducer from "./slices/customersSlice";
import categoriesReducer from "./slices/categorySlice";
import { loadState, saveState, STORAGE_KEYS } from "@/utils/localStorage";
import analyticsReducer from "./slices/analyticsSlice";

const persistedProductsRaw = loadState(STORAGE_KEYS.PRODUCTS);
const normalizedPersistedProducts = Array.isArray(persistedProductsRaw)
  ? { items: persistedProductsRaw, status: "idle", error: null }
  : (persistedProductsRaw || { items: [], status: "idle", error: null });

// Preload orders from localStorage so order history persists
const persistedOrdersRaw = loadState(STORAGE_KEYS.ORDERS);
const normalizedPersistedOrders = Array.isArray(persistedOrdersRaw)
  ? { items: persistedOrdersRaw, status: "idle", error: null }
  : (persistedOrdersRaw || { items: [], status: "idle", error: null });

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    customers: customersReducer,
    categories: categoriesReducer,
    analytics: analyticsReducer,
  },
  preloadedState: {
    products: normalizedPersistedProducts,
    orders: normalizedPersistedOrders,
  },
});

store.subscribe(() => {
  saveState(STORAGE_KEYS.PRODUCTS, store.getState().products);
  // Persist cart and wishlist separately for resilience and simple retrieval in slices
  const cartState = store.getState().cart;
  try {
    localStorage.setItem("cart", JSON.stringify(cartState.cart));
    localStorage.setItem("wishlist", JSON.stringify(cartState.wishlist));

    // If a user is logged in, also mirror cart under a user-specific key to support merging
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser) as { email?: string } | null;
        if (u?.email) {
          const key = `radiant_bloom_cart_user_${u.email}`;
          localStorage.setItem(key, JSON.stringify(cartState.cart));
        }
      } catch {}
    }

    // Persist orders
    const ordersState = store.getState().orders;
    saveState(STORAGE_KEYS.ORDERS, ordersState.items);
  } catch (err) {
    console.warn("Failed to persist cart/wishlist:", err);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
