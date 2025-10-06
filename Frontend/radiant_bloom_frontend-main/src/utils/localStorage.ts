/**
 * Safely loads state from localStorage
 * @param key - The key under which the state is stored
 * @param defaultValue - Default value to return if no state is found
 * @returns The parsed state or undefined if not found
 */
export const loadState = <T>(key: string, defaultValue?: T): T | undefined => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultValue;
    }
    return JSON.parse(serializedState) as T;
  } catch (err) {
    console.warn(`Error loading state from localStorage (key: ${key}):`, err);
    return defaultValue;
  }
};

/**
 * Saves state to localStorage
 * @param key - The key under which to store the state
 * @param state - The state to be saved
 */
export const saveState = <T>(key: string, state: T): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.warn(`Error saving state to localStorage (key: ${key}):`, err);
  }
};

/**
 * Removes state from localStorage
 * @param key - The key to remove
 */
export const removeState = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Error removing state from localStorage (key: ${key}):`, err);
  }
};

// Constants for localStorage keys
export const STORAGE_KEYS = {
  PRODUCTS: 'radiant_bloom_products',
  CART: 'radiant_bloom_cart',
  USER: 'radiant_bloom_user',
  REVIEWS: 'radiant_bloom_reviews',
  ORDERS: 'radiant_bloom_orders',
} as const;