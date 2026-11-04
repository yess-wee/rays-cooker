import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductCard, RecipeCard } from '../components/Cards.jsx';
import { Icon, Stars, useReveal } from '../components/ui.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { asset, countTo, inr, sale } from '../utils.js';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { byId, products, recipesFor, addToCart } = useStore();
  const p = byId[id];
  const [vi, setVi] = useState(p?.defaultVariant ?? 0);
  const [img, setImg] = useState(null);
  const [swap, setSwap] = useState(false);
  const [q, setQ] = useState(1);
  const priceRef = useRef(), mainRef = useRef(), mounted = useRef(false);
  useReveal([id, products]);

  useEffect(() => { if (p) { setVi(p.defaultVariant); setImg(null); setQ(1); mounted.current = false; } }, [id]); // eslint-disable-line
  useEffect(() => { if (mounted.current && p) countTo(priceRef.current, sale(p.variants[vi].mrp)); mounted.current = true; }, [vi]); // eslint-disable-line

  if (!p) return <div className="wrap" style={{ padding: '120px 0' }}><h1 className="serif">Product not found.</h1></div>;
  const v = p.variants[vi];
  const shown = img || v.image;
  const thumbs = [...new Set([...p.variants.map(x => x.image), ...(p.altImage ? [p.altImage] : [])])].slice(0, 5);
  const rel = products.filter(x => x.id !== id && x.categories.some(c => p.categories.includes(c))).slice(0, 4);
  const changeImg = (next, after) => { setSwap(true); setTimeout(() => { setImg(next); after?.(); setSwap(false); }, 250); };
  const pickSize = i => changeImg(null, () => setVi(i));

  const zoom = e => { const r = e.currentTarget.getBoundingClientRect(), el = mainRef.current; el.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; el.style.transform = 'scale(1.6)'; };

  return (
    <>
      <div className="wrap"><div className="crumbs" style={{ paddingTop: 34 }}>Home / {p.line} / {p.shortName}</div>
        <div className="pdp">
          <div className="gallery">
            <div className="thumbs">{thumbs.map(t => <button key={t} className={t === shown ? 'on' : ''} onClick={() => changeImg(t)}><img src={asset(t)} alt="" /></button>)}</div>
            <div className="main-img" onMouseMove={zoom} onMouseLeave={() => { mainRef.current.style.transform = ''; }}>
              <span className="badge">40% OFF</span>
              <img id="mainImg" ref={mainRef} className={swap ? 'swap' : ''} src={asset(shown)} style={{ viewTransitionName: 'hero-img' }} alt={p.name} />
              <span className="zoomhint">Hover to zoom</span>
            </div>
          </div>
          <div className="info">
            <div className="cat">{p.line} · {p.warrantyYears} Year Warranty</div>
            <h1>{p.name}</h1>
            <div className="rating"><Stars size={15} /><b style={{ color: 'var(--ink)' }}>{p.rating}</b> · {p.reviews.toLocaleString('en-IN')} reviews · <span style={{ color: '#1a8a4f', fontWeight: 600 }}>● In stock</span></div>
            <p style={{ color: 'var(--mute)', lineHeight: 1.8, marginTop: 22, fontSize: 15.5 }}>{p.description}</p>
            <div className="price"><b ref={priceRef}>{inr(sale(v.mrp))}</b><s>MRP {inr(v.mrp)}</s><em>40% OFF</em></div>
            <div className="tax">Inclusive of all taxes · EMI from {inr(Math.round(sale(v.mrp) / 6))}/month</div>
            {p.variants.length > 1 && (
              <div className="opt"><h5>Choose size <span>{v.label}</span></h5>
                <div className="sizes">{p.variants.map((x, i) => <button key={x.label} data-v={i} className={i === vi ? 'on' : ''} onClick={() => pickSize(i)}>{x.label}</button>)}</div></div>
            )}
            <div className="buy">
              <div className="qty"><button onClick={() => setQ(n => Math.max(1, n - 1))}>−</button><span>{q}</span><button data-q="1" onClick={() => setQ(n => n + 1)}>+</button></div>
              <button className="btn btn-dark" id="addBtn" onClick={() => addToCart(p.id, vi, q, mainRef.current)}><span>Add to bag</span><Icon name="arrow" /></button>
              <button className="btn btn-red" onClick={() => { addToCart(p.id, vi, q); navigate('/checkout'); }}><span>Buy now</span></button>
            </div>
            {p.kind === 'cooker' && <div className="free"><span style={{ color: 'var(--red)', display: 'flex', width: 28 }}><Icon name="gift" /></span><div><b>Free gift:</b> spare Safety Valve (₹50) + Gasket (₹90) with this cooker</div></div>}
            <div className="feats"><div><Icon name="layers" />Triply body</div><div><Icon name="ind" />Induction ready</div><div><Icon name="flame" />Heats quickly</div><div><Icon name="shield" />ISI certified</div></div>
            <div className="acc">
              <details open><summary>Highlights</summary><ul><li>Lid made from Jindal SS sheet 304</li><li>SS lead-free safety valve 304</li><li>TIPCO material stay-cool handles</li><li>Suitable for gas, induction &amp; ceramic tops</li></ul></details>
              <details><summary>Care &amp; use</summary><p>Dishwasher safe. Clean the gasket after every use and replace every 12 months for best performance.</p></details>
              <details><summary>Shipping &amp; returns</summary><p>Free delivery in 3–5 days. Easy 7-day returns.</p></details>
            </div>
          </div>
        </div>
      </div>
      <section className="cookin"><div className="wrap">
        <div className="head rv"><div><div className="eyebrow" style={{ color: '#ff5d72' }}>Cook it in your {p.shortName}</div><h2>Made for these<br /><i>recipes.</i></h2></div><p>Chef-tested, whistle-counted recipes that bring out the best in your new {p.shortName.toLowerCase()}. Tap one to open the full method.</p></div>
        <div className="recipes" key={id}>{recipesFor(p).slice(0, 3).map((r, i) => <RecipeCard key={r.slug} r={r} i={i} product={p} />)}</div>
      </div></section>
      <section className="blk"><div className="wrap">
        <div className="head rv"><div><div className="eyebrow">Complete the set</div><h2>Pairs <i>beautifully</i> with</h2></div></div>
        <div className="grid" key={id}>{rel.map((x, i) => <ProductCard key={x.id} p={x} i={i} />)}</div>
      </div></section>
    </>
  );
}
