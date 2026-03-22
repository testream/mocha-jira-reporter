import { expect } from 'chai';
import { formatPrice, validateProduct, getDiscountedPrice, isInStock } from '../src/product';
import type { Product } from '../src/product';

// ─────────────────────────────────────────────────────────────────────────────
// Product tests
//
// See the "INTENTIONALLY FAILING" comment below for a test that is
// deliberately broken to demonstrate Testream failure inspection in Jira.
// ─────────────────────────────────────────────────────────────────────────────

const validProduct: Product = {
  id: 'prod-001',
  name: 'Wireless Headphones',
  price: 7999, // £79.99
  stock: 42,
  category: 'Electronics',
};

describe('formatPrice', () => {
  it('formats a price in USD by default', () => {
    expect(formatPrice(1999)).to.equal('$19.99');
  });

  it('formats a price in GBP', () => {
    expect(formatPrice(7999, 'GBP', 'en-GB')).to.equal('£79.99');
  });

  it('formats zero correctly', () => {
    expect(formatPrice(0)).to.equal('$0.00');
  });

  it('formats whole dollars without extra decimals', () => {
    expect(formatPrice(1000)).to.equal('$10.00');
  });
});

describe('validateProduct', () => {
  it('returns no errors for a fully valid product', () => {
    expect(validateProduct(validProduct)).to.have.lengthOf(0);
  });

  it('reports an error when id is missing', () => {
    const errors = validateProduct({ ...validProduct, id: '' });
    expect(errors).to.include('id is required');
  });

  it('reports an error when name is missing', () => {
    const errors = validateProduct({ ...validProduct, name: '' });
    expect(errors).to.include('name is required');
  });

  it('reports an error when price is negative', () => {
    const errors = validateProduct({ ...validProduct, price: -1 });
    expect(errors).to.include('price must be a non-negative number');
  });

  it('reports an error when stock is negative', () => {
    const errors = validateProduct({ ...validProduct, stock: -5 });
    expect(errors).to.include('stock must be a non-negative number');
  });

  it('reports an error when category is missing', () => {
    const errors = validateProduct({ ...validProduct, category: '' });
    expect(errors).to.include('category is required');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // INTENTIONALLY FAILING TEST
  //
  // This test checks behaviour when multiple required fields are absent.
  // The assertion count is wrong (expects 2, but 4 fields are missing)
  // to simulate a test that drifted out of sync with the implementation.
  // Testream will show the expected vs received diff in Jira.
  // ─────────────────────────────────────────────────────────────────────────
  it('reports multiple errors when several required fields are missing', () => {
    const errors = validateProduct({ price: 999 }); // id, name, stock, category all missing
    // BUG: expects 2 errors but there are actually 4 (id, name, stock, category)
    expect(errors).to.have.lengthOf(2);
  });
});

describe('getDiscountedPrice', () => {
  it('applies a 10% discount correctly', () => {
    expect(getDiscountedPrice(1000, 10)).to.equal(900);
  });

  it('applies a 50% discount correctly', () => {
    expect(getDiscountedPrice(1000, 50)).to.equal(500);
  });

  it('applies a 100% discount (free item)', () => {
    expect(getDiscountedPrice(1000, 100)).to.equal(0);
  });

  it('returns the original price for a 0% discount', () => {
    expect(getDiscountedPrice(1000, 0)).to.equal(1000);
  });

  it('throws when discount percent is out of range', () => {
    expect(() => getDiscountedPrice(1000, -1)).to.throw();
    expect(() => getDiscountedPrice(1000, 101)).to.throw();
  });
});

describe('isInStock', () => {
  it('returns true when stock is greater than 0', () => {
    expect(isInStock(validProduct)).to.be.true;
  });

  it('returns false when stock is 0', () => {
    expect(isInStock({ ...validProduct, stock: 0 })).to.be.false;
  });
});
