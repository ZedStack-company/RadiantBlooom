import { getValidToken } from '@/utils/tokenValidation';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return getValidToken();
};

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.error?.message || 'API request failed';
    const errorCode = data.error?.code;
    
    // Create a more detailed error for authentication issues
    if (response.status === 401 || errorCode === 'NO_TOKEN' || errorCode === 'INVALID_TOKEN' || errorCode === 'TOKEN_EXPIRED') {
      const authError = new Error(`Authentication failed: ${errorMessage}`);
      (authError as any).isAuthError = true;
      (authError as any).statusCode = response.status;
      throw authError;
    }
    
    const error = new Error(errorMessage);
    (error as any).statusCode = response.status;
    throw error;
  }
  
  return data;
};

// Helper function to get headers with auth
const getHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export interface SalesPoint {
  date: string;
  total: number;
}

export interface TopProductItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  sales: number;
}

export interface AnalyticsData {
  sales: SalesPoint[];
  topProducts: TopProductItem[];
}

export const analyticsService = {
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      // Try to get real analytics data from backend
      const response = await fetch(`${API_BASE_URL}/analytics`, {
        headers: getHeaders(),
      });
      
      if (response.ok) {
        const data = await handleApiResponse(response);
        return data.data;
      }
    } catch (error) {
      console.warn('Failed to fetch analytics from backend, using calculated data:', error);
    }

    // Fallback: Calculate analytics from existing data
    return this.calculateAnalyticsFromOrders();
  },

  async calculateAnalyticsFromOrders(): Promise<AnalyticsData> {
    try {
      // Get orders data
      const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin`, {
        headers: getHeaders(),
      });
      
      const ordersData = await handleApiResponse(ordersResponse);
      const orders = ordersData.data.orders || [];

      // Get products data
      const productsResponse = await fetch(`${API_BASE_URL}/products`, {
        headers: getHeaders(),
      });
      
      const productsData = await handleApiResponse(productsResponse);
      const products = productsData.data.products || [];

      // Calculate sales over time (last 12 days)
      const sales: SalesPoint[] = [];
      const today = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = orders.filter((order: any) => {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === dateStr && (order.status === 'confirmed' || order.status === 'delivered' || order.paymentStatus === 'paid');
        });
        
        const dayTotal = dayOrders.reduce((sum: number, order: any) => {
          return sum + (order.pricing?.total || order.total || 0);
        }, 0);
        
        sales.push({
          date: date.toISOString(),
          total: dayTotal
        });
      }

      // Calculate top products by sales
      const productSales: { [key: string]: { product: any; totalSales: number; quantity: number } } = {};
      
      orders.forEach((order: any) => {
        if (order.status === 'confirmed' || order.status === 'delivered' || order.paymentStatus === 'paid') {
          order.items?.forEach((item: any) => {
            const productId = item.product;
            if (!productSales[productId]) {
              const product = products.find((p: any) => p._id === productId);
              productSales[productId] = {
                product: product || { name: item.name, brand: item.brand, price: item.price },
                totalSales: 0,
                quantity: 0
              };
            }
            productSales[productId].totalSales += (item.price * item.quantity);
            productSales[productId].quantity += item.quantity;
          });
        }
      });

      // Convert to top products array and sort by quantity sold
      const topProducts: TopProductItem[] = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map((item, index) => ({
          id: item.product._id || `product-${index}`,
          name: item.product.name || 'Unknown Product',
          brand: item.product.brand || 'Unknown Brand',
          price: item.product.price || 0,
          sales: item.quantity
        }));

      return { sales, topProducts };
    } catch (error) {
      console.error('Failed to calculate analytics:', error);
      
      // Final fallback to mock data with Rs: prices
      const mockSales: SalesPoint[] = Array.from({ length: 12 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (11 - i));
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

      return { sales: mockSales, topProducts: mockTopProducts };
    }
  }
};
