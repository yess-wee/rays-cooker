import { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { asset, inr, sale } from '../utils.js';
import { Dish } from './Cards.jsx';
import { Icon } from './ui.jsx';

export function CartDrawer() {
  const { cart, drawerOpen, closeCart, setQty, removeItem, total, mrpTotal, count, go } = useStore();
  const goal = 5000, pct = Math.min(100, total / goal * 100);
  const [w, setW] = useState(0);
  useEffect(() => { setW(0); if (drawerOpen) { const t = setTimeout(() => setW(pct), 60); return () => clearTimeout(t); } }, [drawerOpen, pct]);
  return (
    <aside id="drawer" className={drawerOpen ? 'on' : ''}>
      <div className="dh"><h3>Your bag<sup>{count} items</sup></h3><button className="ic" onClick={closeCart}><Icon name="close" /></button></div>
      <div className="ship">
        {total >= goal ? <>🎉 You've unlocked a <b>free 18 cm Tasra</b> with your order</> : <>Add <b>{inr(goal - total)}</b> more to unlock a <b>free 18 cm Tasra</b></>}
        <div className="tr"><i style={{ width: w + '%' }} /></div>
      </div>
      <div className="items">
        {cart.length ? cart.map((c, i) => (
          <div className="it" key={c.key} style={{ animationDelay: i * .08 + 's' }}>
            <img src={asset(c.img)} alt="" />
            <div><h4>{c.name}</h4><small>{c.size} · Free shipping</small>
              <div className="qty"><button onClick={() => setQty(i, -1)}>−</button><span>{c.q}</span><button data-cq={`${i}|1`} onClick={() => setQty(i, 1)}>+</button></div></div>
            <div className="r">{inr(sale(c.mrp) * c.q)}<s>{inr(c.mrp * c.q)}</s><div><button className="rm" onClick={() => removeItem(i)}>Remove</button></div></div>
          </div>
        )) : <div className="empty"><b>Your bag is empty</b>Start with our bestselling Trinity cooker.</div>}
      </div>
      {cart.length > 0 && (
        <div className="df">
          <div className="ln"><span>MRP total</span><span>{inr(mrpTotal)}</span></div>
          <div className="ln sv"><span>Festive discount (40%)</span><span>− {inr(mrpTotal - total)}</span></div>
          <div className="ln"><span>Shipping</span><span style={{ color: '#1a8a4f', fontWeight: 600 }}>FREE</span></div>
          <div className="ln t"><span>Total</span><span>{inr(total)}</span></div>
          <a className="btn btn-dark" href="/checkout" id="toCheckout" onClick={e => { e.preventDefault(); closeCart(); go('/checkout'); }}><span>Secure checkout</span><Icon name="arrow" /></a>
        </div>
      )}
    </aside>
  );
}

export function RecipeModal() {
  const { recipe, closeRecipe, addToCart, byId } = useStore();
  const [shown, setShown] = useState(null);
  useEffect(() => { if (recipe) setShown(recipe); }, [recipe]);
  const r = shown?.recipe, p = shown?.product || byId.trinity;
  return (
    <div id="modal" className={recipe ? 'on' : ''}>
      {r && p && (
        <div className="box" style={{ position: 'relative' }}>
          <button className="mclose" onClick={closeRecipe}><Icon name="close" /></button>
          <Dish r={r} />
          <div className="mbody">
            <div className="eyebrow">{r.tag} · Made in RAYS {p.shortName}</div>
            <h2>{r.name}</h2>
            <p style={{ color: 'var(--mute)', lineHeight: 1.7 }}>{r.description}</p>
            <div className="meta"><span><Icon name="clock" />{r.time}</span><span><Icon name="user" />Serves {r.serves}</span><span><Icon name="whistle" />{r.method}</span></div>
            <h5>Ingredients</h5>
            <div className="ing">{r.ingredients.map(x => <span key={x}>{x}</span>)}</div>
            <h5>Method</h5>
            <ol className="steps">{r.steps.map((s, i) => <li key={i} style={{ transitionDelay: .3 + i * .1 + 's' }}>{s}</li>)}</ol>
            <div className="withprod">
              <img src={asset(p.variants[p.defaultVariant].image)} alt="" />
              <div style={{ flex: 1 }}><small>Cooked in</small><b>{p.name}</b></div>
              <button className="btn btn-dark" style={{ height: 46, padding: '0 20px' }} onClick={() => { addToCart(p.id, null, 1); closeRecipe(); }}><span>Add · {inr(sale(p.variants[p.defaultVariant].mrp))}</span></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Scrim() {
  const { drawerOpen, recipe, closeCart, closeRecipe } = useStore();
  return <div className={'scrim' + (drawerOpen || recipe ? ' on' : '')} onClick={() => { closeCart(); closeRecipe(); }} />;
}

export function Toast() {
  const { toast, openCart } = useStore();
  const [last, setLast] = useState(null);
  useEffect(() => { if (toast) setLast(toast); }, [toast]);
  return (
    <div className={'toast' + (toast ? ' on' : '')}>
      {last && <><img src={asset(last.v.image)} alt="" /><span><b>{last.p.shortName} {last.v.label}</b> added to your bag</span><button onClick={openCart}>View bag</button></>}
    </div>
  );
}
