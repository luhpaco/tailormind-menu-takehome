import type { CartItem } from '../lib/types';
import { addItem, cartTotal, lineSubtotal, removeItem, updateQty } from '../lib/cart-logic';
import { formatPrice } from '../lib/currency';

const STORAGE_KEY = 'tailormind:cart';

let items: CartItem[] = loadCart();

const itemsRoot = document.getElementById('cart-items');
const totalEl = document.getElementById('cart-total');
const submitBtn = document.getElementById('cart-submit') as HTMLButtonElement | null;

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function setQty(id: string, qty: number): void {
  items = updateQty(items, id, qty);
  saveCart();
  render();
}

function removeFromCart(id: string): void {
  items = removeItem(items, id);
  saveCart();
  render();
}

function render(): void {
  if (!itemsRoot || !totalEl) return;

  itemsRoot.innerHTML = '';
  if (items.length === 0) {
    itemsRoot.innerHTML = '<p class="state-message">Tu carrito está vacío.</p>';
  } else {
    items.forEach((item) => itemsRoot.appendChild(renderRow(item)));
  }

  totalEl.textContent = formatPrice(cartTotal(items));
  if (submitBtn) submitBtn.disabled = items.length === 0;
}

function renderRow(item: CartItem): HTMLElement {
  const row = document.createElement('div');
  row.className = 'cart-item';

  const name = document.createElement('span');
  name.className = 'cart-item__name';
  name.textContent = item.name;

  const qty = document.createElement('div');
  qty.className = 'cart-qty';

  const decrement = document.createElement('button');
  decrement.type = 'button';
  decrement.textContent = '−';
  decrement.setAttribute('aria-label', `Quitar una unidad de ${item.name}`);
  decrement.addEventListener('click', () => setQty(item.id, item.qty - 1));

  const qtyLabel = document.createElement('span');
  qtyLabel.textContent = String(item.qty);

  const increment = document.createElement('button');
  increment.type = 'button';
  increment.textContent = '+';
  increment.setAttribute('aria-label', `Agregar una unidad de ${item.name}`);
  increment.addEventListener('click', () => setQty(item.id, item.qty + 1));

  qty.append(decrement, qtyLabel, increment);

  const subtotal = document.createElement('span');
  subtotal.className = 'cart-item__subtotal';
  subtotal.textContent = formatPrice(lineSubtotal(item));

  row.append(name, qty, subtotal);

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'cart-remove';
  remove.textContent = 'Quitar';
  remove.addEventListener('click', () => removeFromCart(item.id));
  row.appendChild(remove);

  return row;
}

document.addEventListener('cart:add', (event) => {
  const detail = (event as CustomEvent<{ id: string; name: string; price: number }>).detail;
  items = addItem(items, detail);
  saveCart();
  render();
});

render();

export function getCartItems(): CartItem[] {
  return items;
}

export function getCartTotal(): number {
  return cartTotal(items);
}

export function clearCart(): void {
  items = [];
  saveCart();
  render();
}
