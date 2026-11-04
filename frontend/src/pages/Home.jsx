import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard, RecipeCard } from '../components/Cards.jsx';
import { Icon, Stars, useReveal } from '../components/ui.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { SLIDES } from '../data/content.js';
import { asset, inr, sale } from '../utils.js';

function Hero() {
  const { byId, ready, go } = useStore();
  const [on, setOn] = useState(-1), [out, setOut] = useState(-1);
  const cur = useRef(-1), timer = useRef(), hero = useRef();

  const show = n => {
    const prev = cur.current; cur.current = n;
    if (prev >= 0 && prev !== n) { setOut(prev); setOn(-1); setTimeout(() => setOut(o => o === prev ? -1 : o), 1100); setTimeout(() => setOn(n), 650); }
    else setOn(n);
  };
  const start = n => { clearInterval(timer.current); show(n); timer.current = setInterval(() => show((cur.current + 1) % SLIDES.length), 6500); };

  useEffect(() => { if (ready) start(0); return () => clearInterval(timer.current); }, [ready]); // eslint-disable-line

  const move = e => {
    hero.current.style.setProperty('--mx', (e.clientX / innerWidth - .5) * 2);
    hero.current.style.setProperty('--my', (e.clientY / innerHeight - .5) * 2);
  };
  const active = on >= 0 ? on : Math.max(cur.current, 0);

  return (
    <section className="hero" id="hero" ref={hero} onMouseMove={move}>
      <div className="glow" />
      {SLIDES.map((s, i) => {
        const p = byId[s.p]; if (!p) return null;
        const v = p.variants[s.vi];
        return (
          <div key={i} className={'slide' + (on === i ? ' on' : '') + (out === i ? ' out' : '')}>
            <div className="copy">
              <div className="eyebrow fx">{s.ey}</div>
              <h1>{s.h.map((l, k) => <span className="ln" key={k}><span style={{ transitionDelay: .2 + k * .11 + 's' }} dangerouslySetInnerHTML={{ __html: l }} /></span>)}</h1>
              <p className="lead fx" style={{ '--d': '.65s' }}>{s.l}</p>
              <div className="from fx" style={{ '--d': '.75s' }}>From <b>{inr(sale(p.variants[0].mrp))}</b><s>{inr(p.variants[0].mrp)}</s> &nbsp;·&nbsp; 40% off</div>
              <div className="row fx" style={{ '--d': '.8s' }}>
                <a className="btn btn-dark" href={'/p/' + p.id} onClick={e => { e.preventDefault(); go('/p/' + p.id, e.currentTarget.closest('.slide').querySelector('.prod')); }}><span>Shop {p.shortName}</span><Icon name="arrow" /></a>
                <Link className="btn btn-line" to="/shop/all">Explore all</Link>
              </div>
            </div>
            <div className="stage">
              <div className="frame-wrap">
                <div className="frame"><div className="par"><img className="prod" src={asset(v.image)} alt={p.name} /></div><span className="sweep" /><span className="tagline"><b>RΛYS</b> &nbsp;·&nbsp; {p.line}</span></div>
                <div className="fig fx" style={{ '--d': '1.2s' }}><span>Fig. 0{i + 1}</span>{p.shortName} · {v.label}</div>
              </div>
              <ul className="specs">{s.chips.map((c, k) => <li className="fx" key={k} style={{ '--d': 1.1 + k * .14 + 's' }}><b>{c[0]}</b><span>{c[1]}</span><small>{c[2]}</small></li>)}</ul>
            </div>
          </div>
        );
      })}
      <div className="hero-count"><b>0{active + 1}</b><span>/ 03</span></div>
      <div className="hero-nav">{SLIDES.map((s, i) => <button key={i} className={active === i ? 'on' : ''} onClick={() => start(i)}>0{i + 1} &nbsp; {byId[s.p]?.shortName}<i /></button>)}</div>
      <div className="scrollcue" />
    </section>
  );
}

const MARQUEE = ['Triply Stainless Steel', '5 Year Warranty', 'Induction Ready', 'ISI Certified', 'Made in India', 'Free Safety Valve & Gasket'];

