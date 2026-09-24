const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=<>/';

/**
 * Decodes a short monospace text in place: letters settle from left to right
 * while the ones not settled yet flicker through random glyphs. Monospace keeps
 * the width steady. Returns a promise that resolves once the text is final.
 */
export function decodeText(el: HTMLElement, { duration = 700, delay = 0 } = {}): Promise<void> {
  const finalText = el.dataset.decodeText ?? el.textContent ?? '';
  el.dataset.decodeText = finalText;
  const chars = [...finalText];
  return new Promise((resolve) => {
    let start = 0;
    let last = -1;
    const tick = (now: number) => {
      if (!start) start = now + delay;
      const t = Math.max(0, (now - start) / duration);
      if (t >= 1) {
        el.textContent = finalText;
        resolve();
        return;
      }
      const step = Math.floor((now - start) / 40);
      if (now >= start && step !== last) {
        last = step;
        const settled = Math.floor(t * chars.length);
        el.textContent = chars
          .map((c, i) => (i < settled || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('');
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
