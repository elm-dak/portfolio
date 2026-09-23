import { gsap, motionOn, root } from './motion';

// Small tilts for the closed pile, so it looks like a real stack of paper
const PILE_TILT = [-3, 2, -1.5, 3.5, -2.5, 1.5];

export function initCerts() {
  const deck = document.querySelector<HTMLElement>('[data-deck]');
  if (!deck) return;
  const cards = gsap.utils.toArray<HTMLButtonElement>('[data-deck-card]', deck);

  // Wide screens: the pile fans out while the section scrolls into view.
  if (motionOn()) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      cards.forEach((card, i) => {
        const offset = Number(card.dataset.offset ?? 0);
        gsap.fromTo(
          card,
          { x: 0, y: -i * 3, rotation: PILE_TILT[i % PILE_TILT.length] },
          {
            x: () => offset * card.offsetWidth * 0.46,
            y: offset * offset * 7,
            rotation: offset * 4,
            ease: 'none',
            scrollTrigger: { trigger: deck, start: 'top 85%', end: 'center 55%', scrub: 0.6, invalidateOnRefresh: true },
          },
        );
      });
    });
  }

  // Viewer
  const dialog = document.querySelector<HTMLDialogElement>('[data-cert-dialog]');
  if (!dialog) return;
  const image = dialog.querySelector<HTMLImageElement>('[data-cert-img]');
  const title = dialog.querySelector<HTMLElement>('[data-cert-title]');
  const meta = dialog.querySelector<HTMLElement>('[data-cert-meta]');
  const verify = dialog.querySelector<HTMLAnchorElement>('[data-cert-verify]');
  let opener: HTMLElement | null = null;
  let closing = false;

  const open = (card: HTMLElement, from: HTMLElement) => {
    if (dialog.open) return;
    opener = from;
    const { full = '', title: name = '', issuer = '', date = '', verify: link = '' } = card.dataset;
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
    root.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-open')));
  };

  const close = () => {
    if (!dialog.open || closing) return;
    closing = true;
    dialog.classList.remove('is-open');
    root.style.overflow = '';
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
