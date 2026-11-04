import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard, RecipeCard } from '../components/Cards.jsx';
import { Icon, Photo, useReveal } from '../components/ui.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { BANNERS, CATEGORY_TILES, DEAL_POOL } from '../data/content.js';
import { asset, inr, sale } from '../utils.js';

/* ---------- full-bleed photo banner slider (Prestige / Bergner style) ---------- */
function Banner() {
  const { byId } = useStore();
  const [on, setOn] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setOn(n => (n + 1) % BANNERS.length), 7000);
    return () => clearInterval(t);
  }, [on]);

  return (
    <section className="bn" aria-roledescription="carousel">
      {BANNERS.map((b, i) => {
        const p = byId[b.p], v = p && p.variants[b.vi ?? p.defaultVariant];
        return (
          <div key={b.photo} className={'bn-slide' + (on === i ? ' on' : '')} aria-hidden={on !== i}>
            <Photo name={b.photo} className="bn-bg" eager={i === 0} />
            <div className="bn-shade" />
            <div className="wrap bn-in">
              <div className="bn-copy">
                <div className="eyebrow">{b.ey}</div>
                <h1 dangerouslySetInnerHTML={{ __html: b.h }} />
                <p>{b.l}</p>
                <div className="bn-cta">
                  <Link className="btn btn-red" to={b.to} tabIndex={on === i ? 0 : -1}><span>{b.cta}</span><Icon name="arrow" /></Link>
                  <Link className="btn bn-ghost" to="/shop/all" tabIndex={on === i ? 0 : -1}>Shop all</Link>
                </div>
              </div>
              {p && (
                <Link className="bn-card" to={'/p/' + p.id} tabIndex={on === i ? 0 : -1}>
                  <span className="badge">40% OFF</span>
                  <img src={asset(v.image)} alt={p.name} />
                  <div><small>{p.shortName} · {v.label}</small><b>{inr(sale(v.mrp))}</b><s>{inr(v.mrp)}</s></div>
                </Link>
              )}
            </div>
          </div>
        );
      })}
      <div className="bn-dots">
        {BANNERS.map((b, i) => <button key={i} className={on === i ? 'on' : ''} onClick={() => setOn(i)} aria-label={'Show banner ' + (i + 1)}><i /></button>)}
      </div>
    </section>
  );
}

/* ---------- round category tiles ---------- */
function Categories() {
  return (
    <section className="cats"><div className="wrap">
      <div className="cats-row">
        {CATEGORY_TILES.map(([to, label, img]) => (
          <Link key={to} className="cat-tile" to={to}><span><img src={asset(img)} alt="" /></span>{label}</Link>
        ))}
      </div>
    </div></section>
  );
}

