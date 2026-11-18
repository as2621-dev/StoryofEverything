# OLD ROUTES motion kit: API

A paper-cutout cartography kit for HyperFrames scenes: cream and navy themes, six semantic inks, Newsreader with one
italic accent word, tracked IBM Plex Mono labels, true great circles, dim-to-context, and a cut-paper layer (fibre
texture, rough cut edge, light paper-core rim, soft drop shadow).

- Library: `assets/kit/kit.js` (global `window.Kit`) and `assets/kit/kit.css`.
- **Kit v2 (2026-11-17): read §13 first** (new chrome, flags, VOC logo, figures, portraits, price climb, scroll,
  `Kit.exit` lift). `Kit.version` is `"2.0.0"`. Every v1 call still works.
- Demo v2: `index.html` mounts `compositions/kit-sheet.html` (20 s), rendered to `demo_v2.mp4`.
- Demo v1: `compositions/demo-route.html`, `demo-banda.html` and `demo-parade.html` (25 s; §13.0 says how to mount them
  again), rendered to `demo.mp4` with the v1 chrome.
- Every v1 cutout and vehicle on one page: `compositions/kit-sheet-v1.html` (see "Preview the sheet" at the end).
- Worked examples of the globe (rotateTo, a ride on a globe, pins that follow), waffle, bar, counter and a double
  theme flip: `compositions/kit-examples.html` (preview it the same way, 4 s).
- Built and verified with HyperFrames CLI 0.9.59.

---

## 1. Include recipe for a scene in `compositions/`

Copy this skeleton. Change only the composition id (`my-scene`, three places) and the body of the script.

```html
<template>
  <link rel="stylesheet" href="assets/kit/kit.css" />
  <style>
    /* These two font-family lines are required: the HyperFrames compiler only loads bundled fonts
       (IBM Plex Mono) that it sees named inline in the scene. Newsreader comes from kit.css. */
    #root { position: absolute; inset: 0; font-family: "Newsreader", serif; }
    #root .kit-mono { font-family: "IBM Plex Mono", monospace; }
  </style>
  <div id="root" data-composition-id="my-scene" data-width="1920" data-height="1080"></div>
  <script src="assets/vendor/gsap.min.js"></script>
  <script src="assets/vendor/d3-array.min.js"></script>
  <script src="assets/vendor/d3-geo.min.js"></script>
  <script src="assets/vendor/d3-geo-projection.min.js"></script>
  <script src="assets/vendor/topojson-client.min.js"></script>
  <script src="assets/vendor/land-50m.js"></script>
  <script src="assets/vendor/land-110m.js"></script>
  <script src="assets/kit/kit.js"></script>
  <script>
    (function () {
      const root = document.querySelector('[data-composition-id="my-scene"]');
      const tl = gsap.timeline({ paused: true });
      const st = Kit.stage(root, { theme: "cream", active: 0 });
      // ... build everything, add tweens to tl at absolute seconds ...
      // ... Kit.themeFlip(...) calls go LAST (see 3.3) ...
      tl.to({}, { duration: 0.01 }, SCENE_LENGTH - 0.01); // pad the timeline to the slot length
      window.__timelines["my-scene"] = tl;
    })();
  </script>
</template>
```

Mount it from the root `index.html` (host id = composition id = timeline key, or every render waits 45 s):

```html
<div id="my-scene" data-composition-id="my-scene" data-composition-src="compositions/my-scene.html"
  data-start="12" data-duration="8" data-track-index="2" data-track-kind="graphics"
  data-width="1920" data-height="1080" style="z-index: 2"></div>
```

Facts verified on this CLI version:

- Paths are `assets/...` with no leading slash, also inside `compositions/`.
- `<script src>` tags inside a scene's `<template>` load synchronously, in order, before the inline script, and the
  runtime loads each file once per page even when every scene lists it. So every scene lists the full set and also
  works when previewed alone.
- The host and the scene root merge into one element: `document.querySelector('[data-composition-id="my-scene"]')`
  is the scene root. Pass it to `Kit.stage`.
- If you only use `110m` data you may drop `land-50m.js` (550 KB), and vice versa. `world-50m.js` / `world-110m.js`
  (countries) are not used by the kit; add them yourself for borders.
- Builders who copy the kit into their own folder copy `assets/kit/`, `assets/vendor/` and `assets/fonts/` together.

### 1.1 Crossfades between scenes

Overlap the hosts by 0.5 s (later scene on a higher `z-index`) and call `st.fadeIn(tl, 0, 0.5)` in the incoming scene.
The chrome is identical in both scenes, so it reads as one continuous frame. Same-theme cuts: 0.4–0.6 s; theme change
inside a scene: `Kit.themeFlip` (0.28 s).

---

## 2. Rules

### 2.1 Determinism (HyperFrames seeks every frame on its own)

- Never `Math.random()`, `Date.now()`, timers, `requestAnimationFrame` or `repeat: -1`.
- Randomness: `const r = Kit.rng(seed)` (mulberry32; seed is a number or string), then `r()` gives [0,1).
  `Kit.hash2(seed, n)` gives a stateless value for step `n`.
- Build all geometry synchronously at load. Anything that changes per frame is a tween of a plain object with an
  `onUpdate` that writes attributes (the kit does this for routes, rides, globes, counters, wobble).
- Use `fromTo` for anything you add yourself. The kit's own entrances are `fromTo` with `immediateRender`, so an
  element is hidden until its entrance time.
- Do not animate a property from two places (e.g. `Kit.dim` and your own opacity tween on the same element at
  overlapping times).
- Exception (by design): kit elements are created by script, not written as timed `.clip` tags. They are scene
  content, timed by the scene's timeline.

### 2.2 Look rules (Manicule grammar + our paper layer)

