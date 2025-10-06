import { createSlice, createAsyncThunk, createSelector, PayloadAction } from "@reduxjs/toolkit";

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  status: "active" | "inactive";
  createdAt: string;
}

interface CustomersState {
  items: Customer[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Mock data used until backend is connected
const mockCustomers: Customer[] = [
  { id: "c1", name: "Sarah Johnson", email: "sarah@email.com", orders: 12, spent: 1247.5, status: "active", createdAt: new Date().toISOString() },
  { id: "c2", name: "Mike Chen", email: "mike@email.com", orders: 8, spent: 892.25, status: "active", createdAt: new Date().toISOString() },
  { id: "c3", name: "Emma Davis", email: "emma@email.com", orders: 15, spent: 1567.8, status: "active", createdAt: new Date().toISOString() },
  { id: "c4", name: "John Smith", email: "john@email.com", orders: 3, spent: 234.75, status: "inactive", createdAt: new Date().toISOString() },
  { id: "c5", name: "Lisa Brown", email: "lisa@email.com", orders: 6, spent: 445.99, status: "active", createdAt: new Date().toISOString() },
];

const initialState: CustomersState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchCustomers = createAsyncThunk<Customer[], void>(
  "customers/fetchCustomers",
  async () => {
    // Replace with real API call later, e.g.:
    // const res = await fetch("/api/customers");
    // if (!res.ok) throw new Error("Failed to fetch customers");
    // return (await res.json()) as Customer[];
    // Using mock for now
    return mockCustomers;
  }
);

export const createCustomer = createAsyncThunk<Customer, Omit<Customer, "id" | "createdAt">>(
  "customers/createCustomer",
  async (payload) => {
    // Replace with real API call later, e.g.:
    // const res = await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    // if (!res.ok) throw new Error("Failed to create customer");
    // return (await res.json()) as Customer;
    // Mock behavior for now
    const created: Customer = {
      ...payload,
      id: "c_" + Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString(),
    };
    return created;
  }
);

export const updateCustomer = createAsyncThunk<Customer, Customer>(
  "customers/updateCustomer",
  async (customer) => {
    // Replace with real API call later, e.g.:
    // const res = await fetch(`/api/customers/${customer.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(customer) });
    // if (!res.ok) throw new Error("Failed to update customer");
    // return (await res.json()) as Customer;
    // Mock echo update for now
    return customer;
  }
);

export const deleteCustomer = createAsyncThunk<string, string>(
  "customers/deleteCustomer",
  async (id) => {
    // Replace with real API call later, e.g.:
    // const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    // if (!res.ok) throw new Error("Failed to delete customer");
    // return id;
    return id;
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.items = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.status = "succeeded";
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to fetch customers";
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setCustomers } = customersSlice.actions;
export default customersSlice.reducer;

// Selectors
export const selectCustomersState = (state: any) => state.customers as CustomersState;
export const selectAllCustomers = createSelector([selectCustomersState], (s) => s.items);
export const selectCustomersStatus = createSelector([selectCustomersState], (s) => s.status);
export const selectCustomersByQuery = (query: string) =>
  createSelector([selectAllCustomers], (customers) => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });
