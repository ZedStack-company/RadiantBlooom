import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { analyticsService } from "@/services/analyticsService";

export interface SalesPoint {
  date: string; // ISO date
  total: number; // daily revenue or orders count
}

export interface TopProductItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  sales: number; // units sold in period
}

interface AnalyticsState {
  sales: SalesPoint[];
  topProducts: TopProductItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AnalyticsState = {
  sales: [],
  topProducts: [],
  status: "idle",
  error: null,
};

// Mock data for local functionality
const mockSales: SalesPoint[] = Array.from({ length: 12 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (11 - i));
  // generate a nice curve
  const base = 50 + Math.round(20 * Math.sin((i / 12) * Math.PI * 2));
  const noise = Math.round(Math.random() * 15);
  return { date: d.toISOString(), total: base + noise };
});

const mockTopProducts: TopProductItem[] = [
  { id: "p1", name: "Radiant Glow Serum", brand: "RadiantBloom", price: 4999, sales: 312 },
  { id: "p2", name: "Velvet Matte Lipstick", brand: "RadiantBloom", price: 1999, sales: 275 },
  { id: "p3", name: "Hydra Boost Moisturizer", brand: "AquaCare", price: 2999, sales: 241 },
  { id: "p4", name: "Silk Hair Oil", brand: "Silka", price: 2450, sales: 190 },
  { id: "p5", name: "Ocean Breeze Fragrance", brand: "Aroma", price: 5900, sales: 158 },
];

export const fetchAnalytics = createAsyncThunk<{ sales: SalesPoint[]; topProducts: TopProductItem[] }, void>(
  "analytics/fetch",
  async () => {
    try {
      // Use dynamic analytics service
      const analyticsData = await analyticsService.getAnalytics();
      return analyticsData;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Fallback to mock data if service fails
      return { sales: mockSales, topProducts: mockTopProducts };
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.sales = action.payload.sales;
        state.topProducts = action.payload.topProducts;
        state.status = "succeeded";
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to fetch analytics";
      });
  },
});

export default analyticsSlice.reducer;

// Selectors
export const selectAnalyticsState = (s: any) => s.analytics as AnalyticsState;
export const selectSales = createSelector([selectAnalyticsState], (a) => a.sales);
export const selectTopProducts = createSelector([selectAnalyticsState], (a) => a.topProducts);
export const selectAnalyticsStatus = createSelector([selectAnalyticsState], (a) => a.status);
export const selectAnalyticsError = createSelector([selectAnalyticsState], (a) => a.error);
