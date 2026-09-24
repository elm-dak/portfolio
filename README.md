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

- Smooth scrolling with Lenis, tuned separately for mouse wheels and touchpads; phones keep native scrolling.
- The name decodes letter by letter on load and the portrait is uncovered from below. Scrolling away splits the name apart and tips the portrait back.
- A band of giant words drifts sideways, speeds up and leans with the scroll, and turns around when you scroll up.
- Section titles are built letter by letter.
- Selected work is a stack of cards dealt in 3D: each card rises tilted, flattens as it lands, its screenshots arriving at different depths, then shrinks and dims under the next one. An "Open" pill follows the pointer over the screenshots.
- The About statement pins and lights up word by word while you read it; the numbers count up.
- The experience line draws itself; each role pulses, decodes its dates and slides in when the line reaches it.
- Project cards are uncovered in sequence, lean toward the pointer, and glide to their new places when filtered.
- The Toolbox pins and scrolls sideways, each panel swinging in from an angle.
- The certificates rise as a pile, then pin and fan out.
- The contact section floods cobalt, "Let's talk." rises letter by letter and its letters grow heavy near the pointer; buttons lean toward the pointer.

Everything respects `prefers-reduced-motion`: with it on, content only fades in and nothing moves, pins or scrubs.
