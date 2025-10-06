const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed');
  }
  
  return data;
};

// Helper function to get headers
const getHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  addresses: Address[];
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await handleApiResponse(response);
    
    // Store token in localStorage
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
    }
    
    return data.data;
  },

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    const data = await handleApiResponse(response);
    
    // Store token in localStorage
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
    }
    
    return data.data;
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            ...getHeaders(),
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Remove token from localStorage
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleApiResponse(response);
    return data.data.user;
  },

  async refreshToken(): Promise<string> {
    // For now, we'll just return the existing token
    // In a real app, you might want to implement token refresh
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return token;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};