export default function Home() {
  const { byId, recipes, products } = useStore();
  useReveal([products, recipes]);
  const rec = ['masala-chai', 'hyderabadi-dum-biryani', 'dal-makhani'].map(s => recipes.find(r => r.slug === s)).filter(Boolean);
  const recProduct = ['top', 'handi', 'trinity'];
  const best = ['trinity', 'handi', 'black', 'tasra', 'combo2', 'top', 'brass', 'tawa'].map(id => byId[id]).filter(Boolean);
  const trio = byId.combo3;

  return (
    <>
      <Hero />
      <div className="marquee"><div className="track">{[...MARQUEE, ...MARQUEE].map((m, i) => <span key={i}>{m}</span>)}</div></div>

      <section className="blk"><div className="wrap">
        <div className="head rv"><div><div className="eyebrow">Shop by collection</div><h2>Crafted for every<br /><i>Indian</i> kitchen.</h2></div><p>From the morning chai to the Sunday biryani — cookware engineered around how India actually cooks.</p></div>
        <div className="cols">
          <Link className="col rv" to="/shop/cookers"><img src={asset('00s_8303_3_coocker_combo')} alt="" /><h3>Triply Pressure Cookers</h3><p>9 designs · 1.25 L – 5.5 L <span className="arr"><Icon name="arrow" /></span></p></Link>
          <Link className="col warm rv" style={{ transitionDelay: '.1s' }} to="/shop/tasra-top"><img src={asset('6_piece_combo')} style={{ width: '60%' }} alt="" /><h3>Tasra &amp; Top</h3><p>13 sizes <span className="arr"><Icon name="arrow" /></span></p></Link>
          <Link className="col rv" style={{ transitionDelay: '.2s' }} to="/shop/anodised"><img src={asset('00t_2232_5-5_ltr')} alt="" /><h3>Hard Anodised</h3><p>Black Beauty series <span className="arr"><Icon name="arrow" /></span></p></Link>
          <Link className="col rv" style={{ transitionDelay: '.3s' }} to="/p/brass"><img src={asset('00y_2971_5_ltr_brass')} alt="" /><h3>Triply Brass</h3><p>New arrival <span className="arr"><Icon name="arrow" /></span></p></Link>
          <Link className="col rv" style={{ transitionDelay: '.4s' }} to="/shop/tawa"><img src={asset('pride_concave_tawa_-_225_mm_-_24_piece')} alt="" /><h3>Roti Tawa</h3><p>Pride Concave <span className="arr"><Icon name="arrow" /></span></p></Link>
        </div>
      </div></section>

      <section className="blk triply"><div className="wrap g">
        <div className="rv">
          <div className="eyebrow" style={{ color: '#ff5d72' }}>Triply technology</div>
          <h2>Three layers.<br /><i>Zero</i> hotspots.</h2>
          <p>A non-reactive SS 304 interior for hygiene, a core of Aluminium 19000 for lightning-fast heat, and an SS 430 exterior that makes every vessel induction-ready. Bonded, not glued — for a lifetime.</p>
          <div className="stats"><div><b data-count="3">0</b><small>Bonded layers</small></div><div><b data-count="5">0</b><small>Year warranty</small></div><div><b data-count="40" data-suf="%">0</b><small>Less fuel*</small></div></div>
        </div>
        <div className="layers rv">
          <div className="layer l3" /><div className="layer l2" /><div className="layer l1" />
          <div className="lbl a"><div><b>Stainless Steel 304</b><small>Food-grade, non-reactive interior</small></div></div>
          <div className="lbl b"><div><b>Aluminium 19000 core</b><small>Rapid, edge-to-edge heat</small></div></div>
          <div className="lbl c"><div><b>Stainless Steel 430</b><small>Induction-ready, durable base</small></div></div>
          <div className="flame" />
        </div>
      </div></section>

      <section className="blk"><div className="wrap">
        <div className="head rv"><div><div className="eyebrow">Bestsellers</div><h2>Loved in <i>50,000+</i><br />kitchens.</h2></div><Link className="link" to="/shop/all">View all products</Link></div>
        <div className="grid">{best.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
      </div></section>

      <section className="blk" id="recipes" style={{ background: 'var(--cream)' }}><div className="wrap">
        <div className="head rv"><div><div className="eyebrow">The RAYS kitchen</div><h2>What will you<br /><i>cook</i> today?</h2></div><p>Every product comes with chef-tested recipes. Open any cooker to see what it was made for.</p></div>
        <div className="recipes">{rec.map((r, i) => <RecipeCard key={r.slug} r={r} i={i} product={byId[recProduct[i]]} />)}</div>
      </div></section>

      {trio && <section className="blk"><div className="wrap">
        <div className="banner rv">
          <div className="txt"><div className="eyebrow">Family Trio · Save ₹3,500</div><h2>One kitchen.<br />Three <i>cookers.</i></h2>
            <p style={{ color: 'var(--mute)', lineHeight: 1.7, maxWidth: 380 }}>2 L for dal, 3.5 L for sabzi, 5.5 L for biryani Sundays — the complete Trinity set at our best-ever price.</p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 34 }}><Link className="btn btn-red" to="/p/combo3"><span>Shop the Trio</span><Icon name="arrow" /></Link><b style={{ fontSize: 24 }}>{inr(sale(trio.variants[0].mrp))}</b><s style={{ color: 'var(--mute)' }}>{inr(trio.variants[0].mrp)}</s></div></div>
          <img src={asset('00s_8303_3_coocker_combo')} alt="Trinity trio" />
          <div className="big"><div><b>40%</b>OFF</div></div>
        </div>
      </div></section>}

      <div className="wrap"><div className="prom rv">
        <div><Icon name="shield" /><b>5 Year Warranty</b><p>Every Triply product, registered in one tap.</p></div>
        <div><Icon name="gift" /><b>Free Valve &amp; Gasket</b><p>Spare safety valve and gasket with every cooker.</p></div>
        <div><Icon name="truck" /><b>Free Shipping</b><p>Delivered across India in 3–5 days.</p></div>
        <div><Icon name="leaf" /><b>ISI · Made in India</b><p>BIS certified, crafted in Rajkot.</p></div>
      </div></div>

      <section className="blk"><div className="wrap">
        <div className="head rv"><div><div className="eyebrow">Reviews</div><h2>Real kitchens,<br /><i>real</i> words.</h2></div><p><Stars size={18} /><br />4.8 average from 6,200+ verified buyers</p></div>
        <div className="revs">
          {[['P', 'Priya S.', 'Ahmedabad · Trinity 3 L', 'Dal is done in four whistles and the base never burns. It looks so good I leave it on the stove.'],
            ['R', 'Rahul M.', 'Pune · Fusion Handi 5 L', 'Switched to induction and this was the only cooker that worked flawlessly from day one.'],
            ['A', 'Anjali K.', 'Rajkot · Tasra 6-Piece', 'The tasra set stacks beautifully. Kneading, tossing, serving — I use it for everything.']].map(([a, n, w, q], i) => (
            <div className="rev rv" key={n} style={{ transitionDelay: i * .12 + 's' }}><Stars /><q>{q}</q><div className="who"><span className="av">{a}</span><div>{n}<small>{w}</small></div></div></div>
          ))}
        </div>
      </div></section>
    </>
  );
}
