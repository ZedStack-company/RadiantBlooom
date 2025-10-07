import { getValidToken } from '@/utils/tokenValidation';
import { API_BASE_URL } from '@/config/api';

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

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface OrderPricing {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  pricing: OrderPricing;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: Order['status'];
  trackingNumber?: string;
  notes?: string;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: Order['paymentStatus'];
}

export const orderService = {
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    const data = await handleApiResponse(response);
    return data.data.order;
  },

  async getUserOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE_URL}/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    const data = await handleApiResponse(response);
    return data.data;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getHeaders(),
    });
    const data = await handleApiResponse(response);
    return data.data.order;
  },

  async updateOrderStatus(id: string, statusData: UpdateOrderStatusRequest): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(statusData),
    });
    const data = await handleApiResponse(response);
    return data.data.order;
  },

  async updatePaymentStatus(id: string, paymentData: UpdatePaymentStatusRequest): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/payment`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(paymentData),
    });
    const data = await handleApiResponse(response);
    return data.data.order;
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await handleApiResponse(response);
    return data.data.order;
  },

  async getAllOrders(params?: {
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE_URL}/orders/admin${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    const data = await handleApiResponse(response);
    return data.data;
  },

  async getOrderStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/orders/stats`, {
      headers: getHeaders(),
    });
    const data = await handleApiResponse(response);
    return data.data;
  },

  async acceptOrder(id: string): Promise<{ order: Order; notification: any }> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/accept`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    const data = await handleApiResponse(response);
    return data.data;
  },

  async declineOrder(id: string, reason?: string): Promise<{ order: Order; notification: any }> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/decline`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    const data = await handleApiResponse(response);
    return data.data;
  },
};
