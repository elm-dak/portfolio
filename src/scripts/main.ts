import { root, ScrollTrigger } from './motion';
import { initTheme } from './theme';
import { initNav } from './nav';
import { initHero } from './hero';
import { initReveals } from './reveals';
import { initStack } from './stack';
import { initArchive } from './archive';
import { initCerts } from './certs';
import { initContact } from './contact';

// Tells the head script the page script arrived, so it keeps motion on.
root.dataset.motionReady = 'true';

const run = (init: () => void) => {
  try {
    init();
  } catch (error) {
    console.error(error);
  }
};

[initTheme, initNav, initHero, initReveals, initStack, initArchive, initCerts, initContact].forEach(run);

// Web fonts and late images change heights, so trigger positions are measured again.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
