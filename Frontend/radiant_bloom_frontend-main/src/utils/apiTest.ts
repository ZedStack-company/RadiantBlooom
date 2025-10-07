// API Test Utility - Debug API Configuration
import { API_BASE_URL } from '@/config/api';

export const testApiConfiguration = () => {
  console.log('🔧 API Configuration Debug:');
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('Environment:', {
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD,
    VERCEL: import.meta.env.VERCEL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    REACT_APP_API_URL: import.meta.env.REACT_APP_API_URL,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    protocol: typeof window !== 'undefined' ? window.location.protocol : 'server',
  });
  
  // Test if API URL is HTTPS
  const isHttps = API_BASE_URL.startsWith('https://');
  console.log('✅ Using HTTPS:', isHttps);
  
  if (!isHttps) {
    console.warn('⚠️ WARNING: API URL is not HTTPS! This will cause Mixed Content errors.');
  }
  
  return {
    apiUrl: API_BASE_URL,
    isHttps,
    environment: import.meta.env.MODE,
  };
};

// Auto-run in development
if (import.meta.env.DEV) {
  testApiConfiguration();
}