/**
 * Utility functions for token validation
 */

/**
 * Check if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Decode the JWT payload (without verification)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const decoded = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp < currentTime;
  } catch (error) {
    // If we can't decode the token, consider it invalid/expired
    return true;
  }
};

/**
 * Check if the current stored token is valid
 */
export const isCurrentTokenValid = (): boolean => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }
  
  return !isTokenExpired(token);
};

/**
 * Clear authentication data if token is invalid
 */
export const clearInvalidAuth = (): void => {
  if (!isCurrentTokenValid()) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Get a valid token or null if invalid/expired
 */
export const getValidToken = (): string | null => {
  const token = localStorage.getItem('token');
  
  if (!token || isTokenExpired(token)) {
    clearInvalidAuth();
    return null;
  }
  
  return token;
};
