import { describe, expect, it } from 'vitest';
import { addItem, cartTotal, lineSubtotal, removeItem, updateQty } from './cart-logic';
import type { CartItem } from './types';

const margarita = { id: 'p1', name: 'Pizza Margarita', price: 28 };
const gaseosa = { id: 'b2', name: 'Gaseosa', price: 6 };

describe('addItem', () => {
  it('adds a new item with qty 1', () => {
    const result = addItem([], margarita);
    expect(result).toEqual([{ ...margarita, qty: 1 }]);
  });

  it('increments qty when the item already exists', () => {
    const cart: CartItem[] = [{ ...margarita, qty: 1 }];
    const result = addItem(cart, margarita);
    expect(result).toEqual([{ ...margarita, qty: 2 }]);
  });

  it('does not mutate the original array', () => {
    const cart: CartItem[] = [];
    addItem(cart, margarita);
    expect(cart).toEqual([]);
  });
});

describe('removeItem', () => {
  it('removes the item with the matching id', () => {
    const cart: CartItem[] = [
      { ...margarita, qty: 2 },
      { ...gaseosa, qty: 1 }
    ];
    expect(removeItem(cart, 'p1')).toEqual([{ ...gaseosa, qty: 1 }]);
  });

  it('is a no-op when the id is not present', () => {
    const cart: CartItem[] = [{ ...margarita, qty: 1 }];
    expect(removeItem(cart, 'missing')).toEqual(cart);
  });
});

describe('updateQty', () => {
  it('sets the new quantity', () => {
    const cart: CartItem[] = [{ ...margarita, qty: 1 }];
    expect(updateQty(cart, 'p1', 3)).toEqual([{ ...margarita, qty: 3 }]);
  });

  it('removes the item when qty drops to 0', () => {
    const cart: CartItem[] = [{ ...margarita, qty: 1 }];
    expect(updateQty(cart, 'p1', 0)).toEqual([]);
  });

  it('removes the item when qty goes negative', () => {
    const cart: CartItem[] = [{ ...margarita, qty: 1 }];
    expect(updateQty(cart, 'p1', -1)).toEqual([]);
  });
});

describe('lineSubtotal', () => {
  it('multiplies price by qty', () => {
    expect(lineSubtotal({ ...margarita, qty: 3 })).toBe(84);
  });

  it('rounds to 2 decimals to avoid floating point drift', () => {
    expect(lineSubtotal({ id: 'x', name: 'x', price: 0.1, qty: 3 })).toBe(0.3);
  });
});

describe('cartTotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(cartTotal([])).toBe(0);
  });

  it('sums subtotals across multiple items', () => {
    const cart: CartItem[] = [
      { ...margarita, qty: 2 }, // 56
      { ...gaseosa, qty: 3 } // 18
    ];
    expect(cartTotal(cart)).toBe(74);
  });

  it('rounds the total to 2 decimals', () => {
    const cart: CartItem[] = [{ id: 'x', name: 'x', price: 0.1, qty: 3 }];
    expect(cartTotal(cart)).toBe(0.3);
  });
});
