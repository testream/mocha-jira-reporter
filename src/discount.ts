export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (0-100) or fixed amount in pence/cents
  expiresAt: Date;
  minOrderValue?: number; // minimum cart total to apply coupon (pence/cents)
}

/**
 * Apply a percentage discount to a price.
 * Returns the discounted price, clamped to 0.
 */
export function applyPercentage(priceInCents: number, percent: number): number {
  if (percent < 0 || percent > 100) {
    throw new Error('percent must be between 0 and 100');
  }
  return Math.max(0, Math.round(priceInCents * (1 - percent / 100)));
}

/**
 * Apply a fixed discount to a price.
 * Returns the discounted price, clamped to 0.
 */
export function applyFixed(priceInCents: number, discountInCents: number): number {
  if (discountInCents < 0) {
    throw new Error('discount amount must be non-negative');
  }
  return Math.max(0, priceInCents - discountInCents);
}

/**
 * Validate a coupon against the current date and the cart total.
 * Returns an array of validation error messages. Empty means the coupon is valid.
 */
export function validateCoupon(coupon: Coupon, cartTotalInCents: number, now = new Date()): string[] {
  const errors: string[] = [];

  if (coupon.expiresAt < now) {
    errors.push('Coupon has expired');
  }

  if (coupon.minOrderValue !== undefined && cartTotalInCents < coupon.minOrderValue) {
    errors.push(
      `Minimum order value not met (requires ${coupon.minOrderValue} cents, cart is ${cartTotalInCents} cents)`
    );
  }

  if (coupon.type === 'percentage' && (coupon.value < 0 || coupon.value > 100)) {
    errors.push('Percentage coupon value must be between 0 and 100');
  }

  if (coupon.type === 'fixed' && coupon.value < 0) {
    errors.push('Fixed coupon value must be non-negative');
  }

  return errors;
}

/**
 * Apply a coupon to a price.
 * Throws if the coupon has validation errors.
 */
export function applyCoupon(priceInCents: number, coupon: Coupon, now = new Date()): number {
  const errors = validateCoupon(coupon, priceInCents, now);
  if (errors.length > 0) throw new Error(errors.join('; '));

  return coupon.type === 'percentage'
    ? applyPercentage(priceInCents, coupon.value)
    : applyFixed(priceInCents, coupon.value);
}
