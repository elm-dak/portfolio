import { finePointer, gsap, motionOn, wait } from './motion';

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=<>/';
const STEP_MS = 34; // how long each random glyph stays
const CYCLES = 7; // glyphs shown before a letter settles
const CHAR_DELAY_MS = 42; // letters start one after another, left to right

/**
 * Decodes a line of the name: each letter appears as a few random glyphs, then
 * settles on the real letter. The real letter keeps its box the whole time
 * (it is only made transparent), so the line never changes width.
 */
function decode(line: HTMLElement, delay: number): Promise<void> {
  const chars = Array.from(line.querySelectorAll<HTMLElement>('.ch:not(.sp)'));
  const glyphs = chars.map((char) => {
    const glyph = document.createElement('span');
    glyph.className = 'glyph';
    glyph.setAttribute('aria-hidden', 'true');
    char.classList.add('is-waiting');
    char.append(glyph);
    return glyph;
  });

  return new Promise((resolve) => {
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now + delay;
      let settled = 0;
      chars.forEach((char, i) => {
        const begin = start + i * CHAR_DELAY_MS;
        const end = begin + CYCLES * STEP_MS;
        const glyph = glyphs[i];
        if (now < begin) return;
        if (now >= end) {
          if (glyph.isConnected) {
            glyph.remove();
            char.classList.remove('is-waiting', 'is-scrambling');
          }
          settled += 1;
          return;
        }
        if (char.classList.contains('is-waiting')) {
          char.classList.replace('is-waiting', 'is-scrambling');
        }
        const frame = String(Math.floor((now - begin) / STEP_MS));
        if (glyph.dataset.frame !== frame) {
          glyph.dataset.frame = frame;
          glyph.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      });
      if (settled < chars.length) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

export function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero || !motionOn()) return; // without motion, CSS shows the hero as it is

  const name = hero.querySelector<HTMLElement>('[data-hero-name]');
  const lines = Array.from(hero.querySelectorAll<HTMLElement>('[data-scramble]'));
  const lead = Array.from(hero.querySelectorAll<HTMLElement>('.hero-in'));
  const figure = hero.querySelector<HTMLElement>('[data-portrait]');
  const panel = hero.querySelector<HTMLElement>('[data-portrait-panel]');
  const depth = hero.querySelector<HTMLElement>('[data-portrait-depth]');
  const image = hero.querySelector<HTMLElement>('[data-portrait-img]');

  const intro = () => {
    const [eyebrow, ...rest] = lead;
    const tl = gsap.timeline();
    if (panel) {
      // The portrait is uncovered from the bottom up, then the clip is dropped.
      tl.fromTo(
        panel,
        { clipPath: 'inset(100% 0% 0% 0% round 28px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.1, ease: 'uiInOut' },
        0,
      );
      // CSS holds the hidden start state while motion is on, so the end state stays inline.
      tl.set(panel, { clipPath: 'none' }, 1.1);
    }
    if (image) {
      tl.fromTo(image, { y: 0, yPercent: 6, scale: 1.06 }, { yPercent: 0, scale: 1, duration: 1.4, ease: 'uiOut' }, 0.1);
    }
    if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'uiOut' }, 0.05);
    if (rest.length) {
      tl.fromTo(rest, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: 'uiOut', stagger: 0.07 }, 0.5);
    }
    if (name) name.style.visibility = 'visible';
    lines.forEach((line, i) => decode(line, 80 + i * 160));
  };

  // Decode with the real font so letter boxes do not change size mid-way.
  Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(900)]).then(intro);

  // Scrolling away: the two lines of the name slide apart, the copy lifts and
  // fades, and the portrait tips back as if it is being put down.
  const copy = hero.querySelector<HTMLElement>('.hero-copy');
  const exit = gsap.timeline({
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.4 },
  });
  if (lines[0]) exit.to(lines[0], { xPercent: -16, ease: 'none' }, 0);
  if (lines[1]) exit.to(lines[1], { xPercent: 16, ease: 'none' }, 0);
  if (copy) exit.to(copy, { yPercent: -10, opacity: 0.1, ease: 'none' }, 0);
  if (figure) {
    exit.to(figure, { scale: 0.84, rotation: -5, yPercent: -8, transformPerspective: 1100, rotationX: 14, ease: 'none' }, 0);
  }
  if (depth) exit.to(depth, { yPercent: 10, ease: 'none' }, 0);

  // The portrait panel leans a few degrees toward the pointer.
  if (panel && finePointer()) {
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    const loop = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      panel.style.transform = `perspective(1100px) rotateX(${y.toFixed(3)}deg) rotateY(${x.toFixed(3)}deg)`;
      frame = Math.abs(targetX - x) > 0.01 || Math.abs(targetY - y) > 0.01 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
      kick();
    });
    hero.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      kick();
    });
  }
}
