import { gsap, motionOn } from './motion';

/**
 * Selected work. On wide screens each card sticks under the nav (CSS sticky),
 * and while the next card slides up over it, the current one shrinks a little
 * and darkens, so the cards read as a pile being dealt. On small screens cards
 * are a plain list that fades up.
 */
export function initStack() {
  const stack = document.querySelector<HTMLElement>('[data-stack]');
  if (!stack || !motionOn()) return;

  const cards = gsap.utils.toArray<HTMLElement>('[data-stack-card]', stack);
  // Sentinels sit where each card starts in the flow. They never stick, so
  // their position is a reliable trigger even while the card itself is stuck.
  const sentinels = gsap.utils.toArray<HTMLElement>('[data-stack-sentinel]', stack);
  const mm = gsap.matchMedia();

  mm.add('(min-width: 901px) and (min-height: 621px)', () => {
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      const nextStart = sentinels[i + 1];
      if (!next || !nextStart) return;
      const dim = card.querySelector<HTMLElement>('[data-stack-dim]');
      const stickAt = () => parseFloat(getComputedStyle(next).top) || 0;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: nextStart,
          start: 'top bottom',
          end: () => `top ${stickAt()}px`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      tl.to(card, { scale: 0.92, ease: 'none' }, 0);
      if (dim) tl.to(dim, { opacity: 0.5, ease: 'none' }, 0);
    });
  });

  mm.add('(max-width: 900px), (max-height: 620px)', () => {
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'uiOut', scrollTrigger: { trigger: card, start: 'top 90%', once: true } },
      );
    });
  });
}
