import { expect } from 'chai';
import { Cart } from '../src/cart';

// ─────────────────────────────────────────────────────────────────────────────
// Cart tests
//
// These tests cover the core shopping-cart behaviour using Mocha + Chai.
// One test is deliberately broken to demonstrate how Testream surfaces failures
// in the Jira dashboard — with the error diff and stack trace visible, and a
// one-click button to create a Jira issue from the failed test.
//
// Look for the "INTENTIONALLY FAILING" comment below.
// ─────────────────────────────────────────────────────────────────────────────

const APPLE = { id: 'prod-001', name: 'Apple', price: 120 }; // £1.20
const BANANA = { id: 'prod-002', name: 'Banana', price: 80 }; // £0.80

describe('Cart — adding items', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  it('adds a new item with default quantity of 1', () => {
    cart.addItem(APPLE);
    const items = cart.getItems();
    expect(items).to.have.lengthOf(1);
    expect(items[0]).to.include({ ...APPLE, quantity: 1 });
  });

  it('adds a new item with a specified quantity', () => {
    cart.addItem(APPLE, 3);
    expect(cart.getItems()[0].quantity).to.equal(3);
  });

  it('increments quantity when the same item is added twice', () => {
    cart.addItem(APPLE, 2);
    cart.addItem(APPLE, 1);
    expect(cart.getItems()[0].quantity).to.equal(3);
  });

  it('can hold multiple different items', () => {
    cart.addItem(APPLE);
    cart.addItem(BANANA);
    expect(cart.getItems()).to.have.lengthOf(2);
  });

  it('throws when quantity is 0 or negative', () => {
    expect(() => cart.addItem(APPLE, 0)).to.throw('Quantity must be greater than zero');
    expect(() => cart.addItem(APPLE, -1)).to.throw('Quantity must be greater than zero');
  });
});

describe('Cart — removing items', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
    cart.addItem(APPLE, 3);
  });

  it('decrements quantity when removing fewer than the stocked amount', () => {
    cart.removeItem(APPLE.id, 2);
    expect(cart.getItems()[0].quantity).to.equal(1);
  });

  it('removes the item entirely when quantity reaches 0', () => {
    cart.removeItem(APPLE.id, 3);
    expect(cart.isEmpty()).to.be.true;
  });

  it('removes the item entirely when quantity removed exceeds stock', () => {
    cart.removeItem(APPLE.id, 99);
    expect(cart.isEmpty()).to.be.true;
  });

  it('throws when trying to remove an item that is not in the cart', () => {
    expect(() => cart.removeItem('does-not-exist')).to.throw('Item "does-not-exist" not found in cart');
  });
});

describe('Cart — totals', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  it('returns 0 for an empty cart', () => {
    expect(cart.getTotal()).to.equal(0);
  });

  it('calculates total correctly for a single item', () => {
    cart.addItem(APPLE, 2); // 2 × 120 = 240
    expect(cart.getTotal()).to.equal(240);
  });

  it('calculates total correctly for multiple items', () => {
    cart.addItem(APPLE, 2); // 240
    cart.addItem(BANANA, 3); // 240
    expect(cart.getTotal()).to.equal(480);
  });

  it('recalculates total correctly after an item is removed', () => {
    cart.addItem(APPLE, 2); // 240
    cart.addItem(BANANA, 1); // 80
    cart.removeItem(BANANA.id);
    expect(cart.getTotal()).to.equal(240);
  });
});

describe('Cart — clear', () => {
  it('empties the cart', () => {
    const cart = new Cart();
    cart.addItem(APPLE);
    cart.addItem(BANANA);
    cart.clear();
    expect(cart.isEmpty()).to.be.true;
    expect(cart.getItems()).to.have.lengthOf(0);
  });
});

describe('Cart — checkout', () => {
  it('returns items and total for a populated cart', () => {
    const cart = new Cart();
    cart.addItem(APPLE, 2);
    const result = cart.checkout();
    expect(result.total).to.equal(240);
    expect(result.items).to.have.lengthOf(1);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // INTENTIONALLY FAILING TEST
  //
  // This test asserts the wrong error message to simulate a real-world
  // regression. In Testream you will see the exact error diff, the full
  // stack trace, and you can open a Jira issue for it in one click.
  // ─────────────────────────────────────────────────────────────────────────
  it('throws a descriptive error when checking out an empty cart', () => {
    const cart = new Cart();
    // BUG: wrong expected message — the real message is
    // "Cannot check out with an empty cart"
    expect(() => cart.checkout()).to.throw('Cart is empty');
  });
});
