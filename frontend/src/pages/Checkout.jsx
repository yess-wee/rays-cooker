import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../api.js';
import { Icon, Lambda, useReveal } from '../components/ui.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { asset, inr, sale } from '../utils.js';

const FIELDS = [['name', 'Full name'], ['phone', 'Mobile number'], ['email', 'Email address', 'full'], ['address', 'House no., street, area', 'full'], ['city', 'City'], ['pin', 'PIN code']];
const MSGS = ['Securing your payment…', 'Talking to your bank…', 'Confirming your order…'];

export default function Checkout({ onOrder }) {
  const navigate = useNavigate();
  const { cart, setCart, total, mrpTotal, products, addToCart } = useStore();
  const [customer, setCustomer] = useState({});
  const [pay, setPay] = useState('upi');
  const [step, setStep] = useState(2);
  const [card, setCard] = useState({ num: '', name: '', exp: '', cvv: '' });
  const [flip, setFlip] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [proc, setProc] = useState(null);
  useReveal([]);

  useEffect(() => { if (!cart.length) addToCart('trinity', 3, 1); }, []); // eslint-disable-line

  const qr = useMemo(() => Array.from({ length: 144 }, (_, i) => {
    const x = i % 12, y = (i / 12) | 0, fin = (x < 3 && y < 3) || (x > 8 && y < 3) || (x < 3 && y > 8);
    return <i key={i} className={fin ? '' : ((x * 7 + y * 13 + x * y) % 3) ? '' : 'o'} />;
  }), []);

  const digits = card.num.replace(/\D/g, '');
  const cardNum = (digits + '•'.repeat(16 - digits.length)).replace(/(.{4})/g, '$1 ').trim();
  const toPay = total - discount;

  const submit = async () => {
    setProc(0);
    MSGS.forEach((_, i) => setTimeout(() => setProc(i), i * 1100));
    const payload = { items: cart.map(c => ({ productId: c.id, variant: c.size, quantity: c.q })), customer, paymentMethod: pay, coupon: discount ? (coupon || 'RAYSFEST') : '' };
    const [order] = await Promise.all([placeOrder(payload, products), new Promise(r => setTimeout(r, 3500))]);
    onOrder(order); setCart([]);
    navigate('/order/' + order.id);
    setTimeout(() => setProc(null), 400);
  };

  return (
    <div className="wrap">
      <div className="steps-bar"><div className="done"><i>✓</i>Bag</div><hr />
        <div className={step > 2 ? 'done' : 'on'}><i>{step > 2 ? '✓' : 2}</i>Address</div><hr />
        <div className={step > 2 ? 'on' : ''}><i>3</i>Payment</div><hr /><div><i>4</i>Confirmed</div></div>
      <div className="co" style={{ paddingTop: 0 }}>
        <div>
          <div className="panel rv in"><h3>Delivery details <small>Step 2 of 4</small></h3>
            <div className="fg">{FIELDS.map(([k, l, full]) => (
              <div className={'fld' + (full ? ' full' : '')} key={k}><input id={'f-' + k} placeholder=" " value={customer[k] || ''} onChange={e => setCustomer(c => ({ ...c, [k]: e.target.value }))} /><label>{l}</label></div>
            ))}</div></div>
          <div className="panel rv in" id="payPanel" onFocus={() => setStep(3)}>
            <h3>Payment <small>Secured &amp; encrypted</small></h3>
            <div className="pay-tabs">
              {[['upi', 'UPI', <path key="a" d="M7 3h10v18H7zM11 18h2" />], ['card', 'Card', <path key="b" d="M2 5h20v14H2zM2 10h20" />], ['nb', 'Net banking', <path key="c" d="M3 10 12 4l9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" />], ['cod', 'Cash on delivery', <path key="d" d="M2 6h20v12H2zM9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0" />]].map(([k, l, d]) => (
                <button key={k} data-pay={k} className={pay === k ? 'on' : ''} onClick={() => { setPay(k); setStep(3); }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{d}</svg>{l}</button>
              ))}
            </div>
            {pay === 'upi' && <div className="paypane on">
              <div className="upi-apps"><button className="on">Any UPI app</button><button>Pay by QR</button><button>UPI ID</button></div>
              <div className="qr"><div className="code">{qr}</div><div><b style={{ fontSize: 17 }}>Scan &amp; pay {inr(toPay)}</b><p style={{ color: 'var(--mute)', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>Open any UPI app and scan this code.<br />This is a simulated payment — no money moves.</p></div></div>
            </div>}
            {pay === 'card' && <div className="paypane on">
              <div className={'cardviz' + (flip ? ' flip' : '')}><div className="in3">
                <div className="face"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}><span className="logo" style={{ color: '#fff' }}><b style={{ fontSize: 18 }}>R<Lambda color="#ff2a45" />YS</b></span><span style={{ fontWeight: 700, fontStyle: 'italic', letterSpacing: '.06em' }}>VISA</span></div>
                  <div className="chipi" /><div className="cnum">{cardNum}</div>
                  <div className="crow"><div>Card holder<b>{card.name.toUpperCase() || 'YOUR NAME'}</b></div><div>Expires<b>{card.exp || 'MM/YY'}</b></div></div></div>
                <div className="face back"><div className="strip" /><div className="cvv">{'•'.repeat(card.cvv.length) || '•••'}</div><p style={{ fontSize: 10, opacity: .6, marginTop: 24, position: 'relative' }}>Simulated card for preview purposes only.</p></div>
              </div></div>
              <div className="fg">
                <div className="fld full"><input id="c-num" placeholder=" " maxLength={19} value={card.num} onChange={e => setCard(c => ({ ...c, num: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }))} /><label>Card number</label></div>
                <div className="fld full"><input id="c-name" placeholder=" " value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} /><label>Name on card</label></div>
                <div className="fld"><input id="c-exp" placeholder=" " maxLength={5} value={card.exp} onChange={e => { let v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); setCard(c => ({ ...c, exp: v })); }} /><label>Expiry (MM/YY)</label></div>
                <div className="fld"><input id="c-cvv" placeholder=" " maxLength={3} value={card.cvv} onFocus={() => setFlip(true)} onBlur={() => setFlip(false)} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '') }))} /><label>CVV</label></div>
              </div>
            </div>}
            {pay === 'nb' && <div className="paypane on"><p style={{ color: 'var(--mute)' }}>Choose your bank on the next screen.</p></div>}
            {pay === 'cod' && <div className="paypane on"><p style={{ color: 'var(--mute)' }}>Pay in cash when your order arrives. ₹49 handling fee.</p></div>}
          </div>
        </div>
        <aside className="summary rv in">
          <h3>Order summary</h3>
          {cart.map(c => <div className="it" key={c.key}><img src={asset(c.img)} alt="" /><div><h4>{c.name}</h4><small>{c.size} · Qty {c.q}</small></div><div className="r">{inr(sale(c.mrp) * c.q)}<s>{inr(c.mrp * c.q)}</s></div></div>)}
          <div className="coupon"><input id="coupon" placeholder="Coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} /><button id="applyC" onClick={() => { if (!coupon) setCoupon('RAYSFEST'); setDiscount(250); }}>Apply</button></div>
          <div className={'applied' + (discount ? ' on' : '')}>✓ RAYSFEST applied — extra ₹250 off</div>
          <div className="df" style={{ background: 'none', border: 0, padding: '6px 0 0' }}>
            <div className="ln"><span>MRP total</span><span>{inr(mrpTotal)}</span></div>
            <div className="ln sv"><span>Festive discount</span><span>− {inr(mrpTotal - total)}</span></div>
            {discount > 0 && <div className="ln sv"><span>Coupon RAYSFEST</span><span>− ₹250</span></div>}
            <div className="ln"><span>Shipping</span><span style={{ color: '#1a8a4f', fontWeight: 600 }}>FREE</span></div>
            <div className="ln t"><span>To pay</span><span>{inr(toPay)}</span></div>
            <button className="btn btn-red" id="payBtn" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }} onClick={submit} disabled={proc !== null || !cart.length}><Icon name="lock" /><span>Pay {inr(toPay)}</span></button>
            <div className="secure"><Icon name="lock" /> 100% secure payments · Simulated for preview</div>
          </div>
        </aside>
      </div>
      <div id="proc" className={proc !== null ? 'on' : ''}><div>
        <div className="spin"><svg className="r" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" /><path d="M50 4 A46 46 0 0 1 96 50" fill="none" stroke="#ff2a45" strokeWidth="3" strokeLinecap="round" /></svg><span className="lam" style={{ display: 'block' }}><Lambda color="#fff" width={2} /></span></div>
        <p>{MSGS[proc || 0]}</p><small>256-bit encrypted · Do not refresh</small>
      </div></div>
    </div>
  );
}