- At most two accent inks per frame plus ink. Colour means something: red = route/danger/featured, petrol blue =
  data/accent word, gold = wealth/nutmeg/night accent, teal = safe/alternative, mace red = the aril only.
- Most frames are still. Motion comes in short bursts on the narrated noun, then holds 2–6 s.
- Layers that are still context dim to 0.28 with `Kit.dim`; once an element is finished, remove it cleanly with
  `Kit.exit(tl, t, el, { style: "lift" })` (v2, owner note) rather than leaving it dimmed.
- Wobble only illustrations (`cutout.wobble`), never maps or text. Use it sparingly (one or two objects).
- Keep content inside the 90% action-safe box; chrome occupies the top 140 px (date left, reason icons right) and the
  bottom-right corner (logo).

---

## 3. Stage, chrome and themes

### `Kit.stage(root, opts) → stage`

Creates, inside `root`: the desk background (cream and navy layers with a cached paper texture), the shared SVG
filter defs, a map SVG (`stage.svg`), an HTML layer (`stage.layer`, cards/titles/stamps), a top SVG (`stage.top`,
cutouts/waffles/bars), the vignette and the chrome (compass mark + wordmark on a paper strip, chapter tabs).

| opt | default | |
|---|---|---|
| `theme` | `"cream"` | `"cream"` or `"navy"` |
| `channel` | variable `channel`, else CSS `--channel` on root, else `"OLD ROUTES"` | wordmark text |
| `tabs` | variable `chapters`, else CSS `--chapters`, else `["SPICE","MONOPOLY","RUN","TREATY","LEGACY"]` | array or comma string; `false` hides tabs |
| `active` | `0` | index of the raised, red-edged tab |
| `chrome` | `true` | `false` = no logo and no tabs |
| `disclaimer` | none | bottom-left paper chip, e.g. `"Tracks illustrative"` |

Returns `{ el, svg, top, layer, chrome, ctx, tabs, fadeIn(tl, t, dur=0.5), fadeOut(tl, t, dur=0.5) }`.
Pass `st` (or its parts) to every other call; the kit finds the scene from it.

```js
const st = Kit.stage(root, { theme: "navy", active: 2, disclaimer: "Schematic · not to scale" });
```

### `Kit.chapterTabs(stage, labels, activeIndex) → tabs`

Made by `Kit.stage` already; call it yourself only with `chrome:false`. `tabs.setActive(tl, t, i)` lowers the old tab
and raises tab `i` (0.45 s, `back.out(1.2)`).

### `Kit.chip(stage, text, {x, y}) → { el, in(tl, t) }`

A small paper chip, bottom-left by default. Mono, uppercase.

### `Kit.themeFlip(tl, t, {to, dur=0.28, stage}) → tl`

Crossfades every themed thing in the scene (desk, vignette, map land/sea, graticule, labels and halos, pins, routes,
cards, titles, accent words) to the other theme in 0.28 s, `power2.inOut`. `to` defaults to the opposite of the
current theme.

**Call it after you have created every element of the scene**, in time order (flip at 4 s before flip at 9 s).
Elements created after a `themeFlip` call start in the flipped theme even if they appear before it.

```js
Kit.themeFlip(tl, 8.7);           // navy → cream
Kit.themeFlip(tl, 14.0);          // cream → navy
```

### Tokens: `Kit.C`, `Kit.tok(name, theme)`

`Kit.C` holds every hex (paper `#E7DEC8`, navy `#192733`, ink `#242018`, red `#C03F27`, blue `#24506C`, gold `#E2AF51`,
teal `#376B67`, mace `#B5332A`, land `#E0D8C0`, sea `#C0D0D4`, globeSea `#9AB3BE`, landNavy `#6E8494`, seaNavy
`#192D3E`, plus the cutout paper colours). Any `color` option accepts a token name (`"red"`, `"blue"`, `"gold"`,
`"teal"`, `"ink"`, `"ink2"`, `"mace"`, `"accent"`) or a literal hex. Token names are theme-aware: `"red"` becomes coral
`#DF716B` on navy, `"ink"` becomes `#EFE9D9`, `"accent"` is blue on cream and gold on navy.

---

## 4. Paper layer

Installed once per scene by `Kit.stage` (no stage: `Kit.paperFilters(svg)` installs them into that SVG).

| filter (`Kit.filter(target, name)` → `"url(#…)"`) | what |
|---|---|
| `cut` | rough cut edge (displacement ≈ ±2.5 px) + light paper-core rim + drop shadow (dx 3, dy 5, blur 4, 32%) |
| `piece` | the same for a layer glued on another sheet (smaller shadow) |
| `lift` | soft shadow only (a whole cutout off the desk) |
| `pinlift` | small shadow for pins and dots |
| `rough` | displacement only (stamps) |
| `glow` | 9 px blur (night route glow) |

- `Kit.paperFill(target, "#hex")` → `"url(#…)"`: a fill pattern of that colour with the cached fibre texture. Use it
  for your own paper shapes: `S.setAttribute("fill", Kit.paperFill(st.svg, "#D9C9A0"))` plus
  `filter: Kit.filter(st.svg, "piece")`.
- `Kit.texture("fibre" | "desk" | "speck")` → a PNG data URL (generated once per page with a seeded PRNG), for CSS
  backgrounds of your own HTML sheets.
- HTML sheets (cards, tabs, chips) are two layers: a `.kit-sheet` div carrying the texture and `filter:url(#…-cut)`,
  and the text above it, unfiltered, so letters are never distorted.

---

## 5. Maps

### `Kit.flatMap(svg, opts) → map`

