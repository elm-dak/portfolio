import { ScrollTrigger, motionOn, root } from './motion';

export function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  let menuOpen = false;

  // Solid background once the page moves. While reading down the nav slides away,
  // and any upward scroll brings it back.
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 8);
      if (menuOpen) return;
      const pastHero = y > window.innerHeight * 0.7;
      if (pastHero && self.direction === 1) nav.classList.add('is-hidden');
      else if (self.direction === -1 || !pastHero) nav.classList.remove('is-hidden');
    },
  });
  nav.classList.toggle('is-scrolled', window.scrollY > 8);
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  // Active section: the link lights up and the bar slides under it.
  const list = nav.querySelector<HTMLElement>('.nav-links');
  const indicator = nav.querySelector<HTMLElement>('[data-nav-indicator]');
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  let active: string | null = null;
  let shown = false;

  const place = () => {
    const link = links.find((l) => l.dataset.navLink === active) ?? null;
    links.forEach((l) => {
      if (l === link) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
    if (!indicator || !list) return;
    if (!link || list.offsetParent === null) {
      indicator.style.opacity = '0';
      shown = false;
      return;
    }
    const inset = 12;
    const x = link.offsetLeft + inset;
    const width = Math.max(1, link.offsetWidth - inset * 2);
    if (!shown) {
      // First appearance: jump into place, then fade in, instead of sliding in from the edge.
      indicator.style.transition = 'none';
      indicator.style.transform = `translateX(${x}px) scaleX(${width})`;
      void indicator.offsetWidth;
      indicator.style.transition = '';
    }
    indicator.style.transform = `translateX(${x}px) scaleX(${width})`;
    indicator.style.opacity = '1';
    shown = true;
  };

  links.forEach((link) => {
    const section = document.getElementById(link.dataset.navLink ?? '');
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle(self) {
        if (self.isActive) active = link.dataset.navLink ?? null;
        else if (active === link.dataset.navLink) active = null;
        place();
      },
    });
  });
  ScrollTrigger.addEventListener('refresh', place);

  // Full-screen menu on small screens
  const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
  const openButton = nav.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!menu || !openButton) return;

  const open = () => {
    menu.showModal();
    menuOpen = true;
    openButton.setAttribute('aria-expanded', 'true');
    root.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
  };

  const close = (after?: () => void) => {
    if (!menu.open) return;
    menu.classList.remove('is-open');
    menuOpen = false;
    openButton.setAttribute('aria-expanded', 'false');
    root.style.overflow = '';
    window.setTimeout(
      () => {
        menu.close();
        after?.();
      },
      motionOn() ? 220 : 0,
    );
  };

  openButton.addEventListener('click', open);
  menu.querySelector('[data-menu-close]')?.addEventListener('click', () => close());
  menu.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  menu.querySelectorAll<HTMLAnchorElement>('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector<HTMLElement>(link.getAttribute('href') ?? '');
      close(() => {
        target?.scrollIntoView({ behavior: motionOn() ? 'smooth' : 'auto' });
        nav.classList.remove('is-hidden');
      });
    });
  });
}
