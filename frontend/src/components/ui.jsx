import { useEffect } from 'react';
import { ICON } from '../data/icons.js';

/** Inline SVG icon from the shared icon set. */
export const Icon = ({ name, ...rest }) => <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: ICON[name] }} {...rest} />;

export const Lambda = ({ color = '#d0102b', width = 2.6 }) => (
  <svg viewBox="0 0 20 20"><path d="M2 19 L10 2 L18 19" fill="none" stroke={color} strokeWidth={width} /></svg>
);

export const Logo = ({ light, onClick }) => (
  <a className="logo" style={light ? { color: '#fff' } : undefined} onClick={onClick} href="/" aria-label="RAYS home">
    <b>R<Lambda color={light ? '#ff2a45' : '#d0102b'} />YS</b><small>BEST NEVER LIES</small>
  </a>
);

export const Stars = ({ size }) => <span className="stars" style={size ? { fontSize: size } : undefined}>★★★★★</span>;

/** Adds `.in` to every `.rv` element as it scrolls into view (re-run when `deps` change). */
export function useReveal(deps = []) {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      e.target.querySelectorAll('[data-count]').forEach(el => {
        const to = +el.dataset.count, t0 = performance.now();
        const f = t => { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + (el.dataset.suf || ''); if (k < 1) requestAnimationFrame(f); };
        requestAnimationFrame(f);
      });
    }), { threshold: .15 });
    document.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
