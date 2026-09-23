import { motionOn, root } from './motion';

type Theme = 'light' | 'dark';

const readSaved = (): Theme | null => {
  try {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || saved === 'light' ? saved : null;
  } catch {
    return null;
  }
};

export function initTheme() {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  const meta = document.querySelector('meta[name="theme-color"]');

  const sync = () => {
    const dark = root.dataset.theme === 'dark';
    button?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    meta?.setAttribute('content', dark ? '#0d0f13' : '#f3f4f6');
  };
  sync();

  button?.addEventListener('click', () => {
    const next: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* private mode: the choice lasts for this visit only */
      }
      sync();
    };

    if (!document.startViewTransition || !motionOn()) {
      apply();
      return;
    }

    // The new theme spreads out from the button as a growing circle.
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 520, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => {});
  });

  // Follow the system setting until the visitor picks a theme themselves.
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (readSaved()) return;
    root.dataset.theme = event.matches ? 'dark' : 'light';
    sync();
  });
}
