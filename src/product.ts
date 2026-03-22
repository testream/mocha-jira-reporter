export interface Product {
  id: string;
  name: string;
  price: number; // in pence/cents
  stock: number;
  category: string;
}

/**
 * Format a price in pence/cents into a human-readable currency string.
 * e.g. 1999 → "$19.99"
 */
export function formatPrice(amountInCents: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amountInCents / 100);
}

/**
 * Validate that a product object contains all required fields with valid values.
 * Returns an array of error messages. Empty array means the product is valid.
 */
export function validateProduct(product: Partial<Product>): string[] {
  const errors: string[] = [];

  if (!product.id || product.id.trim() === '') errors.push('id is required');
  if (!product.name || product.name.trim() === '') errors.push('name is required');
  if (product.price === undefined || product.price < 0) errors.push('price must be a non-negative number');
  if (product.stock === undefined || product.stock < 0) errors.push('stock must be a non-negative number');
  if (!product.category || product.category.trim() === '') errors.push('category is required');

  return errors;
}

/**
 * Apply a percentage discount and return the discounted price.
 * Clamps to 0 — a product can never have a negative price.
 */
export function getDiscountedPrice(priceInCents: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('discountPercent must be between 0 and 100');
  }
  return Math.max(0, Math.round(priceInCents * (1 - discountPercent / 100)));
}

/** Returns true when the product has at least one unit in stock. */
export function isInStock(product: Product): boolean {
  return product.stock > 0;
}
