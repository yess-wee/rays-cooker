import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, fetchRecipes } from '../api.js';
import fallbackProducts from '../data/products.json';
import fallbackRecipes from '../data/recipes.json';
import { sale } from '../utils.js';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState(fallbackProducts);
  const [recipes, setRecipes] = useState(fallbackRecipes);
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [recipe, setRecipe] = useState(null);       // { recipe, product }
  const [toast, setToast] = useState(null);
  const [bump, setBump] = useState(0);
  const [ready, setReady] = useState(false);
  const toastTimer = useRef();

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchRecipes().then(setRecipes);
  }, []);

  useEffect(() => { document.body.classList.toggle('ready', ready); }, [ready]);

  const byId = useMemo(() => Object.fromEntries(products.map(p => [p.id, p])), [products]);
  const recipesFor = useCallback(p => {
    const kind = p?.kind || 'cooker';
    const list = recipes.filter(r => r.kind === kind);
    if (kind === 'cooker') {
      const order = ['hyderabadi-dum-biryani', 'dal-makhani', 'punjabi-rajma-chawal'];
      return order.map(s => list.find(r => r.slug === s)).filter(Boolean);
    }
    return list;
  }, [recipes]);

  /** Navigate inside a View Transition when the browser supports it. */
  const go = useCallback((path, morphImg) => {
    if (!document.startViewTransition) return navigate(path);
    if (morphImg) morphImg.style.viewTransitionName = 'hero-img';
    document.startViewTransition(() => {
      if (morphImg) morphImg.style.viewTransitionName = '';
      flushSync(() => navigate(path));
    });
  }, [navigate]);

  const addToCart = useCallback((id, vi, q = 1, fromEl) => {
    const p = byId[id]; if (!p) return;
    const v = p.variants[vi ?? p.defaultVariant];
    if (fromEl) flyTo(fromEl, () => setBump(b => b + 1));
    setTimeout(() => {
      setCart(c => {
        const key = id + '|' + v.label, ex = c.find(x => x.key === key);
        return ex ? c.map(x => x.key === key ? { ...x, q: x.q + q } : x)
          : [...c, { key, id, name: p.name, short: p.shortName, size: v.label, mrp: v.mrp, img: v.image, q }];
      });
      setToast({ p, v }); clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 3200);
    }, fromEl ? 850 : 0);
  }, [byId]);

  const setQty = (i, d) => setCart(c => c.map((x, k) => k === i ? { ...x, q: Math.max(1, x.q + d) } : x));
  const removeItem = i => setCart(c => c.filter((_, k) => k !== i));
  const total = cart.reduce((s, c) => s + sale(c.mrp) * c.q, 0);
  const mrpTotal = cart.reduce((s, c) => s + c.mrp * c.q, 0);
  const count = cart.reduce((s, c) => s + c.q, 0);

  const value = {
    products, recipes, byId, recipesFor, cart, setCart, addToCart, setQty, removeItem, total, mrpTotal, count,
    drawerOpen, openCart: () => { setRecipe(null); setDrawerOpen(true); }, closeCart: () => setDrawerOpen(false),
    recipe, openRecipe: (r, p) => { setDrawerOpen(false); setRecipe({ recipe: r, product: p }); }, closeRecipe: () => setRecipe(null),
    toast, bump, ready, setReady, go,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function flyTo(img, done) {
  const cartBtn = document.getElementById('cartBtn'); if (!cartBtn) return;
  const r = img.getBoundingClientRect(), c = cartBtn.getBoundingClientRect();
  const f = img.cloneNode();
  Object.assign(f.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', zIndex: 95, objectFit: 'contain', pointerEvents: 'none', borderRadius: '4px', background: '#fff', boxShadow: '0 30px 60px -20px rgba(21,7,55,.5)', viewTransitionName: 'none' });
  f.className = ''; document.body.appendChild(f);
  const dx = c.left + c.width / 2 - (r.left + r.width / 2), dy = c.top + c.height / 2 - (r.top + r.height / 2);
  f.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dx * .45}px,${dy - 160}px) scale(.55)`, opacity: 1, offset: .45 }, { transform: `translate(${dx}px,${dy}px) scale(.06)`, opacity: .4 }], { duration: 900, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' });
  setTimeout(() => { f.remove(); done(); }, 900);
}