/* ---------- deal of the week: picks rotate every Monday 00:00 IST ---------- */
const IST = 5.5 * 36e5, DAY = 864e5;
function weekEnd(now) {
  const ist = now + IST, dow = new Date(ist).getUTCDay();            // 0 = Sunday
  const toMonday = ((8 - dow) % 7) || 7;
  return Math.floor(ist / DAY) * DAY + toMonday * DAY - IST;          // next Monday midnight, as UTC ms
}
function Deal() {
  const { byId } = useStore();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const end = weekEnd(now), left = Math.max(0, end - now);
  const week = Math.floor((end + IST) / (7 * DAY));
  const picks = [0, 1, 2, 3].map(k => byId[DEAL_POOL[(week * 4 + k) % DEAL_POOL.length]]).filter(Boolean);
  const parts = [[Math.floor(left / DAY), 'd'], [Math.floor(left / 36e5) % 24, 'h'], [Math.floor(left / 6e4) % 60, 'm'], [Math.floor(left / 1e3) % 60, 's']];

  return (
    <section className="blk deal"><div className="wrap">
      <div className="deal-head rv">
        <div><div className="eyebrow">Deal of the week</div><h2>This week’s <i>picks.</i></h2>
          <p>Four RAYS favourites, hand-picked every Monday — 40% off MRP plus a free spare safety valve &amp; gasket with every cooker.</p></div>
        <div className="timer" role="timer" aria-label="Time left in this week's deal">
          <small>Ends in</small>
          <div>{parts.map(([n, u]) => <span key={u}><b>{String(n).padStart(2, '0')}</b>{u}</span>)}</div>
        </div>
      </div>
      <div className="grid">{picks.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
    </div></section>
  );
}

export default function Home() {
  const { byId, recipes, products } = useStore();
  useReveal([products, recipes]);
  const rec = ['masala-chai', 'hyderabadi-dum-biryani', 'dal-makhani'].map(s => recipes.find(r => r.slug === s)).filter(Boolean);
  const recProduct = ['top', 'handi', 'trinity'];
  const best = ['trinity', 'handi', 'black', 'tasra', 'combo2', 'top', 'brass', 'tawa'].map(id => byId[id]).filter(Boolean);
  const trio = byId.combo3;

  return (
    <>
      <Banner />
      <Categories />
      <Deal />

      <section className="blk" style={{ paddingTop: 0 }}><div className="wrap">
        <div className="head rv"><div><div className="eyebrow">Shop by collection</div><h2>Crafted for every<br /><i>Indian</i> kitchen.</h2></div><p>From the morning chai to the Sunday biryani — cookware made around how India actually cooks.</p></div>
        <div className="cols">
          <Link className="col rv" to="/shop/cookers"><img src={asset('00s_8303_3_coocker_combo')} alt="" /><h3>Triply Pressure Cookers</h3><p>Trinity · Handi · Pan · Brass <span className="arr"><Icon name="arrow" /></span></p></Link>
          <Link className="col warm rv" style={{ transitionDelay: '.1s' }} to="/shop/tasra-top"><img src={asset('6_piece_combo')} style={{ width: '60%' }} alt="" /><h3>Tasra &amp; Top</h3><p>14 sizes <span className="arr"><Icon name="arrow" /></span></p></Link>
          <Link className="col rv" style={{ transitionDelay: '.2s' }} to="/shop/anodised"><img src={asset('00t_2232_5-5_ltr')} alt="" /><h3>Hard Anodised</h3><p>Black Beauty series <span className="arr"><Icon name="arrow" /></span></p></Link>
          <Link className="col rv" style={{ transitionDelay: '.3s' }} to="/p/brass"><img src={asset('00y_2971_5_ltr_brass')} alt="" /><h3>Triply Brass</h3><p>New arrival <span className="arr"><Icon name="arrow" /></span></p></Link>
          <Link className="col rv" style={{ transitionDelay: '.4s' }} to="/shop/tawa"><img src={asset('pride_concave_tawa_-_225_mm_-_24_piece')} alt="" /><h3>Roti Tawa</h3><p>Pride Concave <span className="arr"><Icon name="arrow" /></span></p></Link>
        </div>
      </div></section>

      {/* lifestyle split: real kitchen photo + promise */}
      <section className="split"><div className="split-img"><Photo name="kitchen-tawa" alt="Fresh paratha cooking on a steel tawa, with spice bowls beside it" sizes="(max-width:900px) 100vw, 50vw" /></div>
        <div className="split-txt rv">
          <div className="eyebrow">Everyday cooking</div>
          <h2>Made for the<br /><i>daily</i> rush.</h2>
          <p>Morning parathas, tiffin dal, evening chai. RAYS cookware is built for kitchens that never really close — heavy bases that don’t warp, handles that stay cool, and finishes that clean up in a minute.</p>
          <ul className="ticks"><li>Works on gas &amp; induction</li><li>ISI certified · IS 2347 &amp; IS 14756</li><li>5-year warranty on every Triply product</li></ul>
          <Link className="btn btn-dark" to="/shop/all"><span>Explore the range</span><Icon name="arrow" /></Link>
        </div>
      </section>

      <section className="blk triply has-photo">
        <Photo name="make-molten" className="tri-bg" sizes="100vw" />
        <div className="wrap g">
          <div className="rv">
            <div className="eyebrow" style={{ color: '#ff5d72' }}>Triply technology</div>
            <h2>Three layers.<br /><i>Zero</i> hotspots.</h2>
            <p>A non-reactive SS 304 interior for hygiene, a core of Aluminium 19000 for fast, even heat, and an SS 430 exterior that makes every vessel induction-ready. Bonded, not glued.</p>
            <div className="stats"><div><b data-count="3">0</b><small>Bonded layers</small></div><div><b data-count="5">0</b><small>Year warranty</small></div><div><b>ISI</b><small>Certified</small></div></div>
          </div>
          <div className="layers rv">
            <div className="layer l3" /><div className="layer l2" /><div className="layer l1" />
            <div className="lbl a"><div><b>Stainless Steel 304</b><small>Food-grade, non-reactive interior</small></div></div>
            <div className="lbl b"><div><b>Aluminium 19000 core</b><small>Rapid, edge-to-edge heat</small></div></div>
            <div className="lbl c"><div><b>Stainless Steel 430</b><small>Induction-ready, durable base</small></div></div>
            <div className="flame" />
          </div>
        </div>
      </section>

      <section className="blk"><div className="wrap">
        <div className="head rv"><div><div className="eyebrow">Bestsellers</div><h2>Our most-loved<br /><i>cookware.</i></h2></div><Link className="link" to="/shop/all">View all products</Link></div>
        <div className="grid">{best.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
      </div></section>

      {/* food photo band */}
      <section className="band">
        <Photo name="food-thali-steel" className="band-bg" sizes="100vw" />
        <div className="wrap band-in rv"><div className="eyebrow">The RAYS kitchen</div><h2>Cook what<br /><i>India</i> loves.</h2>
          <p>Dal, biryani, rajma, kheer — chef-tested recipes for every RAYS vessel.</p>
          <a className="btn btn-red" href="#recipes"><span>See recipes</span><Icon name="arrow" /></a></div>
      </section>

      <section className="blk" id="recipes" style={{ background: 'var(--cream)' }}><div className="wrap">
        <div className="head rv"><div><div className="eyebrow">Recipes</div><h2>What will you<br /><i>cook</i> today?</h2></div><p>Every product comes with chef-tested recipes. Open any recipe to see the vessel it was made for.</p></div>
        <div className="recipes">{rec.map((r, i) => <RecipeCard key={r.slug} r={r} i={i} product={byId[recProduct[i]]} />)}</div>
      </div></section>

      {trio && <section className="festive">
        <Photo name="festive-diya-row" className="festive-bg" sizes="100vw" />
        <div className="wrap festive-in">
          <div className="rv">
            <div className="eyebrow">Festive gifting · Family Trio</div>
            <h2>One kitchen.<br />Three <i>cookers.</i></h2>
            <p>2 L for dal, 3 L for sabzi, 5 L for biryani Sundays — the complete Trinity set, with a free spare valve and gasket for each cooker.</p>
            <div className="festive-price"><Link className="btn btn-red" to="/p/combo3"><span>Shop the Trio</span><Icon name="arrow" /></Link><b>{inr(sale(trio.variants[0].mrp))}</b><s>{inr(trio.variants[0].mrp)}</s></div>
          </div>
          <Link className="festive-card rv" to="/p/combo3"><img src={asset(trio.variants[0].image)} alt="Trinity Family Trio" /><span className="big"><b>40%</b>OFF</span></Link>
        </div>
      </section>}

      <section className="split rev"><div className="split-img"><Photo name="make-steel-stack" alt="Polished stainless steel cookware stacked on a shelf" sizes="(max-width:900px) 100vw, 50vw" /></div>
        <div className="split-txt rv">
          <div className="eyebrow">Made in India</div>
          <h2>Made with care<br />in <i>Rajkot.</i></h2>
          <p>RAYS cookware is made by Rays Makers Pvt. Ltd. at Kuvadva GIDC, Rajkot. Our pressure cookers are ISI certified to IS 2347, and our Triply Tasra &amp; Top to IS 14756.</p>
          <ul className="ticks"><li>Lead-free SS 304 safety valve</li><li>Lids made from Jindal SS 304 sheet</li><li>Hindalco sheet for the hard-anodised range</li></ul>
        </div>
      </section>

      <div className="wrap"><div className="prom rv">
        <div><Icon name="shield" /><b>5 Year Warranty</b><p>On every Triply product.</p></div>
        <div><Icon name="gift" /><b>Free Valve &amp; Gasket</b><p>Spare safety valve and gasket with every cooker.</p></div>
        <div><Icon name="truck" /><b>Free Shipping</b><p>Delivered across India.</p></div>
        <div><Icon name="leaf" /><b>ISI · Made in India</b><p>BIS certified, made in Rajkot.</p></div>
      </div></div>
    </>
  );
}