| opt | default | |
|---|---|---|
| `projection` | `"equirect"` | `"equirect"`, `"naturalEarth"`, `"mercator"` |
| `fitBounds` | none | `[[west, south], [east, north]]`, fitted inside the frame minus `pad` (40) |
| `center`, `scale`, `translate`, `rotate` | — | used when `fitBounds` is absent |
| `land` | `"50m"` | `"50m"` (regional) or `"110m"` (world) |
| `paper` | `true` | `false` = flat land, no filter (cheaper) |
| `graticule` / `graticuleStep` | `true` / `15` | faint graticule |
| `minArea` | `2` | skip islands smaller than this many px² |
| `landColor` / `seaColor` | `"land"` / `"sea"` | tokens or hex |

Returns `{ proj, path, project([lon,lat]) → [x,y], g, gSea, gGrat, gLand, gRoutes, gPins, gLabels, sheets }`.
Land is one path per landmass inside one `cut`-filtered group, so every sheet casts its shadow on the sea. Pass `map`
(not `st.svg`) to `route`, `pin`, `label` and `vehicle` so they land in the right layer and project lon/lat.

```js
const map = Kit.flatMap(st.svg, { projection: "equirect", fitBounds: [[4, -14], [140, 56]] });
```

### `Kit.globe(svg, opts) → globe`

| opt | default | |
|---|---|---|
| `rotate` | `[0,0,0]` | d3 `[λ, φ, γ]` (centre lon/lat is `[-λ, -φ]`) |
| `radius`, `center` | `440`, `[960,580]` | |
| `land` | `"110m"` | 50m is slow to re-project every frame |
| `paper` | `true` | sea disc is a `cut` sheet, land a `piece` |

Returns `{ setRotate([λ,φ,γ]), rotateTo(tl, t, [λ,φ,γ], dur=1, ease="power3.inOut"), project, visible(lonlat),
onRender(fn), render(), proj, path, g, gRoutes, gPins, gLabels }`. `rotateTo` interpolates the centre along the
great circle (shortest path). Several `rotateTo` calls chain in time order. Routes, pins and riding vehicles on a globe
re-project and hide on the far side automatically. Your own per-frame drawing: `globe.onRender(fn)`.

```js
const g = Kit.globe(st.svg, { rotate: [-60, -10, 0], radius: 330, center: [560, 600] });
g.rotateTo(tl, 2.0, [-10, -35, 0], 1.2);
```

### `Kit.islands(svg, spec) → bandaMap`

Hand-authored, schematic Banda Islands at correct relative positions: Run, Nailaka, Ai, Gunung Api (volcano cone with
slope and crater layers), Banda Neira, Banda Besar/Lonthor (crescent). Each island is a paper sheet with a lighter
shallows band.

| spec | default | |
|---|---|---|
| `center`, `scale` | `[129.825, -4.535]`, `5300` | lon/lat at (`x`,`y`); px per degree |
| `x`, `y` | `960`, `580` | |
| `labels`, `names`, `labelSide` | `true`, English names, see code | `labelSide: { run: "left" }` (`above/below/left/right`) |
| `highlight` | none | key or array of keys drawn red-dashed from the start |
| `shallows`, `sea` | `true`, `true` | |

Returns `{ project, islands: { run, nailaka, ai, api (= gunungApi), neira, lonthor (= besar) }, pxPerKm,
highlight(tl, t, key) }`. Each island is `{ g, shape, shallows, extra, label, xy, pts }`; `label.in(tl, t)` reveals
its label.

```js
const isl = Kit.islands(st.svg, { center: [129.83, -4.533], scale: 4400, x: 1010, y: 600 });
isl.highlight(tl, 2.4, "run");
Kit.scaleBar(isl, [1560, 990], 5, isl.pxPerKm).in(tl, 1.4);
```

### `Kit.scaleBar(target, [x,y], km, pxPerKm) → { el, in(tl,t) }`

---

## 6. Routes and vehicles

### `Kit.route(svg, map|globe|null, coords, opts) → route`

A route that draws on through a mask, so dashes never crawl. `coords` are `[lon,lat]` with a map, or screen `[x,y]`
with `null`.

| opt | default | |
|---|---|---|
| `color` | `"red"` | token or hex (tokens follow the theme) |
| `width` | `5` | |
| `dash` | `[16,10]` | `false` = solid, `"dotted"` = round dots |
| `greatCircle` | `true` | true great circles via `d3.geoInterpolate`; `false` = straight in screen space |
| `smooth` | `false` | with `greatCircle:false`, a Catmull-Rom curve through the waypoints (sea lanes) |
| `glow` | `false` | `true` (gold) or a token: blurred under-glow for night routes |
| `casing` | `false` | background-coloured outline under the line |
| `arrow` | `false` | arrowhead riding the drawn tip |
| `drawn` | `false` | start fully drawn |

Returns `{ el, g, length, draw(t), progress (tweenable 0–1), drawOn(tl, t, dur=1.6, ease="power2.inOut"), rebuild(),
lut }`. Dim with `Kit.dim(tl, route.g, t)`.

- `Kit.pathPoint(route, t)` → `{ x, y, angle, dx, visible }` (angle in degrees, 0 = east, clockwise).
- `Kit.routeT(route, [lon,lat])` → the fraction of the route nearest that place. Use it to time pins and ladder steps
  to the moment a vehicle passes: `at = start + dur * Kit.routeT(road, Kit.places.aden)` (with `ease:"none"`).
- `Kit.routes.bandaVenice`, `Kit.routes.bandaAmsterdam`: ready waypoint lists (use `greatCircle:false, smooth:true`).
- `Kit.places`: lon/lat of banda, neira, run, ai, ambon, ternate, makassar, batavia, malacca, aceh, galle, calicut,
  goa, hormuz, aden, mocha, jeddah, suez, cairo, alexandria, venice, lisbon, amsterdam, london, breda, capeOfGoodHope,
  newAmsterdam, manhattan.

