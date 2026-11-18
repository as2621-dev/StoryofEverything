# Starter kit (already in this project, works offline)

- `assets/vendor/gsap.min.js` (GSAP 3.12.5). Use this instead of the CDN tag in index.html.
- `assets/vendor/d3-array.min.js`, `d3-geo.min.js`, `d3-geo-projection.min.js` (load in that order) → global `d3` with geoOrthographic, geoEquirectangular, geoNaturalEarth1, geoPath, geoInterpolate, geoGraticule, geoDistance, geoCircle, etc.
- `assets/vendor/topojson-client.min.js` → global `topojson` (`topojson.feature(WORLD_110m, WORLD_110m.objects.countries)`).
- World data as JS globals (no fetch needed — fetch is banned at render time):
  - `assets/vendor/world-110m.js` → `window.WORLD_110m` (countries, objects.countries / objects.land)
  - `assets/vendor/world-50m.js`  → `window.WORLD_50m` (more detail; use for zoomed-in regional maps)
  - `assets/vendor/land-110m.js` / `land-50m.js` → `window.LAND_110m` / `LAND_50m` (objects.land)
- Fonts in `assets/fonts/`: `Newsreader.woff2` (upright, variable weight 400–800, opsz 6–72) and `Newsreader-Italic.woff2`.
  Declare with @font-face (font-weight: 400 800). Bundled by name: `IBM Plex Mono`, `Space Mono`, `JetBrains Mono`, `Inter`, `EB Garamond`, `Playfair Display`.

## Rules for drawing maps in HyperFrames
- Build the SVG paths in a script at load (deterministic), then drive everything from the paused GSAP timeline.
- For anything that changes per frame (globe rotation, projection morph, a moving plane along a great circle), tween a plain JS object (e.g. `const s = {rot: 0, t: 0}`) with `onUpdate` that re-projects and rewrites `d` attributes. That is deterministic under seeking.
- Line draw-on: set `stroke-dasharray`/`stroke-dashoffset` from `getTotalLength()`; for a dashed line that draws on, use a mask/clipPath or a second solid path as a mask that draws on.
- No Math.random without a seeded PRNG.
