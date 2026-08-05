import { ORDERS_ENDPOINT } from '../lib/config';
import type { OrderPayload, OrderResponse } from '../lib/types';
import { clearCart, getCartItems, getCartTotal } from './cart';

const form = document.getElementById('cart-form') as HTMLFormElement | null;
const submitBtn = document.getElementById('cart-submit') as HTMLButtonElement | null;
const statusEl = document.getElementById('cart-status');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!statusEl || !submitBtn) return;

  if (!ORDERS_ENDPOINT) {
    setStatus(
      'El backend todavía no está configurado (falta desplegar el Apps Script — ver apps-script/README.md).',
      'error'
    );
    return;
  }

  const items = getCartItems();
  if (items.length === 0) {
    setStatus('Tu carrito está vacío.', 'error');
    return;
  }

  const formData = new FormData(form);
  const customerEmail = String(formData.get('customer_email') ?? '').trim();
  if (!isValidEmail(customerEmail)) {
    setStatus('Ingresa un email válido.', 'error');
    return;
  }

  const payload: OrderPayload = {
    customer_name: String(formData.get('customer_name') ?? '').trim(),
    customer_email: customerEmail,
    items,
    total: getCartTotal()
  };

  submitBtn.disabled = true;
  setStatus('Enviando orden…', null);

  try {
    const res = await fetch(ORDERS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });
    const result: OrderResponse = await res.json();

    if (result.ok) {
      setStatus('¡Orden enviada! Te contactaremos a la brevedad.', 'success');
      clearCart();
      form.reset();
    } else {
      setStatus(result.error || 'No se pudo procesar la orden.', 'error');
      submitBtn.disabled = false;
    }
  } catch (err) {
    console.error('Error al enviar la orden', err);
    setStatus('Error de red al enviar la orden. Intenta de nuevo.', 'error');
    submitBtn.disabled = false;
  }
});

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setStatus(message: string, kind: 'success' | 'error' | null): void {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = 'cart-status' + (kind ? ` cart-status--${kind}` : '');
}
