import { gsap, motionOn, ScrollTrigger } from './motion';

const DRIFT = 55; // px per second when the page is still
const MAX_BOOST = 7; // how much faster it runs while scrolling hard
const MAX_SKEW = 10; // degrees

/**
 * Two rows of giant words drift in opposite directions. Scrolling pushes them
 * faster and leans them with the speed, and scrolling up turns them around.
 * The loop only runs while the band is on screen.
 */
export function initBand() {
  const band = document.querySelector<HTMLElement>('[data-band]');
  if (!band || !motionOn()) return;

  const rows = Array.from(band.querySelectorAll<HTMLElement>('[data-band-row]')).map((row) => ({
    track: row.querySelector<HTMLElement>('[data-band-track]')!,
    dir: Number(row.dataset.dir) || -1,
    x: 0,
    width: 1,
  }));

  const measure = () =>
    rows.forEach((r) => {
      r.width = r.track.scrollWidth / 2 || 1; // one copy of the words
      if (r.dir === 1 && r.x === 0) r.x = -r.width;
    });
  measure();
  ScrollTrigger.addEventListener('refresh', measure);

  let heading = 1; // 1 while scrolling down, -1 while scrolling up
  let velocity = 0;
  let skew = 0;

  const tick = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 64) / 1000;
    const boost = 1 + Math.min(Math.abs(velocity) / 350, MAX_BOOST);
    velocity *= 0.9;
    const targetSkew = gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, -velocity / 180);
    skew += (targetSkew - skew) * 0.12;
    rows.forEach((r) => {
      r.x += r.dir * heading * DRIFT * boost * dt;
      // keep x in (-width, 0] so one copy always covers the screen
      r.x = ((r.x % r.width) - r.width) % r.width;
      r.track.style.transform = `translate3d(${r.x.toFixed(2)}px, 0, 0) skewX(${(skew * r.dir).toFixed(2)}deg)`;
    });
  };

  ScrollTrigger.create({
    trigger: band,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate(self) {
      velocity = self.getVelocity();
      heading = self.direction;
    },
    onToggle(self) {
      if (self.isActive) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    },
  });
}
