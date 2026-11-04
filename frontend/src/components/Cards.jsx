import { useStore } from '../context/StoreContext.jsx';
import { asset, foodImg, inr, sale } from '../utils.js';
import { Icon } from './ui.jsx';

export function ProductCard({ p, i = 0 }) {
  const { addToCart, go } = useStore();
  const v = p.variants[p.defaultVariant];
  const alt = p.altImage || (p.variants[(p.defaultVariant + 1) % p.variants.length] || v).image;
  const first = p.variants[0], last = p.variants[p.variants.length - 1];
  const open = e => { e.preventDefault(); go('/p/' + p.id, e.currentTarget.querySelector('img.main')); };
  const quick = e => { e.preventDefault(); e.stopPropagation(); addToCart(p.id, null, 1, e.currentTarget.closest('.card').querySelector('img.main')); };
  return (
    <a className="card rv" style={{ transitionDelay: (i % 4) * .08 + 's' }} href={'/p/' + p.id} onClick={open} data-id={p.id}>
      <div className="media">
        {p.isNew && <span className="badge ink">NEW</span>}<span className="badge">40% OFF</span>
        <img className="main" src={asset(v.image)} alt={p.name} />
        <img className="alt" src={asset(alt)} alt="" />
        <button className="quick" onClick={quick}>+ Quick Add</button>
      </div>
      <div className="body">
        <div className="cat">{p.line} · {p.warrantyYears} yr warranty</div>
        <h3>{p.name}</h3>
        <div className="sz"><span className="stars">★★★★★</span> {p.rating} · {p.variants.length > 1 ? `${p.variants.length} sizes · ${first.label} – ${last.label}` : first.label}</div>
        <div className="pr"><b>{inr(sale(first.mrp))}</b><s>{inr(first.mrp)}</s><em>{p.variants.length > 1 ? 'from' : '40% off'}</em></div>
      </div>
    </a>
  );
}

export function Dish({ r }) {
  return (
    <div className="dish">
      <img src={foodImg(r.image)} alt={r.name} />
      <span className="tag">{r.tag}</span>
      <div className="view"><span><em>View recipe</em></span><i><Icon name="arrow" /></i></div>
    </div>
  );
}

export function RecipeCard({ r, i, product }) {
  const { openRecipe } = useStore();
  return (
    <div className="rcard rv" style={{ '--rd': i * .15 + 's' }} onClick={() => openRecipe(r, product)}>
      <Dish r={r} />
      <div className="rbody"><span className="no">0{i + 1}</span><div>
        <h3>{r.name}</h3><p>{r.description}</p>
        <div className="meta"><span><Icon name="clock" />{r.time}</span><span><Icon name="user" />Serves {r.serves}</span><span><Icon name="whistle" />{r.method}</span></div>
      </div></div>
    </div>
  );
}
