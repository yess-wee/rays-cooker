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

/** Free Unsplash photo: 1920px for normal screens, the 3840px (4K) original for large/retina ones. */
export const Photo = ({ name, alt = '', className, sizes = '100vw', eager }) => (
  <img className={className} src={`/assets/photos/${name}.jpg`} srcSet={`/assets/photos/${name}.jpg 1920w, /assets/photos/4k/${name}.jpg 3840w`}
    sizes={sizes} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
);

/** Floating WhatsApp chat button to RAYS customer care. */
export const WhatsApp = () => (
  <a className="wa" href="https://wa.me/919427949416?text=Hi%20RAYS%2C%20I%20have%20a%20question%20about%20your%20cookware" target="_blank" rel="noopener noreferrer" aria-label="Chat with RAYS on WhatsApp">
    <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3Zm0 23.4c-2.1 0-4.1-.6-5.9-1.6l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.8C5.1 9.9 10 5.1 16 5.1s10.9 4.8 10.9 10.7S22 26.4 16 26.4Zm6-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.1l-1 1.2c-.2.2-.4.3-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.8.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 2.1.9 3 1 4 .8.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.3Z"/></svg>
    <span>Chat with us</span>
  </a>
);

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
