import { DESKTOP, gsap, motionOn } from './motion';
import { lockScroll } from './smooth';

// Small tilts for the closed pile, so it looks like a real stack of paper
const PILE_TILT = [-3, 2, -1.5, 3.5, -2.5, 1.5];

export function initCerts() {
  const deck = document.querySelector<HTMLElement>('[data-deck]');
  if (!deck) return;
  const cards = gsap.utils.toArray<HTMLButtonElement>('[data-deck-card]', deck);

  // Wide screens: the pile rises into view, then the section holds still
  // while the scroll deals the certificates out into a fan.
  if (motionOn()) {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const wrap = deck.closest<HTMLElement>('.deck-wrap') ?? deck;
      gsap.fromTo(
        deck,
        { y: 140, opacity: 0, rotation: -4 },
        { y: 0, opacity: 1, rotation: 0, duration: 1.1, ease: 'uiOut', scrollTrigger: { trigger: wrap, start: 'top 88%', once: true } },
      );
      const fan = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'center 52%', end: '+=80%', pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      cards.forEach((card, i) => {
        const offset = Number(card.dataset.offset ?? 0);
        fan.fromTo(
          card,
          { x: 0, y: -i * 3, rotation: PILE_TILT[i % PILE_TILT.length], rotationY: 0 },
          {
            x: () => offset * card.offsetWidth * 0.46,
            y: offset * offset * 7,
            rotation: offset * 4,
            ease: 'uiInOut',
          },
          Math.abs(offset) * 0.04,
        );
      });
    });
  }

  // Viewer
  const dialog = document.querySelector<HTMLDialogElement>('[data-cert-dialog]');
  if (!dialog) return;
  const media = dialog.querySelector<HTMLElement>('[data-cert-media]');
  let image: HTMLImageElement | null = null;
  const title = dialog.querySelector<HTMLElement>('[data-cert-title]');
  const meta = dialog.querySelector<HTMLElement>('[data-cert-meta]');
  const verify = dialog.querySelector<HTMLAnchorElement>('[data-cert-verify]');
  let opener: HTMLElement | null = null;
  let closing = false;

  const open = (card: HTMLElement, from: HTMLElement) => {
    if (dialog.open) return;
    opener = from;
    const { full = '', title: name = '', issuer = '', date = '', verify: link = '' } = card.dataset;
    if (!image && media) {
      // Created on first open, so the page never carries an image without a source
      image = document.createElement('img');
      image.width = 1400;
      image.height = 1050;
      image.decoding = 'async';
      media.append(image);
    }
    if (image) {
      image.src = full;
      image.alt = `Certificate: ${name}, ${issuer}`;
    }
    if (title) title.textContent = name;
    if (meta) meta.textContent = [issuer, date].filter(Boolean).join(' · ');
    if (verify) {
      verify.hidden = !link;
      verify.href = link || '#';
    }
    dialog.showModal();
    lockScroll(true);
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-open')));
  };

  const close = () => {
    if (!dialog.open || closing) return;
    closing = true;
    dialog.classList.remove('is-open');
    lockScroll(false);
    window.setTimeout(
      () => {
        dialog.close();
        closing = false;
        opener?.focus();
      },
      motionOn() ? 250 : 150,
    );
  };

  cards.forEach((card) => card.addEventListener('click', () => open(card, card)));
  document.querySelectorAll<HTMLButtonElement>('[data-open-cert]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = cards[Number(button.dataset.openCert)];
      if (card) open(card, button);
    });
  });
  dialog.querySelector('[data-cert-close]')?.addEventListener('click', close);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  // A click on the dim area around the panel closes it.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
}
