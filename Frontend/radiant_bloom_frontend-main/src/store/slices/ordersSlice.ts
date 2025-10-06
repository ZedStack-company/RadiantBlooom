import { createSlice, PayloadAction, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService, Order, CreateOrderRequest } from "@/services/orderService";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

interface OrdersState {
  items: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  status: "idle",
  error: null,
};

// Types for API payloads
export type NewOrderPayload = CreateOrderRequest;

// ------------------------------
// Mock data for local testing
// ------------------------------
const mockOrders: Order[] = [
  {
    id: "o1001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@email.com",
    customerPhone: "+1 555-0100",
    shippingAddress: "123 Main St, Springfield, USA",
    items: [
      { id: "p1", name: "Radiant Glow Serum", price: 49.99, quantity: 1 },
      { id: "p2", name: "Velvet Matte Lipstick", price: 19.99, quantity: 2 },
    ],
    total: 49.99 + 19.99 * 2,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "o1002",
    customerName: "Mike Chen",
    customerEmail: "mike@email.com",
    customerPhone: "+1 555-0101",
    shippingAddress: "456 Oak Ave, Metropolis, USA",
    items: [
      { id: "p3", name: "Hydra Boost Moisturizer", price: 29.99, quantity: 1 },
      { id: "p4", name: "Silk Hair Oil", price: 24.5, quantity: 1 },
    ],
    total: 29.99 + 24.5,
    status: "paid",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "o1003",
    customerName: "Emma Davis",
    customerEmail: "emma@email.com",
    customerPhone: "+1 555-0102",
    shippingAddress: "789 Pine Rd, Gotham, USA",
    items: [
      { id: "p5", name: "Ocean Breeze Fragrance", price: 59.0, quantity: 1 },
    ],
    total: 59.0,
    status: "shipped",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.items = action.payload || [];
    },
    upsertOrder: (state, action: PayloadAction<Order>) => {
      const idx = state.items.findIndex((o) => o.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
    },
    clearOrders: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.status = "succeeded";
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to fetch orders";
      })
      // fetchMyOrders lifecycle
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.status = "succeeded";
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to fetch my orders";
      })
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        // Assume API returns the created Order with id/createdAt
        const created = action.payload;
        const idx = state.items.findIndex((o) => o.id === created.id);
        if (idx >= 0) state.items[idx] = created;
        else state.items.unshift(created);
        state.status = "succeeded";

        // Persist for guest users by email (frontend-only persistence)
        try {
          const email = (created.customerEmail || "").toLowerCase();
          if (email) {
            const key = `ordersByEmail:${email}`;
            const existingRaw = localStorage.getItem(key);
            const existing: Order[] = existingRaw ? JSON.parse(existingRaw) : [];
            // Deduplicate by id
            const updated = [created, ...existing.filter((o) => o.id !== created.id)];
            localStorage.setItem(key, JSON.stringify(updated));
          }
        } catch {}
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to create order";
      })
      .addCase(patchOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex((o) => o.id === updated.id);
        if (idx >= 0) state.items[idx] = updated;
        else state.items.unshift(updated);
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter((o) => o.id !== id);
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        const { order } = action.payload;
        const idx = state.items.findIndex((o) => o.id === order._id || o._id === order._id || o.id === order.id);
        if (idx >= 0) {
          state.items[idx] = { ...state.items[idx], ...order, id: order._id || order.id };
        }
      })
      .addCase(declineOrder.fulfilled, (state, action) => {
        const { order } = action.payload;
        const idx = state.items.findIndex((o) => o.id === order._id || o._id === order._id || o.id === order.id);
        if (idx >= 0) {
          state.items[idx] = { ...state.items[idx], ...order, id: order._id || order.id };
        }
      });
  },
});

export const { setOrders, upsertOrder, clearOrders } = ordersSlice.actions;

export default ordersSlice.reducer;

// Selectors
export const selectOrdersState = (state: any) => state.orders as OrdersState;
export const selectAllOrders = createSelector([selectOrdersState], (s) => s.items);
export const selectOrderById = (id: string) =>
  createSelector([selectAllOrders], (orders) => orders.find((o) => o.id === id));

// Async thunks with backend API integration
export const fetchOrders = createAsyncThunk<Order[], void>(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getAllOrders();
      return response.orders;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch orders");
    }
  }
);

// Load current user's orders from API
export const fetchMyOrders = createAsyncThunk<Order[], { email: string }>(
  "orders/fetchMyOrders",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await orderService.getUserOrders();
      return response.orders;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch user orders");
    }
  }
);

export const createOrder = createAsyncThunk<Order, NewOrderPayload>(
  "orders/createOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const order = await orderService.createOrder(payload);
      return order;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create order");
    }
  }
);

export const patchOrderStatus = createAsyncThunk<Order, { id: string; status: Order["status"] }>(
  "orders/patchOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const order = await orderService.updateOrderStatus(id, { status });
      return order;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update order status");
    }
  }
);

// Delete an order by id
export const deleteOrder = createAsyncThunk<void, string>(
  "orders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await orderService.cancelOrder(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete order");
    }
  }
);

export const acceptOrder = createAsyncThunk<{ order: Order; notification: any }, string>(
  "orders/acceptOrder",
  async (id, { rejectWithValue }) => {
    try {
      const result = await orderService.acceptOrder(id);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to accept order");
    }
  }
);

export const declineOrder = createAsyncThunk<{ order: Order; notification: any }, { id: string; reason?: string }>(
  "orders/declineOrder",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const result = await orderService.declineOrder(id, reason);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to decline order");
    }
  }
);

