import fallbackProducts from './data/products.json';
import fallbackRecipes from './data/recipes.json';
import { sale } from './utils.js';

const BASE = import.meta.env.VITE_API_URL || '';

async function get(path, fallback) {
  try {
    const r = await fetch(BASE + path);
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch {
    // Backend not running: keep the storefront usable with the bundled catalogue.
    return fallback;
  }
}

export const fetchProducts = () => get('/api/products', fallbackProducts);
export const fetchRecipes = () => get('/api/recipes', fallbackRecipes);

export async function placeOrder(payload, products) {
  try {
    const r = await fetch(BASE + '/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch {
    return localOrder(payload, products);
  }
}

/** Mirrors the backend's pricing so the demo still completes offline. */
function localOrder(payload, products) {
  const items = payload.items.map(l => {
    const p = products.find(x => x.id === l.productId), v = p.variants.find(x => x.label === l.variant);
    return { productId: p.id, name: p.name, variant: v.label, image: v.image, quantity: l.quantity, mrp: v.mrp, price: sale(v.mrp) };
  });
  const mrpTotal = items.reduce((s, i) => s + i.mrp * i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const couponDiscount = (payload.coupon || '').trim().toUpperCase() === 'RAYSFEST' ? 250 : 0;
  const eta = new Date(Date.now() + 4 * 864e5);
  return {
    id: 'RYS-' + (482914 + Math.floor(Math.random() * 900)), placedAt: new Date().toISOString(),
    estimatedDelivery: eta.toISOString().slice(0, 10), status: 'CONFIRMED', paymentMethod: payload.paymentMethod,
    items, mrpTotal, discount: mrpTotal - subtotal, couponDiscount, total: subtotal - couponDiscount, customer: payload.customer,
  };
}