### `Kit.vehicle(target, type, opts) → cutout object`

`type`: `"dhow"`, `"junk"`, `"eastIndiaman"`, `"englishShip"`, `"prau"` (side views facing right, about 220 units
long, waterline at y=0). Options as `Kit.cutout` (`scale` default 0.4, `x`, `y`, `label`). Pass `map` as the target to
put it in the map's route layer.

### `Kit.ride(vehicle, route, tl, start, dur, ease="none", opts) → proxy`

Moves the vehicle along the route and (unless `draw:false`) draws the route flush behind it.
`opts.orient`: `"flip"` (default: upright side view, mirrored when heading west, tilted up to `maxTilt` 10°),
`"rotate"` (follow the heading; for top views), `"none"`. `opts.lift` (default −6 px) sits the hull on the line.

```js
const road = Kit.route(st.svg, map, Kit.routes.bandaVenice, { greatCircle: false, smooth: true });
const dhow = Kit.vehicle(map, "dhow", { scale: 0.42 });
Kit.ride(dhow, road, tl, 1.6, 6.2, "none");
```

---

## 7. Pins and labels

### `Kit.pin(mapOrSvg, lonlat | [x,y], label, opts) → pin`

With a map/globe as the first argument the point is `[lon,lat]`; with an SVG it is screen `[x,y]` (or pass
`screen:true`). Red dot r 10 with an ink ring and a small shadow; the label is mono uppercase with a halo.

| opt | default | |
|---|---|---|
| `pos` | `"ur"` | label side: `ur ul r l b t dr dl` |
| `dx`, `dy` | `0` | extra label offset |
| `color`, `r` | `"red"`, `10` | |
| `font`, `size` | `"mono"`, `24` | `"serif"` for globes |
| `label` | — | extra `Kit.label` options |

Returns `{ el, dot, label, group, in(tl, t), out(tl, t) }`. `in` pops the dot (0.22 s) and the label follows 0.05 s
later. Dim with `Kit.dim(tl, pin.group, t)`.

### `Kit.label(target, [x,y], text, opts) → { el, in(tl, t, preset), out(tl, t) }`

| opt | default | |
|---|---|---|
| `font` | `"mono"` | `"mono"` (uppercase, tracked), `"serif"`, `"ocean"` (serif italic, tracked) |
| `size` | 24 mono / 32 serif | |
| `anchor` | `"start"` | |
| `color` | `"ink"` | |
| `halo` / `haloColor` / `haloWidth` | `true` / `"sea"` / `6` | background-colour halo via `paint-order: stroke`; use `haloColor:"bg"` on the desk |
| `tracking`, `weight`, `upper`, `opacity` | | |

---

## 8. Cards, titles, stamps, numbers

### `Kit.title(stage, "Text with *accent*", opts) → { el, words, kicker, in(tl, t, style), out(tl, t) }`

Newsreader 700, tracking −0.015em; the `*starred*` words are italic petrol blue (gold on navy).
Options: `x` (66), `y` (118), `size` (68), `align` (`"left"`, or `"center"` across the frame), `w`, `kicker` (mono line
above), `kickerColor`, `sub` (mono line below). `in` styles: `"blur"` (default, per word, 0.07 s apart) or `"ink"`
(grey to ink). A landed title stays still.

### `Kit.card(stage, opts) → { el, sheet, body, parts:{eyebrow,big,small}, in(tl, t, preset), out(tl, t) }`

A paper info card: mono eyebrow → serif hero (`big`, supports `*accent*`) → mono small line.
Options: `x`, `y`, `w`, `eyebrow`, `big`, `small`, `bigSize` (84), `bigColor` (`"blue"`, gold on navy), `theme`, `id`.
`in` presets: `"fadeUp"` (default), `"fade"`, `"pop"`, `"place"` (hand-placed slide with rotation and overshoot).

### `Kit.stamp(stage, text, { x, y, rotate=-5, color, size=34 }) → { el, in(tl, t), slam, out }`

A rubber-stamp impression (mono caps in a rounded border, worn ink mask, rough edge), centred on `x,y`. `in` slams
1.6 → 0.97 → 1 in 0.28 s. Red on cream, gold on navy by default.

### `Kit.counter(el, from, to, opts) → proxy`

Writes formatted numbers into an element (e.g. `card.parts.big`). `format`: `"int"` (1,234), `"x"` (×600), `"pct"`,
`"hm"` (04h 05m from minutes), `"year"`, `"money"` (£), `"dec"` (with `decimals`), or a function. `prefix`, `suffix`.
Animate with `opts.tl, opts.at, opts.dur, opts.ease`, or later with `proxy.tween(tl, t, dur, ease, to, from)`.

```js
const c = Kit.card(st, { x: 1060, y: 860, w: 380, eyebrow: "Banda · 1621", big: "15,000" });
c.in(tl, 0.2);
Kit.counter(c.parts.big, 15000, 1000, { format: "int", tl, at: 1.5, dur: 1.2 });
```

### `Kit.priceLadder(stage, steps, opts) → { el, card, rows, counter, in(tl, t), step(tl, i, t, dur=0.7) }`

The price multiplying at each hand. `steps = [{ label, value, text? }]`. A card with a big `×N` counter and one row per
hand; `step(tl, i, t)` reveals row `i`, greys the previous row and ticks the counter. Options: `x`, `y`, `w` (420),
`eyebrow`, `small`, `format` (`"x"`), `bigSize`.

### `Kit.waffle(stage, n, opts) → { el, cells, width, height, in(tl, t, stagger), fill(tl, t, from, to, color, stagger), dimRange(tl, t, from, to, opacity) }`

