import { DESKTOP, gsap, motionOn } from './motion';

const revealTools = (group: Element, trigger: gsap.DOMTarget, extra: ScrollTrigger.Vars = {}) =>
  gsap.fromTo(
    group.querySelectorAll('[data-tool]'),
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'uiOut',
      stagger: 0.035,
      scrollTrigger: { trigger, start: 'top 80%', once: true, ...extra },
    },
  );

/**
 * Toolbox. On wide screens the section pins and its panels slide sideways
 * with the scroll; each panel swings in from an angle as it enters and its
 * tools pop in. Elsewhere it is a plain grid whose tools fade up.
 */
export function initToolbox() {
  const section = document.querySelector<HTMLElement>('[data-toolbox]');
  if (!section || !motionOn()) return;
  const pan = section.querySelector<HTMLElement>('[data-pan]');
  const track = section.querySelector<HTMLElement>('[data-pan-track]');
  const bar = section.querySelector<HTMLElement>('[data-pan-bar]');
  const groups = gsap.utils.toArray<HTMLElement>('[data-tool-group]', section);
  if (!pan || !track) return;

  const mm = gsap.matchMedia();

  mm.add(DESKTOP, () => {
    // offsetWidth ignores the tilted panels, which would inflate scrollWidth
    const distance = () => Math.max(0, track.offsetWidth - pan.clientWidth);
    // Pin once the title sits just under the nav, and scroll as far as the track is long.
    const pinStart = () => `top+=${Math.max(0, parseFloat(getComputedStyle(section).paddingTop) - 96)} top`;
    const move = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: pinStart,
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (bar) bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
        },
      },
    });

    groups.forEach((group) => {
      gsap.fromTo(
        group,
        { rotationY: -18, transformPerspective: 1200, transformOrigin: '0% 50%' },
        {
          rotationY: 0,
          ease: 'none',
          scrollTrigger: { trigger: group, containerAnimation: move, start: 'left right', end: 'left 60%', scrub: true },
        },
      );
      const inView = group.offsetLeft < pan.clientWidth;
      if (inView) revealTools(group, section, { start: 'top 70%' });
      else revealTools(group, group, { containerAnimation: move, start: 'left 85%' });
    });
  });

  mm.add('(max-width: 900px), (max-height: 620px)', () => {
    groups.forEach((group) => revealTools(group, group, { start: 'top 88%' }));
  });
}
