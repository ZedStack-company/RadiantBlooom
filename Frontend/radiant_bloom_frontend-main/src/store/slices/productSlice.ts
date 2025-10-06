import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { Product, ProductFormData } from "@/types";
import { loadState, saveState, STORAGE_KEYS } from "@/utils/localStorage";
import { productService } from "@/services/productService";

interface ProductsState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductsState = {
  items: loadState<Product[]>(STORAGE_KEYS.PRODUCTS, []),
  status: "idle",
  error: null,
};

const generateId = (): string =>
  "prod_" + Math.random().toString(36).substr(2, 9);

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts();
      return response.products;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch products");
    }
  }
);

export const createProduct = createAsyncThunk<Product, ProductFormData, { rejectValue: string }>(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const newProduct = await productService.createProduct(productData);
      return newProduct;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk<Product, Product, { rejectValue: string }>(
  "products/updateProduct",
  async (product, { rejectWithValue }) => {
    try {
      const updatedProduct = await productService.updateProduct(product.id, product);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk<string, string, { rejectValue: string }>(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
      saveState(STORAGE_KEYS.PRODUCTS, []);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.status = "succeeded";
        saveState(STORAGE_KEYS.PRODUCTS, state.items);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch products";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        if (!Array.isArray(state.items)) state.items = [];
        state.items.push(action.payload);
        saveState(STORAGE_KEYS.PRODUCTS, state.items);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        saveState(STORAGE_KEYS.PRODUCTS, state.items);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        saveState(STORAGE_KEYS.PRODUCTS, state.items);
      });
  },
});

export const { clearProducts } = productSlice.actions;

export const selectProductsState = (state: { products: ProductsState }) => state.products;

export const selectAllProducts = createSelector(
  [selectProductsState],
  (productsState) => (Array.isArray(productsState.items) ? productsState.items : [])
);

export const selectProductById = (state: { products: ProductsState }, productId: string) =>
  state.products.items.find((product) => product.id === productId);

export const selectProductsByCategory = (category: string) =>
  createSelector([selectAllProducts], (products) =>
    products.filter((product) => product.category === category)
  );

export const selectProductsStatus = (state: { products: ProductsState }) => ({
  status: state.products.status,
  error: state.products.error,
});

export default productSlice.reducer;
