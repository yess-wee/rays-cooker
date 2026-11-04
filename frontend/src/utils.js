export const OFF = 0.4;
export const asset = name => `/assets/${name}.jpg`;
export const foodImg = name => `/assets/food/${name}.jpg`;
export const sale = mrp => Math.round(mrp * (1 - OFF));
export const inr = n => '₹' + n.toLocaleString('en-IN');

/** Ease a number towards `to` inside an element (used for the live price). */
export function countTo(el, to) {
  if (!el) return;
  const from = +el.textContent.replace(/\D/g, '') || 0, t0 = performance.now();
  const f = t => {
    const k = Math.min(1, (t - t0) / 600), e = 1 - Math.pow(1 - k, 3);
    el.textContent = inr(Math.round(from + (to - from) * e));
    if (k < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

/** Eased window scroll that returns a promise. */
export function smoothScroll(y, ms = 1200) {
  return new Promise(res => {
    const s = scrollY, d = y - s, t0 = performance.now();
    const f = t => {
      const k = Math.min(1, (t - t0) / ms), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      scrollTo(0, s + d * e);
      k < 1 ? requestAnimationFrame(f) : res();
    };
    requestAnimationFrame(f);
  });
}
