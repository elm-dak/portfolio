import { finePointer, motionOn } from './motion';

/**
 * Buttons marked data-magnetic lean toward the pointer and spring back when it
 * leaves. Uses the `translate` property, so the CSS press effect on `transform`
 * keeps working alongside it.
 */
export function initMagnetic() {
  if (!motionOn() || !finePointer()) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.3;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      frame = Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };
    el.addEventListener('pointermove', (event) => {
      const r = el.getBoundingClientRect();
      tx = (event.clientX - (r.left + r.width / 2)) * strength;
      ty = (event.clientY - (r.top + r.height / 2)) * strength;
      kick();
    });
    el.addEventListener('pointerleave', () => {
      tx = 0;
      ty = 0;
      kick();
    });
  });
}
