import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Category } from "@/types";
import { categoryService } from "@/services/categoryService";

interface CategoriesState {
  items: Category[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch categories");
    }
  }
);

export const createCategory = createAsyncThunk<Category, Omit<Category, 'id'>, { rejectValue: string }>(
  "categories/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const newCategory = await categoryService.createCategory(categoryData);
      return newCategory;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create category");
    }
  }
);

export const updateCategory = createAsyncThunk<Category, Category, { rejectValue: string }>(
  "categories/updateCategory",
  async (category, { rejectWithValue }) => {
    try {
      const updatedCategory = await categoryService.updateCategory(category.id, category);
      return updatedCategory;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update category");
    }
  }
);

export const deleteCategory = createAsyncThunk<string, string, { rejectValue: string }>(
  "categories/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(categoryId);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete category");
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch categories";
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create category";
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update category";
      })
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(item => item.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete category";
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;

// Selectors
export const selectAllCategories = (state: { categories: CategoriesState }) => state.categories.items;
export const selectCategoriesStatus = (state: { categories: CategoriesState }) => state.categories.status;
export const selectCategoriesError = (state: { categories: CategoriesState }) => state.categories.error;
