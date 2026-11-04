import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { smoothScroll } from '../utils.js';
import { Logo } from './ui.jsx';

const MESSAGES = [
  <>Festive Edit · Flat <b>40% OFF</b> on all Triply cookware</>,
  <>Free Safety Valve &amp; Gasket with every pressure cooker</>,
  <><b>5 Year</b> Warranty · ISI Certified · Made in India</>,
];

function Announce() {
  const [i, setI] = useState(0), [prev, setPrev] = useState(null);
  useEffect(() => {
    const t = setInterval(() => setI(n => { setPrev(n); return (n + 1) % MESSAGES.length; }), 3600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="announce">
      {MESSAGES.map((m, k) => <div key={k} className={k === i ? '' : k === prev ? 'out' : 'wait'}>{m}</div>)}
    </div>
  );
}

export default function Header() {
  const { count, bump, openCart, go } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const cntRef = useRef(), btnRef = useRef();
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(scrollY > 10);
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!bump) return;
    for (const [el, cls] of [[btnRef.current, 'bump'], [cntRef.current, 'pop']]) {
      el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    }
  }, [bump, count]);

  const link = (to, label) => <NavLink to={to} className={({ isActive }) => isActive ? 'on' : ''} onClick={e => { e.preventDefault(); go(to); }}>{label}</NavLink>;
  const toRecipes = e => {
    e.preventDefault();
    const scroll = () => { const el = document.getElementById('recipes'); if (el) smoothScroll(el.getBoundingClientRect().top + scrollY - 90, 1400); };
    if (pathname === '/') scroll(); else { go('/'); setTimeout(scroll, 900); }
  };

  return (
    <>
      <Announce />
      <header className={'top' + (scrolled ? ' scrolled' : '')}>
        <div className="wrap bar">
          <Logo onClick={e => { e.preventDefault(); go('/'); }} />
          <nav>
            {link('/shop/all', 'Shop All')}
            {link('/shop/cookers', 'Pressure Cookers')}
            {link('/shop/tasra-top', 'Tasra & Top')}
            {link('/shop/combos', 'Combos')}
            <a href="/#recipes" onClick={toRecipes}>Recipes</a>
          </nav>
          <div className="icons">
            <button className="ic" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></button>
            <button className="ic" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg></button>
            <button className="ic" aria-label="Account"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg></button>
            <button className="ic" id="cartBtn" ref={btnRef} aria-label="Cart" onClick={openCart}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
              <span ref={cntRef} className={'count' + (count ? ' show' : '')}>{count}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