`n` dots or tiny figures for counts (e.g. 150 dots, 1 dot = 100 people). Options: `cols` (10), `size` (18), `gap` (8),
`shape` (`"dot"` or `"figure"`), `color` (`"ink"`), `fillColor` (`"red"`), `filled` (how many start in the fill
colour), `x`, `y`. Call `fill` before any later `themeFlip` in the script.

```js
const w = Kit.waffle(st, 150, { x: 1060, y: 300, cols: 15, size: 22, gap: 8 });
w.in(tl, 0.2, 0.02);
w.dimRange(tl, 1.5, 10, 150, 0.15);   // 15,000 → 1,000: 140 of 150 dots fade
w.fill(tl, 1.5, 0, 10, "red", 0.02);
```

### `Kit.bar(stage, data, opts) → { el, bars, grow(tl, t, stagger) }`

Horizontal paper bars growing from the baseline. `data = [{ label, value, text?, color? }]`. Options: `x`, `y`, `w`,
`barHeight` (34), `gap` (22), `labelWidth` (180), `max`, `format`, `prefix`, `suffix`, `highlight` (index drawn red),
`color` (`"blue"`).

---

## 9. Cutouts

### `Kit.cutout(target, name, opts) → cutout object`

Hand-authored flat paper illustrations (2–4 paper colours each, every piece a textured sheet with its own small
shadow, the whole object lifted off the desk). `target` is the stage (goes to `stage.top`) or any SVG/group.

Names (`Kit.cutoutNames`): `nutmegFruit` (split fruit, red mace lattice on the brown seed), `nutmegSeed`, `mace`,
`nutmegTree`, `sack`, `barrel`, `scales`, `guilderCoin`, `poundCoin`, `ledger`, `treatyScroll` (red wax seal),
`quill`, `fort` (bastion fort, top view, VOC flag), `windmill` (`parts.sails` is a group you can rotate), `canon`,
`flagVOC` (orange/white/blue, VOC monogram in strokes), `flagEngland`, `manhattanIsland` (≈43-point outline on a water
patch, red dot at Nieuw Amsterdam; `water:false` drops the patch), `runIsland` (Run and Nailaka with nutmeg trees),
`silhouettePerson` (`pose: "stand" | "kneel"`, `color`), `crowdRow` (`n`, `gap`, `highlight: [indices]`, `pose`,
`color`; figures in `parts.fig0…`).

| opt | default | |
|---|---|---|
| `x`, `y` | `0` | centre |
| `size` or `scale` | scale 1 (≈200 px) | `size` = nominal height in px |
| `rotate` | `0` | static rotation |
| `label`, `labelDy`, `labelOpts` | none, `120×scale` | a caption under it (fades in with the placement) |
| `paper` | `true` | `false` drops the outer shadow |

The object: `{ el, body, wob, parts, place(tl, t, opts), in (= place), out(tl, t), wobble(tl, t, dur, opts), setPose(x, y, angle, flip) }`.

- `place(tl, t, { from: "left"|"right"|"top"|"bottom", dist (30–60), rot (±2.5–4°), dur: 0.55, ease: "back.out(1.2)", seed })`:
  slides in as if placed by hand and settles with a tiny overshoot. Unspecified values come from a seeded PRNG.
- `wobble(tl, t, dur, { fps: 12, px: 0.6, deg: 0.3, seed })`: stop-motion jitter stepped at 12 fps. Illustrations only.

```js
const fruit = Kit.cutout(st, "nutmegFruit", { x: 330, y: 640, size: 250, label: "Nutmeg · Run", labelDy: 190 });
fruit.place(tl, 1.0, { from: "left" });
fruit.wobble(tl, 1.6, 6);
```

---

## 10. Motion helpers

| call | does |
|---|---|
| `Kit.dim(tl, targets, t, to=0.28, dur=0.4)` | dim to context; targets are elements or kit objects (`route.g`, `pin.group`, `cutout.el`) |
| `Kit.enter(tl, el, t, "fadeUp"|"fade"|"pop"|"blur", {dur, to})` | entrance presets (0.35 s `power2.out`, 10 px rise) |
| `Kit.exit(tl, el, t, dur=0.3)` | opacity-only exit |
| `Kit.place(tl, obj, t, opts)` / `Kit.wobble(tl, obj, t, dur, opts)` | same as the cutout methods |
| `stage.fadeIn(tl, t, dur)` | scene crossfade in |

Defaults baked in from the style analysis: entrance 0.35 s `power2.out` with a 10 px rise; exit 0.3 s fade; camera
`power3.inOut`; theme flip 0.28 s; dim 0.28; stamp settles by 0.28 s; pins pop 0.22 s with the label 0.05 s later.

---

## 11. Performance

Measured: the 25 s demo (750 frames, 1080p, `--quality delivery`) renders in 67 s on this machine, roughly
270 ms per frame per worker, with HyperFrames reusing still frames automatically. A 10-minute film at the same density
is about 25–30 minutes of rendering.

- One `Kit.stage` per scene. Filters, patterns and textures are shared per scene; textures are generated once per page.
- The paper filter runs on whole groups (all land in one group), not per element. Do not put thousands of separately
  filtered elements on screen; for big point sets use `Kit.waffle` (one filtered group).
- Use `land:"110m"` for world views and globes; `50m` only for regional maps (it is culled to the frame and islands
  under `minArea` px² are skipped).
- Globes re-project every land path each frame while they rotate; keep rotations short and the radius modest, and do
  not rotate a globe behind a ride if you can avoid it.
- Still frames are cheap (deduplicated); a slow continuous move on a big filtered layer is expensive. Prefer a hold
  and one precise move.
- Avoid animating `scale` on a filtered map group every frame (the filter re-rasterises); move cutouts on their outer
  transform (the kit does) and keep camera zooms short.
- `paper:false` on a map or cutout removes its filter if a shot is too slow.

