import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui.jsx';
import { asset, inr } from '../utils.js';

function confetti(c) {
  const x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const cols = ['#d0102b', '#150737', '#c8a165', '#ff6b7e', '#ffffff', '#3a2d6b'];
  const ps = Array.from({ length: 220 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 26, vy: -Math.random() * 22 - 6, s: Math.random() * 10 + 5, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[(Math.random() * cols.length) | 0] }));
  let f = 0, raf;
  (function loop() {
    x.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => { p.vy += .55; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); });
    if (f++ < 240) raf = requestAnimationFrame(loop); else x.clearRect(0, 0, c.width, c.height);
  })();
  return () => cancelAnimationFrame(raf);
}

const fmt = d => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

export default function Success({ order }) {
  const canvas = useRef();
  const [go, setGo] = useState(false), [packed, setPacked] = useState(false);
  useEffect(() => {
    const stop = confetti(canvas.current);
    const t1 = setTimeout(() => setGo(true), 300), t2 = setTimeout(() => setPacked(true), 3100);
    return () => { stop(); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!order) return <div className="wrap ok"><h1>No order <i>yet.</i></h1><Link className="btn btn-dark" to="/shop/all"><span>Start shopping</span></Link></div>;
  const eta = fmt(order.estimatedDelivery);
  return (
    <div className="wrap"><div className="ok">
      <canvas id="confetti" ref={canvas} />
      <div className="tick"><svg width="70" height="70" viewBox="0 0 50 50"><path d="M12 26 L21 35 L39 16" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      <h1>Order <i>confirmed.</i></h1>
      <p style={{ color: 'var(--mute)', fontSize: 17 }}>Thank you{order.customer?.name ? ', ' + order.customer.name.split(' ')[0] : ''}! Your RAYS cookware is being packed with care.</p>
      <div className="oid">Order {order.id} · Paid {inr(order.total)} · Arriving {eta}</div>
      <div className={'track' + (go ? ' go' : '')}><span className="fill" />
        <div className="d"><i>✓</i>Ordered<small>Today, {new Date(order.placedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</small></div>
        <div className={packed ? 'd' : ''}><i>2</i>Packed<small>Tomorrow</small></div><div><i>3</i>Shipped<small>In transit</small></div><div><i>4</i>Delivered<small>{eta}</small></div>
      </div>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 60, flexWrap: 'wrap' }}>
        {order.items.map(c => (
          <div key={c.productId + c.variant} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 4, padding: '14px 20px 14px 14px', display: 'flex', gap: 14, alignItems: 'center', textAlign: 'left' }}>
            <img src={asset(c.image)} style={{ width: 70, height: 70, objectFit: 'contain' }} alt="" />
            <div><b style={{ fontSize: 14 }}>{c.name}</b><small style={{ display: 'block', color: 'var(--mute)', marginTop: 4 }}>{c.variant} · Qty {c.quantity}</small></div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 50 }}><Link className="btn btn-dark" to="/shop/all"><span>Continue shopping</span><Icon name="arrow" /></Link><Link className="btn btn-line" to="/">Register warranty</Link></div>
    </div></div>
  );
}
