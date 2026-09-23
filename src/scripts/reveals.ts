import { gsap, motionOn, prefersReducedMotion, ScrollTrigger } from './motion';

/**
 * Scroll reveals that play once: section titles rise out of their mask, blocks
 * fade up in sequence, the About statement brightens word by word, the
 * experience line draws itself and the footer name rises letter by letter.
 * With reduced motion, blocks only fade and nothing moves.
 */
export function initReveals() {
  const on = motionOn();
  const blocks = gsap.utils.toArray<HTMLElement>('[data-reveal]');

  if (!on) {
    if (prefersReducedMotion() && blocks.length) {
      gsap.set(blocks, { opacity: 0 });
      ScrollTrigger.batch(blocks, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, duration: 0.4, ease: 'power1.out', stagger: 0.04 }),
      });
    }
    return;
  }

  gsap.utils.toArray<HTMLElement>('.section-title .mask > span').forEach((line) => {
    gsap.fromTo(
      line,
      // y: 0 drops the pixel offset GSAP derives from the CSS start state
      { y: 0, yPercent: 104 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: 'uiOut',
        scrollTrigger: { trigger: line.closest('.section-title'), start: 'top 88%', once: true },
      },
    );
  });

  ScrollTrigger.batch(blocks, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'uiOut', stagger: 0.06, overwrite: true },
      ),
  });

  gsap.utils.toArray<HTMLElement>('[data-tool-group]').forEach((group) => {
    gsap.fromTo(
      group.querySelectorAll('[data-tool]'),
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'uiOut',
        stagger: 0.03,
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      },
    );
  });

  // About: the statement is read at scroll speed, one word lighting up at a time.
  const statement = document.querySelector<HTMLElement>('[data-words]');
  if (statement) {
    gsap.fromTo(
      statement.querySelectorAll('.w'),
      { opacity: 0.18 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: 0.4 },
      },
    );
  }

  // Experience: the line grows with the scroll, and each role lights up as the line reaches it.
  const timeline = document.querySelector<HTMLElement>('[data-timeline]');
  if (timeline) {
    const fill = timeline.querySelector<HTMLElement>('[data-rail-fill]');
    if (fill) {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: timeline, start: 'top 62%', end: 'bottom 62%', scrub: 0.3 },
        },
      );
    }
    timeline.querySelectorAll<HTMLElement>('[data-entry]').forEach((entry) => {
      ScrollTrigger.create({
        trigger: entry,
        start: 'top 62%',
        onEnter: () => entry.classList.add('is-lit'),
        onLeaveBack: () => entry.classList.remove('is-lit'),
      });
      const body = entry.querySelector<HTMLElement>('[data-entry-body]');
      if (body) {
        gsap.fromTo(
          body,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'uiOut',
            scrollTrigger: { trigger: entry, start: 'top 82%', once: true },
          },
        );
      }
    });
  }

  const wordmark = document.querySelector<HTMLElement>('[data-wordmark]');
  if (wordmark) {
    gsap.fromTo(
      wordmark.querySelectorAll('.wm-ch'),
      { y: 0, yPercent: 100 },
      {
        yPercent: 0,
        duration: 1,
        ease: 'uiOut',
        stagger: 0.05,
        scrollTrigger: { trigger: wordmark, start: 'top 96%', once: true },
      },
    );
  }
}