---

## 12. Limits and known issues

- Flat maps do not wrap routes across the antimeridian; split such routes yourself.
- The Banda Islands and Manhattan are simplified, schematic shapes (label shots "schematic"); positions are close to
  real, coastlines are not survey-accurate. Manhattan is widened about 30% so it reads at small sizes.
- The demo's price ladder numbers are illustrative placeholders, not sourced figures.
- Chapter tabs (13 px) and small captions trigger HyperFrames' 28 px phone type-floor warning; that is by design for
  chrome. The demo has no audio (`film_silent` warning).
- Text sitting on light navy land can fall below WCAG contrast; place titles over sea or on a card.

## Preview the sheet

`compositions/kit-sheet-v1.html` shows every v1 cutout and vehicle. To look at it, temporarily point the host in
`index.html` at it (`data-composition-id="kit-sheet-v1"`, `data-duration="1"`, root `data-duration="1"`), run
`npx hyperframes snapshot --at 0.5`, then restore `index.html`. The v2 sheet (`kit-sheet.html`, 20 s) is what
`index.html` mounts now; snapshot it with `--at 2,7,13,18`.

---

## 13. Kit v2 (2026-11-17, after the owner's episode-1 review)

### 13.0 What changes for builders (v1 → v2)

| v1 | v2 |
|---|---|
| `Kit.stage` drew the compass + wordmark **top-left** | the logo is **bottom-right** (`.kit-logo { right: 66px; bottom: 38px }`); top-left is the date |
| `Kit.stage` drew five text tabs top-right | it draws the **reason icon bar** (`Kit.reasonBar`) with `Kit.reasons` (seed, route, company, island, treaty). Text tabs appear only when you pass `tabs: [...]` explicitly (or the `chapters` variable) |
| `st.tabs.setActive(tl, t, i)` | still works (it is the reason bar's `set`); prefer `Kit.setReason(tl, t, i)`; `-1` = all muted, no label |
| no date | `Kit.stage(root, { date: "1616" })` or `Kit.dateLabel(st, "1616")`; change it with `Kit.setDate(tl, t, "1621")` |
| `Kit.exit(tl, el, t, dur)` (opacity) | unchanged; new form `Kit.exit(tl, t, targets, { style: "lift" })` (the argument order tells them apart) |
| "finished layers dim to 0.28" | dim only what is still context; remove finished elements with `Kit.exit(..., { style: "lift" })` |
| chrome in the top 100 px | top 140 px (reason labels sit under the icons) + the bottom-right corner |
| `index.html` mounted the 25 s v1 demo | it mounts the 20 s v2 sheet. To re-render `demo.mp4`, mount the three v1 hosts again: `demo-route` 0–9.5 (z 1), `demo-banda` 9–17.5 (z 2), `demo-parade` 17–25 (z 3), root `data-duration="25"` |
| `compositions/kit-sheet.html` = every cutout | that sheet is now `kit-sheet-v1.html`; `kit-sheet.html` is the v2 sheet |

New stage options: `date` (text), `reasons` (array for `Kit.reasonBar`, or `false` for no bar), variable `reasons`.
`chrome: false` still turns off all chrome (logo, date, bar). The chip (`disclaimer`) stays bottom-left.
Scenes that already pass `active: n` get the reason bar with icon `n` raised, with no other change.

### 13.1 Date label (top-left, always straight)

`Kit.dateLabel(stage, text, { x, y }) → { el, set(tl, t, text, dur=0.6), setNow(text) }`
`Kit.setDate(tl, t, text, stage?) → dateLabel`

Newsreader 34 px, small caps, old-style figures, tracked 0.06em, ink (theme-aware). Never rotated, never a stamp.
`setDate` crossfades (old fades up and out, new fades in 0.18 s later, 0.6 s); it creates the label if the stage has
none. The stage defaults to the scene being built.

```js
const st = Kit.stage(root, { theme: "cream", date: "Anno 1616", active: 3 });
Kit.setDate(tl, 6.2, "1621");
```

### 13.2 Reason icons (top-right)

`Kit.reasonBar(stage, reasons, active, opts) → { el, items, set(tl, t, i), setActive }` (made by `Kit.stage`)
`Kit.setReason(tl, t, index, stage?)`

`reasons = [{ icon, label }]`. `icon`: `"nutmeg"` (`"seed"` = the bare seed), `"route"` (`"dhow"`), `"voc"`
(`"company"`), `"fort"` (`"island"`, `"siege"`), `"scroll"` (`"treaty"`), any cutout or vehicle name, or a function
returning cutout pieces. Default (`Kit.reasons`): THE SEED, THE ROUTE, THE COMPANY, THE ISLAND, THE TREATY. Tiles are
70 px paper squares; the active one is raised 6 px, full colour, ivory, with a red rim, and only its label (mono 15 px,
1–2 words) shows under the row (centred under the icon, kept inside the row). The others are greyed. `set` takes
0.45 s; `-1` mutes all and hides the label.

```js
const st = Kit.stage(root, { reasons: [{ icon: "nutmeg", label: "The seed" }, { icon: "route", label: "The route" },
  { icon: "voc", label: "The company" }, { icon: "fort", label: "The island" }, { icon: "scroll", label: "The treaty" }], active: -1 });
Kit.setReason(tl, 0.8, 0);
```

### 13.3 Waving flags

`Kit.flag(target, type, opts) → cutout object + { flag, render(phase), wave(tl, t, dur, speed) }`

Types (`Kit.flagTypes`): `england1616` (St George's cross), `union1606` (blue, white saltire, St George's cross
fimbriated white, no red saltire), `voc` (Prinsenvlag orange/white/blue with the VOC monogram in the white band),
`dutchRepublic` (red/white/blue), `prinsenvlag` (plain orange/white/blue, no monogram: non-VOC Dutch, e.g. New Netherland 1626), `franceRoyal` (white; `lis: true` adds gold fleurs-de-lis semé), `grenada`
(red border with 3 yellow stars top and 3 bottom, yellow top/bottom and green hoist/fly triangles, red disc with a
yellow star, nutmeg in the hoist triangle), `britain1801` (Union Jack with the counterchanged red saltire). Aliases:
`england`, `unionJack`, `prinsenvlag`.

| opt | default | |
|---|---|---|
| `x`, `y` | 0 | the **top of the hoist** (where cloth meets pole) |
| `w` | 240 | cloth width in px |
| `pole` | 2.6 | pole length × cloth height; `0` = no pole |
| `amp`, `speed` | 1, 0.55 | wave amplitude multiplier; cycles per second |
| `wave` | true | `false` = never waved by `Kit.waveFlags` |
| `tl`, `at`, `dur` | — | with `tl`, waves at once from `at` for `dur` (10) s |
| `phase` | seeded | starting phase |
| `label`, `labelOpts`, `rotate` | | as `Kit.cutout` |

The wave is a sine displacement along the fly (amplitude grows from the hoist, plus a second harmonic), with light and
dark shading bands following the slope, recomputed from the GSAP timeline (no CSS animation). Without a wave tween the
flag holds a still, already-rippled frame. `flag.wave(tl, t, dur)` drives it; consecutive calls continue the phase.
`Kit.waveFlags(tl, t, dur, stage?)` waves every flag and figure pennant in the scene that has not been waved yet.
Flags also take `place`, `out` and `Kit.exit`.

```js
const fl = Kit.flag(st, "grenada", { x: 1200, y: 300, w: 300, pole: 1.6, label: "Grenada, 1974" });
fl.place(tl, 1.0, { from: "bottom" });
fl.wave(tl, 0, 8);
```

### 13.4 VOC logo and reveal

`Kit.vocLogo(target, { x, y, size=300, chamber: "A", color: "ink"|"gold", flags: true, sealColor, label }) →
{ el, body, seal, mono, flags, strokes, in(tl, t, opts), out(tl, t), wave(tl, t, dur) }`

The historic monogram: a large V with serifs, the O interlaced on the left arm and the C on the right arm (over/under
weave), and the chamber letter above (`"A"` = Amsterdam; `chamber: false` for none). Cut-paper strokes in dark ink (or
deep gold) on a scalloped parchment seal with a double ring; two VOC flags on poles behind. `size` ≈ seal diameter.

`Kit.vocReveal(tl, t, logo, { hold=6, speed=1 }) → end time` (≈ `t + 2.9`): the strokes draw on like ink (V 0.75 s,
then O, C, A), the seal stamps behind them at `t + 1.6` (1.28 → 0.97 → 1, a small impact on the letters), then the two
flags rise behind it (`t + 2.0`, 0.16 s apart) and wave for `hold` s. Without `vocReveal` the logo shows complete.

```js
const logo = Kit.vocLogo(st, { x: 960, y: 560, size: 380 });
Kit.vocReveal(tl, 1.2, logo, { hold: 5 });
```

### 13.5 Figures v2

`Kit.figure(target, kind, opts) → cutout object + { pose(tl, t, name, dur), walk(tl, t, dur, {dx, dy, fps}),
swim(tl, t, dur, {dx, fps}), fall(tl, t, {dir}), parts, pennant }`

Flat, faceless paper puppets (frontal), about 210 units tall, centred on `x, y` with the **feet at `y + 100 × scale`**.
Every part is its own paper piece with a small shadow; silhouettes differ by headwear and dress, never by facial
features (no caricature).

| kind | look |
|---|---|
| `englishman` | red knee-length coat (the owner's choice for readability; not period-accurate before the 1640s, never claim it), white falling collar, broad low hat, gold buttons |
| `dutchman` | black doublet, large flat white collar, tall black capotain hat, wide black breeches |
| `bandanese` | a 17th-century Banda islander, warm brown skin. `variant: "male"` (default): bare arms, batik-like kain to mid-calf, madder-red head cloth with a knot, shoulder cloth. `variant: "female"`: long kain to the ankles, indigo shawl over one shoulder, dark hair in a bun with a red band |
| `orangKaya` | a village leader: long indigo jacket with gold trim and sash, rich red kain with a gold motif, tall ochre head wrap |
| `japaneseMercenary` | kasa hat, kosode and wide hakama; no weapons |
| `sailor` | loose shirt with rolled sleeves, red neckerchief, baggy breeches, knit cap, bare feet |

Poses (`Kit.figurePoses`): `stand`, `walk` (mid-stride), `swim` (head and arms above a patch of wavy water; the body is
clipped at the waterline; a build-time pose), `sign` (holding a sheet, quill in hand), `kneel`, `fall` (lying flat,
tinted deep red #C03F27; no blood, no wounds). Options: `pose`, `scale` (0.6) or `size` (px), `variant`, `flagOnTop`
(any flag type: a small pennant on a staff above the head, waved by `Kit.waveFlags`), `dir` for `fall`, `tintColor`,
plus the cutout options (`label`, …).

- `fig.fall(tl, t, { dir: "left"|"right" })`: tints red over 0.35 s, then tips over about the feet (0.55 s,
  `power2.in`) and settles flat (1.0 s in all).
- `fig.walk(tl, t, dur, { dx, fps: 5 })`: stop-motion stride (two keys at `fps`) while moving `dx` px; it ends in the
  pose it had. `fig.swim(tl, t, dur)`: alternating strokes, a small bob, moving water.
- `fig.pose(tl, t, "kneel", 0.4)`: tween to another pose. Build these calls in time order.

```js
const islander = Kit.figure(st, "bandanese", { x: 700, y: 640, scale: 0.8 });
islander.place(tl, 1.0, { from: "bottom" });
const eng = Kit.figure(st, "englishman", { x: 980, y: 640, scale: 0.8, flagOnTop: "england1616" });
eng.walk(tl, 1.4, 2, { dx: 120 });
Kit.figure(st, "sailor", { x: 1300, y: 640, scale: 0.8 }).fall(tl, 4.2);
Kit.waveFlags(tl, 0, 8);
```

### 13.6 Portrait frame

`Kit.portrait(stage, { src, name, role, x, y, w=300, fit, noPortrait, frameColor, seed }) → { el, svg, plate, in(tl, t), out(tl, t, style) }`

An oval cut-paper frame centred on `x, y` (`w` = oval width, height 1.27 w) holding `src` in **black and white**
(SVG `feColorMatrix` saturate 0, a slight contrast lift and fine paper grain), and a paper name plate (Newsreader name,
mono role). `fit` is the `preserveAspectRatio` (`"xMidYMid slice"`; `"xMidYMin slice"` keeps the head of a tall
painting). With no `src`: a neutral mannequin bust and "NO KNOWN PORTRAIT" in small mono. `in` is the hand-placed
entrance; `out` lifts it off. Put images in the project's `assets/portraits/` (PD files from Wikimedia) and pass
`"assets/portraits/<file>.jpg"`. The kit ships `assets/portraits/test-portrait.jpg` for testing only.

```js
Kit.portrait(st, { src: "assets/portraits/coen.jpg", name: "Jan Pieterszoon Coen", role: "VOC Governor-General", x: 1450, y: 500 }).in(tl, 2);
Kit.portrait(st, { name: "Nathaniel Courthope", role: "English agent on Run", x: 1450, y: 500 }).in(tl, 9);
```

### 13.7 Price climb

`Kit.priceClimb(stage, proj, stops, opts) → { route, pins, stacks, tags, token, card, all, run(tl, from, to) }`

`proj`: a `Kit.flatMap` (stops in lon/lat or `Kit.places` names), a function `[lon,lat] → [x,y]`, or `null`
(screen coordinates). `stops = [{ at, label, value, coins?, pos?, dx? }]`. Every number comes from the caller; the kit
invents none. A smooth red route joins the ports; a nutmeg-seed token travels it port to port (easing into each, holding
`hold` = 0.3 s); at each port a pin pops, a coin stack grows (`coins`, or 1 + 3·log10(value ÷ first value), max 12) and
a paper price tag appears and ticks up from the previous price; at the end a card shows the multiplier (last ÷ first,
rounded, or your `multiplier` text).

| opt | default | |
|---|---|---|
| `tl`, `from`, `to` | — | with `tl`, runs at once; else call `run(tl, from, to)` (≥ 4 s; the card lands at `to - 1.1`) |
| `format`, `prefix`, `suffix`, `decimals` | `"dec"` | as `Kit.counter` |
| `card` | `{ x: 1380, y: 760, eyebrow: "FROM FIRST PORT TO LAST" }` | `{ x, y, w, eyebrow, small, color }` or `false` |
| `multiplier`, `color`, `width`, `tokenSize`, `hold`, `pin` | | |

```js
const climb = Kit.priceClimb(st, map, [
  { at: "banda", label: "Banda", value: P_BANDA }, { at: "malacca", label: "Malacca", value: P_MALACCA },
  { at: "venice", label: "Venice", value: P_VENICE }], { format: "money", card: { eyebrow: "Price of a pound", small: "Source: …" } });
climb.run(tl, 2.0, 9.0);
```

### 13.8 Scroll

`Kit.scrollPaper(stage, { lines, x, y, w=520, h=420, cps=38, paper }) → { el, unroll(tl, t, dur=0.9), type(tl, t, cps), scroll(tl, t, dur, px), in(tl, t), out(tl, t, style) }`

A parchment with rolled ends: `unroll` drops the bottom roll while the sheet is revealed (0.9 s); `type` types the
lines on character by character (the layout is fixed from the start, so nothing reflows); `scroll` moves the text up
`px` inside the sheet. `in` = unroll, then type 1.1 s later. `lines`: strings, or `{ text, style: "head" | "body" |
"sign" }`. `x, y` = top-left.

```js
const sc = Kit.scrollPaper(st, { x: 1180, y: 220, lines: [{ text: "Treaty of Breda", style: "head" }, "…", { text: "31 July 1667", style: "sign" }] });
sc.in(tl, 1.0); sc.scroll(tl, 6, 4, 120); sc.out(tl, 11);
```

### 13.9 Removing finished elements

`Kit.exit(tl, t, targets, { style: "lift" | "fade", dur, stagger, dist=26, rot=3.5, seed })`

`lift` (default, 0.5 s `power2.in`): the paper lifts off (up 26 px, ±3.5° seeded, scale 1.03) and fades. `fade`:
opacity only (0.35 s). `targets`: elements or kit objects (cutouts, figures and flags lift by their body and take their
label with them; pins, routes, cards, titles, portraits, scrolls, the VOC logo, a whole `priceClimb` through its
`all`), or an array of them; `stagger` spaces them. Do not also `Kit.dim` the same element at an overlapping time.

```js
Kit.exit(tl, 8.4, [card, fruit, pinRun], { style: "lift", stagger: 0.05 });
```

### 13.10 Verified

`compositions/kit-sheet.html` (20 s, `demo_v2.mp4`): every figure kind in every pose (walk, swim and fall animated),
pennants, every flag type waving, the VOC reveal, a portrait with an image and the mannequin, the price climb, the
scroll, `Kit.exit` lift on every page, the date changing three times and the reason bar in every state (−1, 0–4, −1).
