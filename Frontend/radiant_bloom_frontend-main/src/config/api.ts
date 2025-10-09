// API Configuration for Radiant Bloom Frontend
// This file centralizes all API-related configuration

// Get API URL from environment variables with fallback
const getApiUrl = (): string => {
  // Force HTTPS for backend (now supports HTTPS)
  const backendUrl = 'https://143.110.253.120:5000/api';
  
  // Check for Vite environment variable first (for Vite-based builds)
  if (import.meta.env.VITE_API_URL) {
    // Convert HTTP to HTTPS if needed (backend now supports HTTPS)
    const url = import.meta.env.VITE_API_URL;
    return url.replace('http://', 'https://');
  }
  
  // Check for React environment variable (for Create React App compatibility)
  if (import.meta.env.REACT_APP_API_URL) {
    // Convert HTTP to HTTPS if needed (backend now supports HTTPS)
    const url = import.meta.env.REACT_APP_API_URL;
    return url.replace('http://', 'https://');
  }
  
  // Check if we're in production mode
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
    return backendUrl;
  }
  
  // Check if we're on Vercel (Vercel sets VERCEL environment variable)
  if (import.meta.env.VERCEL) {
    return backendUrl;
  }
  
  // Check if we're on a production domain
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return backendUrl;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:5000/api';
};

// Export the API base URL
export const API_BASE_URL = getApiUrl();

// Export API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh'
  },
  
  // Products
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    SEARCH: '/products/search'
  },
  
  // Categories
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
    ACCEPT: (id: string) => `/orders/${id}/accept`,
    DECLINE: (id: string) => `/orders/${id}/decline`
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    SALES: '/analytics/sales',
    PRODUCTS: '/analytics/products'
  },
  
  // Health Check
  HEALTH: '/health'
} as const;

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Debug information (always show in production for troubleshooting)
console.log('🔧 API Configuration Debug:', {
  API_BASE_URL,
  Environment: {
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD,
    VERCEL: import.meta.env.VERCEL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    REACT_APP_API_URL: import.meta.env.REACT_APP_API_URL
  },
  '✅ Using HTTPS': API_BASE_URL.startsWith('https://'),
  '⚠️ WARNING: API URL is not HTTPS! This will cause Mixed Content errors.': !API_BASE_URL.startsWith('https://')
});
