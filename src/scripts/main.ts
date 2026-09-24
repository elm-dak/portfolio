import { root, ScrollTrigger } from './motion';
import { initSmoothScroll } from './smooth';
import { initTheme } from './theme';
import { initNav } from './nav';
import { initHero } from './hero';
import { initBand } from './band';
import { initReveals } from './reveals';
import { initStack } from './stack';
import { initArchive } from './archive';
import { initToolbox } from './toolbox';
import { initCerts } from './certs';
import { initContact } from './contact';
import { initMagnetic } from './magnetic';

// Tells the head script the page script arrived, so it keeps motion on.
root.dataset.motionReady = 'true';

const run = (init: () => void) => {
  try {
    init();
  } catch (error) {
    console.error(error);
  }
};

[
  initSmoothScroll,
  initTheme,
  initNav,
  initHero,
  initBand,
  initStack,
  initReveals,
  initArchive,
  initToolbox,
  initCerts,
  initContact,
  initMagnetic,
].forEach(run);

// Some triggers were created before the pins above them existed; put every
// trigger in page order and measure again so each one includes that space.
ScrollTrigger.sort();
ScrollTrigger.refresh();

// Web fonts and late images change heights, so trigger positions are measured again.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
