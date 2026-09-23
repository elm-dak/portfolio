# Portfolio

Personal site of **El Mestapha Dakouky**, AI and full-stack engineer in Casablanca.

Live at **https://elm-dak.github.io/portfolio/**

## Stack

- [Astro](https://astro.build) 5, static output, no framework on the client
- [GSAP](https://gsap.com) with ScrollTrigger, Flip and CustomEase for the motion
- Geist and Geist Mono (self-hosted through Fontsource)
- Icons from Phosphor, technology logos from Simple Icons
- Contact form sent through EmailJS

## Run it

Needs Node 20.19 or newer.

```bash
npm install
npm run dev        # http://localhost:4321/portfolio/
npm run build      # static site in dist/
npm run preview    # serve the build
```

## Publish

```bash
npm run deploy
```

This builds the site and pushes `dist/` to the `gh-pages` branch, which GitHub Pages serves.

## Edit the content

All text lives in `src/data/site.ts` (projects, experience, education, skills, certificates) and
`src/data/person.ts` (name, links, contact). Images live in `src/assets/` and are converted to WebP at build time.

## Motion

- The name decodes letter by letter on load and the portrait is uncovered from below.
- Selected work is a stack of cards: each one pins, then shrinks and dims as the next slides over it.
- The About statement lights up word by word as it scrolls past.
- The experience line draws itself and each role lights up when the line reaches it.
- Project filters move the cards to their new places instead of redrawing the grid.
- The certificates fan out from a pile, and open full size with a verify link.
- The letters of "Let's talk." grow heavy near the pointer.

Everything respects `prefers-reduced-motion`: with it on, content only fades in and nothing moves or pins.
