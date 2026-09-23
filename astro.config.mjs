// @ts-check
import { defineConfig } from 'astro/config';

// Served by GitHub Pages at https://elm-dak.github.io/portfolio/
export default defineConfig({
  site: 'https://elm-dak.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  build: {
    // GitHub Pages runs Jekyll unless .nojekyll exists, and Jekyll drops folders
    // that start with "_". Naming the folder "assets" avoids the trap entirely.
    assets: 'assets',
  },
  devToolbar: { enabled: false },
});
