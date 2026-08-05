import type { CartItem } from './types';

export function addItem(
  items: CartItem[],
  newItem: { id: string; name: string; price: number }
): CartItem[] {
  const existing = items.find((item) => item.id === newItem.id);
  if (existing) {
    return items.map((item) =>
      item.id === newItem.id ? { ...item, qty: item.qty + 1 } : item
    );
  }
  return [...items, { ...newItem, qty: 1 }];
}

export function removeItem(items: CartItem[], id: string): CartItem[] {
  return items.filter((item) => item.id !== id);
}

export function updateQty(items: CartItem[], id: string, qty: number): CartItem[] {
  if (qty <= 0) return removeItem(items, id);
  return items.map((item) => (item.id === id ? { ...item, qty } : item));
}

export function lineSubtotal(item: CartItem): number {
  return round2(item.price * item.qty);
}

export function cartTotal(items: CartItem[]): number {
  return round2(items.reduce((sum, item) => sum + item.price * item.qty, 0));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
