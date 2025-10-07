import { Product } from "@/types";
import { API_BASE_URL } from '@/config/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed');
  }
  
  return data;
};

// Helper function to get headers with auth
const getHeaders = (includeAuth: boolean = true) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const productService = {
  async getProducts(params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    isBestseller?: boolean;
    isNew?: boolean;
    isFeatured?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    const data = await handleApiResponse(response);
    return data.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    const data = await handleApiResponse(response);
    return data.data.product;
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    const data = await handleApiResponse(response);
    return data.data.product;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    const data = await handleApiResponse(response);
    return data.data.product;
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleApiResponse(response);
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/featured`);
    const data = await handleApiResponse(response);
    return data.data.products;
  },

  async getBestsellerProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/bestsellers`);
    const data = await handleApiResponse(response);
    return data.data.products;
  },
};
