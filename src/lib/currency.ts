/**
 * Currency formatting and validation utilities
 * Handles dynamic currency symbol display and amount formatting
 */

/**
 * Maps currency codes to their display symbols
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  INR: '₹',
};

/**
 * Formats a payment amount with the correct currency symbol
 * @param amount - The payment amount
 * @param currency - The currency code (USD, INR, etc.), defaults to INR
 * @returns Formatted string with symbol
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR'
): string {
  const normalizedCurrency = (currency || 'INR').toUpperCase();
  const symbol = CURRENCY_SYMBOLS[normalizedCurrency] || '₹';

  // Format based on currency:
  // USD: 2 decimal places (e.g., $99.99)
  // INR: no decimal places (e.g., ₹9999)
  const formattedAmount =
    normalizedCurrency === 'USD'
      ? amount.toFixed(2)
      : Math.round(amount).toString();

  return `${symbol}${formattedAmount}`;
}

/**
 * Gets the currency symbol
 * @param currency - The currency code, defaults to INR
 * @returns The currency symbol, with fallback to ₹
 */
export function getCurrencySymbol(currency: string = 'INR'): string {
  const normalizedCurrency = (currency || 'INR').toUpperCase();
  return CURRENCY_SYMBOLS[normalizedCurrency] || '₹';
}

/**
 * Validates if a currency is supported
 */
export function isValidCurrency(currency?: string | null): boolean {
  if (!currency) return false;
  return Object.prototype.hasOwnProperty.call(
    CURRENCY_SYMBOLS,
    currency.toUpperCase()
  );
}
