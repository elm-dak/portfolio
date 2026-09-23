import { Flip, gsap, motionOn } from './motion';

/**
 * Filters the project archive. Cards that stay glide to their new place,
 * cards that leave fade out, cards that arrive fade in (GSAP Flip).
 */
export function initArchive() {
  const group = document.querySelector<HTMLElement>('[data-filters]');
  const grid = document.querySelector<HTMLElement>('[data-archive]');
  if (!group || !grid) return;

  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const items = Array.from(grid.querySelectorAll<HTMLElement>('[data-archive-item]'));
  const status = document.querySelector<HTMLElement>('[data-filter-status]');
  let current = 'all';
  let running: gsap.core.Timeline | null = null;

  const apply = (filter: string) => {
    if (filter === current) return;
    current = filter;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));

    const matches = (el: HTMLElement) => filter === 'all' || (el.dataset.cats ?? '').split(' ').includes(filter);
    const count = items.filter(matches).length;
    if (status) status.textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown`;

    if (!motionOn()) {
      items.forEach((el) => (el.hidden = !matches(el)));
      return;
    }

    running?.progress(1); // a second click finishes the first animation instead of fighting it
    const state = Flip.getState(items, { props: 'opacity' });
    const before = grid.offsetHeight;
    items.forEach((el) => (el.hidden = !matches(el)));
    const after = grid.offsetHeight;
    running = Flip.from(state, {
      duration: 0.45,
      ease: 'uiInOut',
      absolute: true,
      // Height is the one layout property animated here: without it the content
      // below jumps while the cards are still moving.
      onStart: () => {
        gsap.fromTo(grid, { height: before }, { height: after, duration: 0.45, ease: 'uiInOut', clearProps: 'height' });
      },
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.3, delay: 0.12, ease: 'uiOut' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.96, duration: 0.2, ease: 'uiOut' }),
    });
  };

  buttons.forEach((button) => button.addEventListener('click', () => apply(button.dataset.filter ?? 'all')));
}
