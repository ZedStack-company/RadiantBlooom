/**
 * Currency utility functions for consistent formatting throughout the application
 */

export const CURRENCY_SYMBOL = 'Rs:';

/**
 * Format a number as currency with Rs: prefix
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number | string, decimals: number = 2): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return `${CURRENCY_SYMBOL}0.00`;
  
  return `${CURRENCY_SYMBOL}${numAmount.toFixed(decimals)}`;
};

/**
 * Format currency for display in components
 * @param amount - The amount to format
 * @returns Formatted currency string with proper spacing
 */
export const formatDisplayCurrency = (amount: number | string): string => {
  return formatCurrency(amount);
};

/**
 * Parse currency string to number
 * @param currencyString - Currency string like "Rs:123.45"
 * @returns Parsed number
 */
export const parseCurrency = (currencyString: string): number => {
  const cleaned = currencyString.replace(CURRENCY_SYMBOL, '').replace(/,/g, '');
  return parseFloat(cleaned) || 0;
};
