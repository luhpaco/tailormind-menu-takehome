import type { MenuItem } from '../lib/types';
import { MENU_ENDPOINT } from '../lib/config';
import { formatPrice } from '../lib/currency';

const root = document.getElementById('menu-root');

let itemsByCategory: Map<string, MenuItem[]> = new Map();
let activeCategory: string | null = null;

async function loadMenu(): Promise<void> {
  if (!root) return;

  try {
    const res = await fetch(MENU_ENDPOINT);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const items: MenuItem[] = await res.json();
    if (!items.length) {
      renderEmpty();
      return;
    }
    itemsByCategory = groupByCategory(items);
    activeCategory = itemsByCategory.keys().next().value ?? null;
    render();
  } catch (err) {
    renderError(err);
  }
}

function renderEmpty(): void {
  root!.innerHTML = '<p class="state-message">No hay productos disponibles en este momento.</p>';
}

function renderError(err: unknown): void {
  console.error('Error al cargar el menú', err);
  root!.innerHTML =
    '<p class="state-message state-message--error">No se pudo cargar el menú. Intenta recargar la página.</p>';
}

function render(): void {
  if (!root || !activeCategory) return;
  root.innerHTML = '';

  root.append(renderTabs(), renderPanel());
}

function renderTabs(): HTMLElement {
  const tabs = document.createElement('div');
  tabs.className = 'menu-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Categorías del menú');

  for (const category of itemsByCategory.keys()) {
    const isActive = category === activeCategory;

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'menu-tab' + (isActive ? ' menu-tab--active' : '');
    tab.textContent = category;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', String(isActive));
    tab.addEventListener('click', () => {
      if (activeCategory === category) return;
      activeCategory = category;
      render();
    });

    tabs.appendChild(tab);
  }

  return tabs;
}

function renderPanel(): HTMLElement {
  const panel = document.createElement('div');
  panel.className = 'menu-grid';
  panel.setAttribute('role', 'tabpanel');

  const items = itemsByCategory.get(activeCategory!) ?? [];
  items.forEach((item) => panel.appendChild(renderCard(item)));

  return panel;
}

function groupByCategory(items: MenuItem[]): Map<string, MenuItem[]> {
  const map = new Map<string, MenuItem[]>();
  for (const item of items) {
    const key = item.category || 'Otros';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return map;
}

function renderCard(item: MenuItem): HTMLElement {
  const card = document.createElement('article');
  card.className = 'menu-card';

  const image = document.createElement('div');
  image.className = 'menu-card__image';
  if (item.image_url) {
    const img = document.createElement('img');
    img.src = item.image_url;
    img.alt = item.name;
    img.loading = 'lazy';
    image.appendChild(img);
  }

  const body = document.createElement('div');
  body.className = 'menu-card__body';

  const name = document.createElement('h3');
  name.textContent = item.name;

  const description = document.createElement('p');
  description.textContent = item.description;

  const footer = document.createElement('div');
  footer.className = 'menu-card__footer';

  const price = document.createElement('span');
  price.className = 'menu-card__price';
  price.textContent = formatPrice(item.price);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'menu-card__add';
  button.textContent = 'Agregar';
  button.addEventListener('click', () => {
    document.dispatchEvent(
      new CustomEvent('cart:add', {
        detail: { id: item.id, name: item.name, price: item.price }
      })
    );
  });

  footer.append(price, button);
  body.append(name, description, footer);
  card.append(image, body);

  return card;
}

loadMenu();
