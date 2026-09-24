import Lenis from 'lenis';
import { gsap, motionOn, ScrollTrigger } from './motion';

let lenis: Lenis | null = null;

const MOUSE_LERP = 0.1;
const TOUCHPAD_LERP = 0.3;

/**
 * Smooth wheel scrolling, driven by GSAP's ticker so every pin and scrub moves
 * in step with it. Touch keeps the phone's own native scrolling.
 */
export function initSmoothScroll() {
  if (lenis || !motionOn()) return;
  lenis = new Lenis({ lerp: MOUSE_LERP, smoothWheel: true, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Mouse wheels send whole steps and get the full glide. Touchpads already
  // glide on their own, so they follow more closely instead of lagging.
  window.addEventListener(
    'wheel',
    (event) => {
      if (!lenis) return;
      const step = Math.abs(event.deltaY);
      const touchpad = event.deltaMode === 0 && (step < 40 || !Number.isInteger(step));
      lenis.options.lerp = touchpad ? TOUCHPAD_LERP : MOUSE_LERP;
    },
    { capture: true, passive: true },
  );

  // Same-page links glide to their section, leaving room for the nav.
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || link.hasAttribute('data-menu-link')) return;
    const hash = link.getAttribute('href') ?? '';
    const target = hash === '#top' ? 0 : document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target === null) return;
    event.preventDefault();
    scrollToTarget(target);
    history.replaceState(null, '', hash);
  });
}

/**
 * Scrolls to a section so its heading lands just under the nav, skipping the
 * section's top padding. Aims at the heading block, which has no scroll-margin
 * of its own, so the offset below is the only gap.
 */
export function scrollToTarget(target: HTMLElement | number) {
  const aim =
    typeof target === 'number' ? target : (target.querySelector<HTMLElement>('.section-head, .contact-head, .about-lead') ?? target);
  const offset = typeof aim === 'number' ? 0 : -(aim === target ? 0 : 104);
  if (lenis) {
    lenis.scrollTo(aim, { offset, duration: 1.4 });
    return;
  }
  const top = typeof aim === 'number' ? aim : aim.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: motionOn() ? 'smooth' : 'auto' });
}

/** Freezes the page behind a dialog. Without smooth scrolling, overflow does the job. */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
    return;
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
