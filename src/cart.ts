export interface CartItem {
  id: string;
  name: string;
  price: number; // unit price in pence/cents
  quantity: number;
}

export class Cart {
  private items: Map<string, CartItem> = new Map();

  /** Add a product to the cart, or increment its quantity if already present. */
  addItem(item: Omit<CartItem, 'quantity'>, quantity = 1): void {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');

    const existing = this.items.get(item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.set(item.id, { ...item, quantity });
    }
  }

  /** Decrease quantity by `quantity`. Removes the item when quantity reaches 0. */
  removeItem(id: string, quantity = 1): void {
    const item = this.items.get(id);
    if (!item) throw new Error(`Item "${id}" not found in cart`);
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');

    if (item.quantity <= quantity) {
      this.items.delete(id);
    } else {
      item.quantity -= quantity;
    }
  }

  /** Return the total price (sum of price × quantity for every item). */
  getTotal(): number {
    let total = 0;
    for (const item of this.items.values()) {
      total += item.price * item.quantity;
    }
    return total;
  }

  /** Return a snapshot of all cart items. */
  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }

  /** Remove all items from the cart. */
  clear(): void {
    this.items.clear();
  }

  /** True when the cart contains no items. */
  isEmpty(): boolean {
    return this.items.size === 0;
  }

  /**
   * Validate and lock the cart for checkout.
   * Throws if the cart is empty.
   */
  checkout(): { items: CartItem[]; total: number } {
    if (this.isEmpty()) {
      throw new Error('Cannot check out with an empty cart');
    }
    return { items: this.getItems(), total: this.getTotal() };
  }
}
