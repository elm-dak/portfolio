import { decodeText } from './decode';
import { DESKTOP, finePointer, gsap, motionOn, ScrollTrigger, SplitText } from './motion';

/**
 * Selected work. On wide screens each card sticks under the nav (CSS sticky).
 * A card is dealt onto the pile: it rises tilted back and flattens as it lands,
 * its screenshots arriving at different depths. While the next card slides
 * over it, it shrinks a little and darkens. On small screens cards fade up.
 */
export function initStack() {
  const stack = document.querySelector<HTMLElement>('[data-stack]');
  if (!stack || !motionOn()) return;

  const cards = gsap.utils.toArray<HTMLElement>('[data-stack-card]', stack);
  // Sentinels sit where each card starts in the flow. They never stick, so
  // their position is a reliable trigger even while the card itself is stuck.
  const sentinels = gsap.utils.toArray<HTMLElement>('[data-stack-sentinel]', stack);

  // Every screen size: the name rises letter by letter and the meta line decodes.
  cards.forEach((card) => {
    const name = card.querySelector<HTMLElement>('.card-name');
    const meta = card.querySelector<HTMLElement>('[data-card-meta]');
    if (name) {
      const split = SplitText.create(name, { type: 'chars' });
      gsap.fromTo(
        split.chars,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: 'uiOut',
          stagger: 0.035,
          scrollTrigger: { trigger: card, start: 'top 70%', once: true },
        },
      );
    }
    if (meta) {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 70%',
        once: true,
        onEnter: () => decodeText(meta, { duration: 700 }),
      });
    }
  });

  const mm = gsap.matchMedia();

  mm.add(DESKTOP, () => {
    cards.forEach((card, i) => {
      const start = sentinels[i];
      const stickAt = () => parseFloat(getComputedStyle(card).top) || 0;

      // Dealt onto the pile
      if (start) {
        const copy = card.querySelector('.card-copy');
        const desktop = card.querySelector('[data-shot-desktop]');
        const phone = card.querySelector('[data-shot-phone]');
        const deal = gsap.timeline({
          scrollTrigger: {
            trigger: start,
            start: 'top bottom',
            end: () => `top ${stickAt()}px`,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
        deal.fromTo(
          card,
          { rotationX: 16, transformPerspective: 1600 },
          { rotationX: 0, ease: 'none' },
          0,
        );
        if (copy) deal.fromTo(copy, { y: 70, opacity: 0.35 }, { y: 0, opacity: 1, ease: 'none' }, 0);
        if (desktop) deal.fromTo(desktop, { y: 110 }, { y: 0, ease: 'none' }, 0);
        if (phone) deal.fromTo(phone, { y: 240, rotation: 6 }, { y: 0, rotation: 0, ease: 'none' }, 0);
      }

      // Pushed back under the next one
      const next = cards[i + 1];
      const nextStart = sentinels[i + 1];
      if (!next || !nextStart) return;
      const dim = card.querySelector<HTMLElement>('[data-stack-dim]');
      const nextStickAt = () => parseFloat(getComputedStyle(next).top) || 0;
      const under = gsap.timeline({
        scrollTrigger: {
          trigger: nextStart,
          start: 'top bottom',
          end: () => `top ${nextStickAt()}px`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      // Both effects pivot on the top edge (transform-origin in Work.astro)
      under.to(card, { scale: 0.9, ease: 'none' }, 0);
      if (dim) under.to(dim, { opacity: 0.55, ease: 'none' }, 0);
    });

    // "Open" pill follows the pointer over the screenshots.
    if (finePointer()) {
      stack.querySelectorAll<HTMLElement>('[data-follow-area]').forEach((area) => {
        const pill = area.querySelector<HTMLElement>('[data-follow]');
        if (!pill) return;
        gsap.set(pill, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.6 });
        const moveX = gsap.quickTo(pill, 'x', { duration: 0.45, ease: 'uiOut' });
        const moveY = gsap.quickTo(pill, 'y', { duration: 0.45, ease: 'uiOut' });
        const at = (event: PointerEvent) => {
          const r = area.getBoundingClientRect();
          return [event.clientX - r.left, event.clientY - r.top];
        };
        area.addEventListener('pointerenter', (event) => {
          const [x, y] = at(event);
          moveX(x, x);
          moveY(y, y);
          gsap.to(pill, { opacity: 1, scale: 1, duration: 0.25, ease: 'uiOut', overwrite: 'auto' });
        });
        area.addEventListener('pointermove', (event) => {
          const [x, y] = at(event);
          moveX(x);
          moveY(y);
        });
        area.addEventListener('pointerleave', () => {
          gsap.to(pill, { opacity: 0, scale: 0.6, duration: 0.2, ease: 'uiOut', overwrite: 'auto' });
        });
      });
    }
  });

  mm.add('(max-width: 900px), (max-height: 620px)', () => {
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'uiOut',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        },
      );
    });
  });
}
