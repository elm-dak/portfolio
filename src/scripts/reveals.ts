import { decodeText } from './decode';
import { finePointer, gsap, motionOn, prefersReducedMotion, ScrollTrigger, SplitText } from './motion';

/**
 * Scroll choreography for the page sections. With reduced motion, blocks only
 * fade in and nothing moves, pins or scrubs.
 */
export function initReveals() {
  const blocks = gsap.utils.toArray<HTMLElement>('[data-reveal]');

  if (!motionOn()) {
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

  titles();
  ScrollTrigger.batch(blocks, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'uiOut', stagger: 0.07, overwrite: true },
      ),
  });
  about();
  experience();
  archive();
  contact();
  footer();
}

/** Section titles are built letter by letter: each one rises out of its line with a small twist. */
function titles() {
  gsap.utils.toArray<HTMLElement>('.section-title .mask > span').forEach((line) => {
    const split = SplitText.create(line, { type: 'lines,words,chars', mask: 'lines' });
    // The line was parked below its mask by CSS; the letters take over from here.
    gsap.set(line, { y: 0, yPercent: 0 });
    gsap.fromTo(
      split.chars,
      { yPercent: 118, rotation: 9, transformOrigin: '0% 100%' },
      {
        yPercent: 0,
        rotation: 0,
        duration: 1,
        ease: 'uiOut',
        stagger: 0.024,
        scrollTrigger: { trigger: line.closest('.section-title'), start: 'top 86%', once: true },
      },
    );
  });
}

function about() {
  // The statement holds still while it is read, one word lighting up at a time.
  const lead = document.querySelector<HTMLElement>('[data-about-pin]');
  const statement = document.querySelector<HTMLElement>('[data-words]');
  if (lead && statement) {
    gsap
      .timeline({
        scrollTrigger: { trigger: lead, start: 'center 52%', end: '+=85%', pin: true, scrub: 0.5 },
      })
      .fromTo(statement.querySelectorAll('.w'), { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.1 });
  }

  // Numbers count up from zero once.
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    const state = { n: 0 };
    el.textContent = `0${suffix}`;
    gsap.to(state, {
      n: target,
      duration: 1.6,
      ease: 'uiOut',
      onUpdate: () => {
        el.textContent = `${Math.round(state.n)}${suffix}`;
      },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/** The line grows with the scroll; each role lights up, pulses and decodes its dates when reached. */
function experience() {
  const timeline = document.querySelector<HTMLElement>('[data-timeline]');
  if (!timeline) return;
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
    const dates = entry.querySelector<HTMLElement>('[data-decode]');
    let decoded = false;
    ScrollTrigger.create({
      trigger: entry,
      start: 'top 62%',
      onEnter: () => {
        entry.classList.add('is-lit');
        if (dates && !decoded) {
          decoded = true;
          decodeText(dates, { duration: 650 });
        }
      },
      onLeaveBack: () => entry.classList.remove('is-lit'),
    });
    const body = entry.querySelector<HTMLElement>('[data-entry-body]');
    if (!body) return;
    const parts = body.querySelectorAll(':scope > *');
    // Slides in from the side on wide screens, rises on phones where there is no room to the side
    const wide = matchMedia('(min-width: 761px)').matches;
    gsap.fromTo(
      parts,
      wide ? { opacity: 0, x: 40 } : { opacity: 0, y: 18 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'uiOut',
        stagger: 0.06,
        scrollTrigger: { trigger: entry, start: 'top 80%', once: true },
      },
    );
  });
}

/** Archive cards are uncovered from the bottom in sequence, and lean toward the pointer. */
function archive() {
  const cards = gsap.utils.toArray<HTMLElement>('[data-archive] .card');
  if (!cards.length) return;
  gsap.set(cards, { clipPath: 'inset(0% 0% 100% 0% round 22px)' });
  ScrollTrigger.batch(cards, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        clipPath: 'inset(0% 0% 0% 0% round 22px)',
        duration: 0.9,
        ease: 'uiInOut',
        stagger: 0.08,
        clearProps: 'clipPath',
      }),
  });

  if (!finePointer()) return;
  cards.forEach((card) => {
    const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'uiOut' });
    const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'uiOut' });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener('pointermove', (event) => {
      const r = card.getBoundingClientRect();
      rotateY(((event.clientX - r.left) / r.width - 0.5) * 8);
      rotateX(((event.clientY - r.top) / r.height - 0.5) * -8);
    });
    card.addEventListener('pointerleave', () => {
      rotateX(0);
      rotateY(0);
    });
  });
}

/** The ending: the contact section floods with cobalt and its title rises letter by letter. */
function contact() {
  const section = document.querySelector<HTMLElement>('[data-contact]');
  if (!section) return;
  const footer = document.querySelector<HTMLElement>('[data-footer]');
  ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    onEnter: () => {
      section.classList.add('is-inverted');
      footer?.classList.add('is-inverted');
    },
    onLeaveBack: () => {
      section.classList.remove('is-inverted');
      footer?.classList.remove('is-inverted');
    },
  });

  const chars = section.querySelectorAll('[data-proximity] .pc');
  gsap.fromTo(
    chars,
    { y: 0, yPercent: 112, rotation: 12, transformOrigin: '0% 100%' },
    {
      yPercent: 0,
      rotation: 0,
      duration: 1.1,
      ease: 'uiOut',
      stagger: 0.045,
      scrollTrigger: { trigger: section, start: 'top 65%', once: true },
    },
  );
}

/** The name at the bottom rises letter by letter with the last stretch of scroll. */
function footer() {
  const wordmark = document.querySelector<HTMLElement>('[data-wordmark]');
  if (!wordmark) return;
  gsap.fromTo(
    wordmark.querySelectorAll('.wm-ch'),
    { y: 0, yPercent: 100 },
    {
      yPercent: 0,
      ease: 'none',
      stagger: 0.08,
      scrollTrigger: { trigger: wordmark, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
    },
  );
}
