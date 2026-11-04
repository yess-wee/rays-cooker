import { useNavigate, useParams } from 'react-router-dom';
import { ProductCard } from '../components/Cards.jsx';
import { useReveal } from '../components/ui.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { CATS } from '../data/content.js';

export default function Shop() {
  const { cat = 'all' } = useParams();
  const navigate = useNavigate();
  const { products } = useStore();
  const label = (CATS.find(c => c[0] === cat) || CATS[0])[1];
  const visible = products.filter(p => cat === 'all' || p.categories.includes(cat));
  useReveal([products, cat]);

  return (
    <>
      <section className="shop-hero"><div className="wrap">
        <div className="crumbs">Home / Shop / {label}</div>
        <h1 className="rv in">The <i>complete</i> collection.</h1>
        <div className="filters rv in">
          {CATS.map(([k, l]) => (
            <button key={k} className={'fchip' + (k === cat ? ' on' : '')} data-f={k} onClick={() => navigate('/shop/' + k, { replace: true })}>
              {l}<sup>{k === 'all' ? products.length : products.filter(p => p.categories.includes(k)).length}</sup>
            </button>
          ))}
        </div>
      </div></section>
      <section style={{ paddingBottom: 140 }}><div className="wrap">
        <div className="toolbar"><span>{visible.length} products</span><span>Sort by: <b style={{ color: 'var(--ink)' }}>Featured ▾</b></span></div>
        {/* keyed on the category so the grid re-animates on every filter change */}
        <div className="grid" id="shopGrid" key={cat}>
          {visible.map((p, i) => <div key={p.id} className="card-pop" style={{ animation: `cardin .9s cubic-bezier(.22,1,.36,1) ${i * .06}s both` }}><ProductCard p={p} i={i} /></div>)}
        </div>
      </div></section>
    </>
  );
}
