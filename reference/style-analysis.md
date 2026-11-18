# Manicule (@maniculetv): Visual and Animation Style Analysis

Scope: 2D only. Goal: rebuild the look in HyperFrames (HTML/SVG + d3-geo + GSAP).

**Sources and how far to trust them**
- 8 Gemini reports in `agy_out/` (model output; it watched 960x540 24 fps proxies, so its frame counts are in 24 fps).
- Contact sheets in `sheets/`, plus 27 full-resolution frames I pulled myself into `style/frames/` (overview: `style/all_frames.jpg`).
- My own measurements: pixel sampling of the 1080p frames, frame differencing of the top 3 videos at 12 fps and 30 fps, and audio RMS envelopes.
- Tags used below. **[V]** = I verified it on real frames or audio. **[R×n]** = the claim recurs in n of the 8 reports. **[R1]** = one report only, so treat it as a lead, not a fact.
- **Correction to the reports:** the masters are **1920x1080**. The top 3 videos (Antarctica, Sydney–London, Atlantic) and Floodgate are **30 fps**. The newer Tibet, MH370, Sea airports and Mediterranean videos are **60 fps** [V]. Build at 1920x1080. 30 fps is faithful and 60 fps matches the newer uploads. All pixel sizes below are at 1080p.

---

## 1. The look in one paragraph

Manicule looks like a **cartographer's desk turned into motion graphics**. The base is a warm cream sheet of paper with a heavy radial vignette, and it flips to a deep navy "night" stock for the cold opens, the dramatic beats and the finales. On it sit muted Natural-Earth-style maps: sand-coloured land on dusty powder-blue sea by day, slate-blue land on navy sea by night. Over the maps go a very small set of semantic inks: vermilion for danger or the featured route, petrol blue for data and emphasis, glowing amber for live flights at night, and pine teal for safe or alternative paths. Type is one editorial serif with **one italic, recoloured key word per headline** ("Why planes *avoid* Antarctica", "The *watch*"), next to wide-tracked uppercase mono for every label and number. About 76–91% of frames are near-static [V]. One idea is on screen at a time, things enter with calm decelerating fades, earlier layers dim to 25–30% instead of disappearing, and there is almost never a hard cut. **Why it feels premium:**
1. **Restraint.** About 6 inks, 2 typefaces, no gradients on illustrations, and no bounce.
2. **Print vocabulary.** Paper grain, stamps, bookplate cards, label halos instead of boxes, and the woodcut hand logo.
3. **Cartographic honesty.** Real orthographic globes, true great circles, and small "TRACKS ILLUSTRATIVE" or "SCHEMATIC · NOT TO SCALE" disclaimers.
4. **Patience.** A long still hold is followed by one precise move, and motion lands on the narrated noun.
5. **Hierarchy through dimming.** It reads like an argument being built up, not a slideshow.

---

## 2. Design tokens

### 2.1 Two main themes, plus a "frost" variant

| Token | Cream "paper" (default, ~65–75% of runtime) | Navy "night" (~20–30%) | Frost (special chapters, e.g. "Cold") |
|---|---|---|---|
| `bg.center` | **#E7DEC8** [V] (reports: #E7DFC9, #E9E1CA) | **#192733** [V] (reports: #1A2833) | **#E1E7E8** [V] |
| `bg.corner` (vignette edge) | **#C3B9A3** [V], a 16% luminance drop | **#1C242B** [V], only about 3–5% darker and slightly desaturated | #BBBEBB [R1] |
| `ink.primary` | **#242018** [V] warm espresso (reports: #281F14, #281E13, #25221B); never pure black | #EFE9D9 / #F4EFE4 [R×3] | #242018 |
| `ink.secondary` | #625949 / #645C4F olive-taupe [R×3]; inactive chapter numerals sample as #A69C86 [V] | #8C9BA5 [R1] | — |
| `card.fill` | #EFE9D9–#F0EADA ivory, a little lighter than the paper [R×4]; a softer translucent variant samples as #E3DAC7 [V] | Near-black navy #1D2124 with a 1.5px gold border [V, Sydney counter card] | — |

**Theme roles** [R×8, V on contact sheets]
- **Navy:** the cold open (most videos open on navy), live-flight swarms, the tragedy or "turn" beats (the Antarctica "12:49 PM / 257"), chapter-zero hooks ("The hardest flight *on Earth*"), and the finale or end card.
- **Cream:** all explanatory chapters, charts, chapter cards and the mid-roll subscribe beat.
- **Frost:** used once per video at most, for a cold, ice or whiteout chapter.

### 2.2 Map fills

| Role | Cream theme | Navy theme |
|---|---|---|
| Ocean (globe) | **#9AB3BE** [V] (reports: #9EB8BF–#A5BDC3) | **#192D3E** [V] (reports: #1B2E3E) |
| Ocean (flat map) | **#C0D0D4** [V], a lighter powder blue, with a faint graticule | **#1C3243** [V] |
| Land | **#E0D8C0** [V] on flat maps; #DED1B4 on globes, with hillshade #C9BD9F [R×2] | **#6E8494** [V] on globes, **#4F6C7E** [V] on flat maps; slate blue, slightly hillshaded |
| Ice (Antarctica, Greenland caps) | **#F1EDE5** [V] | #EEF3F7–#FFFFFF [R×2] |
| Coastline stroke | Hairline #4B5960 at about 40% opacity, 1–1.5px [R×2] | None or very faint; edges are fill-on-fill |
| Globe rim | 2px #242018 (cream) [V] | 1.5px rgba(190,210,225,0.55) (navy) [R×2, V] |
| Graticule | 15° spacing, 1–1.5px, 6–8% opacity [R×4, V] | Same |
| Relief | Newer videos (Tibet, Floodgate, Sea airports) use a **shaded-relief raster** under the vector layer, and Sea airports adds an OSM-like street basemap [V] | — |

### 2.3 Semantic accents (the only saturated colours)

| Token | Hex | Meaning |
|---|---|---|
| `accent.red` | **#C03F27** [V] (#BF3F24–#C83E2B across all 8 reports) | Danger, featured or record route, the active chapter, stamps, pins, the subscribe button, the single highlighted silhouette |
| `accent.red.onNavy` | #DF716B / #D4746C [R×2] | Coral version so red does not vibrate on #192733 |
| `accent.blue` | **#24506C** [V] (#27526D, #28526B, #1F5673) | Italic emphasis word on cream, data bars, mercury, the "cold" colour, mono section kickers ("REASON 1") |
| `accent.gold` | #E2AF51 / #F2BA5D [R×5] | Italic emphasis word on navy, live flights, the navy-theme counter, stamps on navy |
| `accent.gold.core` | #FCE59E core with an rgba(242,186,93,0.35) blur halo of 16–24px [R×2, V] | Glowing flight arcs at night |
| `accent.teal` | #376B67 / #2B6E57 / #327262 [R×5]; lifted on navy to #8FC3B8 | Safe threshold, alternative or new route (the 2018 Perth line), ETOPS rings (with a 16% fill) |
| `accent.green` | #579269 [R1] | "Safe" dashed line and oxygen bar |

**Rule:** each frame holds at most 2 accent colours plus ink. Colour always encodes meaning and never decorates.

### 2.4 Type system

**Display serif** [V]
- A high-contrast transitional or Scotch-style serif with ball terminals, heavy bold romans and a lively true italic.
- Closest Google Fonts: **Newsreader** (Display optical size, 600–800; italic 500–700). Alternatives: **Fraunces** (opsz 72, SOFT 0, WONK 0) or **Source Serif 4 Display**.
- Newsreader is already loaded in `manicule/font.css`, so use it.
- **Headline:** 600–700 weight, mixed case, tracking −0.015em.
  - Chapter cards: 56–68px. Top-left section headers ("The *watch*"): about 96px [V; cap height ≈ 80px].
- **Accent word:** the same family in *italic*, recoloured `accent.blue` on cream or `accent.gold` on navy.
  - It appears in about 90% of headlines [R×8, V]. It is usually the last word or phrase: "fly *to*", "*no slack*", "*One river of lights.*"
- **Hero numerals:** bold serif, 72–116px, lining figures ("Day 72", "1989", "−89.2°", "257", "238 *seats*").
- **Pin labels on cream globes and card body:** serif 600, 30–38px (Buenos Aires, Perth).
- **Ocean names:** serif italic, 24–28px, tracked +0.12em ("*Pacific*", "*Atlantic*"), sometimes set on a path.

**Mono** [V]
- Closest Google Fonts: **IBM Plex Mono** 500–600 (dotted zero; this matches the "00h 01m" counter). Alternative: JetBrains Mono.
- Always **UPPERCASE**, tracked +0.12–0.22em.
- Used for the logo wordmark (about 22px, +0.22em), city labels on flat maps ("LONDON", about 26px), the "REASON 1" kicker (about 30px in blue), axis ticks, chart headers, card kickers ("1850s · EMIGRANT SHIP"), date banners ("27 JULY 2026 · TEST FLIGHT"), counters, stamps and disclaimers (about 19px at 55% opacity).
- Mono is how the numbers and facts speak. Serif is how the story speaks.

**Hierarchy recipe for a card:** mono kicker (22px, ink.secondary) → serif hero (72–116px, accent.blue or ink) → mono sub-line (20px).

### 2.5 Chrome

**Logo** [V, every frame of all 8 videos]
- Top-left at x=66, y≈68 (baseline 75).
- A woodcut pointing hand **☞**, about 60x22px, in ink (cream) or #E7DEC8 (navy), followed by `MANICULE` in mono at 22px, +0.22em, 18px gap.
- It is never animated, apart from the theme swap.

**Chapter progress, top right.** Three variants exist:
1. **Roman numerals** `I II III IV V`. Used in 6 of 8 videos [V].
   - Serif 600, about 34px, spaced at 84px pitch, right edge at x≈1810, y≈64.
   - Done chapters: ink. Future chapters: muted taupe (#A69C86 measured).
   - Active chapter: red, with a 2px × 52px red underline at y≈88, and the chapter's italic keyword centred below at about 26px, tracked +0.12em ("*People*", "*Runways*").
   - It appears on the chapter I card, about 1.2–1.5s after the title, as a 0.5s fade. Some videos hide it in the climax act [R×2].
2. **Labelled box tabs**, Sydney–London only [V]: `GLOBE FUEL SEATS BODY WORLD`.
   - 106x48px boxes, 2px ink border, 6px radius, mono 15px +0.14em, 10px gaps.
   - The active tab is filled. It is ink on the chapter title card and red later in the chapter.
3. **Status card**, Atlantic: no chapter tabs. Instead a small ivory card shows two live clocks ("NEW YORK 9:00 PM / LONDON 2:00 AM") in mono [V].

**Captions:** no burned-in subtitles [V]. All on-screen text is a designed label.

**Bottom-left "context chips"** [V, Atlantic and Sydney]
- A small translucent ivory pill (on light maps) or dark pill (on navy), mono 15px tracked, at x≈40, y≈1040.
- Examples: "REDRAWN EVERY DAY", "NIGHT → EAST · DAY → WEST", "JET STREAM · 200+ MPH". They work as captions for the map's current state.

**Top banner chip:** a dark #242018 pill with mono cream text, for example "RESEARCH FLIGHTS · NEW DREAMLINERS, NOT FLOWN EMPTY" [V].

**End card** [R×6]: a bookplate card ("TELL US IN THE COMMENTS / Would you fly *over the ice?*"), a red SUBSCRIBE button with the hand that clicks to a dark "SUBSCRIBED", and the closing globe dimmed to about 22% behind it.

### 2.6 Texture, grain, vignette

- **Vignette** [V]
  - Cream: a radial gradient from #E7DEC8 at the centre to #C3B9A3 at the corners. It is elliptical, follows the 16:9 frame, has a flat plateau out to about 45% of the radius, then falls off smoothly.
  - Navy: almost flat (#192733 → #1C242B).
  - It is baked on the background **under** the content: map fills also darken toward the corners on flat maps [V on B5 frames].
- **Grain** [V]: static, very fine monochrome noise.
  - Measured patch SD ≈ 0.9–2.0 out of 255 on flat cream, which is close to the encode noise floor.
  - About 2–3% opacity feTurbulence (baseFrequency 0.8–0.9, numOctaves 2), static rather than animated.
  - On navy it is effectively off.
- **Paper texture:** no visible fibres, folds or stains. "Paper" comes only from colour, vignette and grain. Stamps are clean-edged, not grunge.
- **Shadows:** cards cast a very soft drop shadow of about rgba(20,18,14,0.08), 0 4px 16px [R×3]. Nothing else has a shadow.

---

## 3. Map system

### 3.1 Projections and when each is used

| Projection | d3 | When | Share of map shots |
|---|---|---|---|
| **Orthographic globe** | `geoOrthographic().clipAngle(90)`; radius ≈ 440px at centre (960, 580), or smaller and docked to one side | Default for anything global. Polar views (rotate φ=±90) for Arctic and Antarctic routes. "The shortest path is curved" proofs. | ~60% of maps in the aviation videos (Antarctica ~85% [R1]) |
| **Equirectangular world** | `geoEquirectangular`, full-bleed 1920x1080 or framed 2:1 | Whole-route histories (Sydney–London 1919→2018), the flat-map foil, and the "string on the globe vs a straight line on a map" device | ~25% |
| **Zoomed regional** | Visually a flat projection (Mercator or equirectangular) at 5–30× zoom, often rotated so the route runs left to right | North Atlantic tracks, Tibet plateau, Tohoku coast, Osaka bay | ~15%, rising in newer videos |
| **Non-geographic schematics** | Plain SVG | Altitude profiles, cross-sections, coastal schematics labelled "SCHEMATIC · NOT TO SCALE" | Not counted as maps |

The newer videos (Tibet, MH370) also use 3D terrain slices and real satellite or Mars imagery [V]. These are **out of 2D scope**: skip them or replace them with a 2D elevation profile.

### 3.2 The flat-map vs globe device [V, Antarctica 00:17–00:35; recurs in Sydney–London]

1. Draw the naive straight line on an equirectangular map as a white or grey dashed line labelled "WHAT A FLAT MAP SUGGESTS".
2. Draw the true great circle as a red dashed line, "THE ACTUAL SHORTEST PATH". On the flat map it bows toward the pole.
3. Dim the naive line to about 30%.
4. Cross-dissolve to the polar orthographic globe, where the same red line reads as nearly straight.

The key idea: the projection changes while the route stays identical.

### 3.3 Routes

| Kind | Style |
|---|---|
| Featured or hypothetical great circle | **Red dashed**, 6px wide, 16px dash / 10px gap, round caps |
| Live flight (navy) | Solid gold #FCE59E, 4px, over a 16–24px blurred amber glow. Swarms use dozens of these with tapered "contrail" tails |
| Historical route (cream) | Solid petrol blue or red, 3–4px; older eras use a **dotted** line (4px dots on an 8px pitch; the 1850s ship route) [V] |
| Superseded route | The same line dimmed to 25–35%, or turned pale pink (the 1989 route behind the teal 2018 line) [V] |
| Safe or alternative route | Teal, solid or dashed |
| Thresholds and guides | 3.5–4px dashed (12/10) or 2px dotted (3/7) |

- Every route is a true great circle (`d3.geoInterpolate` or GeoJSON LineString through `geoPath`) [R×8].
- On flat world maps, routes that cross the antimeridian wrap: the plane exits the right edge and re-enters on the left [V, Sydney].

### 3.4 Pins and labels

- **Pins** [V]
  - Flat maps: red #C03F27 filled circle, r≈11px, with a 2.5px ink ring.
  - Navy globe: white fill #FAF8F2 with a 1.5px navy ring, r≈7px.
  - Cream globe: ink dot r≈6px, or a teal dot with a white ring.
  - Pins pop in over about 0.12s, and the label follows 0.05s later.
- **Labels:** mono uppercase on flat maps; serif 600 mixed-case on globes.
  - They never sit in boxes. A **5–6px stroke-behind halo** in the background colour keeps them legible (`paint-order: stroke`) [R×4, V].
  - Labels sit at an 8–14px offset, upper right by default.
- Continent names: mono with very wide tracking (+0.25–0.35em), about 22px, at 40–60% opacity.

---

## 4. Motion grammar

### 4.1 Eases (no elastic, no bounce) [R×8]

| Use | Ease | Duration |
|---|---|---|
| Card, pin, label entrance | `power2.out` / cubic-bezier(.22,1,.36,1), opacity 0→1 plus a 8–12px rise | 0.30–0.40s; groups stagger 0.08–0.12s |
| Exits | Opacity only, `power1.inOut` | 0.30s. Labels are always cleared **before** a globe spins |
| Globe rotation, map pan or zoom, bar growth | `power2.inOut` / `power3.inOut` (cubic-bezier(.65,0,.35,1)) | Re-centre 0.8–1.1s. 180° pole flip 1.6–2.2s. Big zoom 1.5–2.5s |
| Route draw-on | `power2.inOut`, or **linear** when a plane rides it | Single route 1.2–2.2s; showcase flights up to 12–20s (see 4.3) |
| Stamp | Scale 1.10→1.00 with opacity 0→1 in about 0.1s, settled by 0.2s, rotated −4° to −6° [V: full size by frame 2, settled by frame 5 at 30 fps] | 0.2s |
| Theme flip (cream↔navy) | Eased crossfade, S-curve | **0.27–0.30s** (8–9 frames at 30 fps) [V, measured in 3 instances] |
| Scene crossfade, same theme | `power1.inOut` | 0.4–0.6s [R×8] |
| Slow environmental creep (thermometer, fog) | `sine.inOut` | 7.5–9s |

### 4.2 Rhythm

- **Mostly still** [V]: 90–91% of sampled frames show essentially no change in Antarctica and Sydney–London, and 76% in Atlantic, which is swarm-heavy.
- Motion comes in bursts. The median change burst lasts 0.25–0.46s [V]: one move, then a hold of 2–6s while the narrator talks.
- Entrances are cued to the spoken noun. When the narrator lists items, pins land at 0.9–1.1s intervals [R×3].
- Globes keep a **1–2° ambient drift** during holds [V: visible across the stamp frame strip]. Charts and text screens are dead still.

### 4.3 Specific devices

- **Draw-on lines**
  - Solid lines: animate `stroke-dashoffset` from the path length to 0.
  - **Dashed lines reveal under a moving mask** (a solid clip-path stroke or a growing clip) so the dashes stay fixed and never "march" [R×3].
  - Arrowheads and plane icons ride the leading tip.
- **Plane on path** [V, Sydney 00:13–00:36]
  - A white top-down jet icon, about 28px, with its heading equal to the path tangent.
  - The trail draws flush behind its tail and the gold glow follows.
  - The showcase flight takes about 20s of screen time. Its progress is **ease-in**: the counter advanced 0→3→13→34→73→133→218→335→487→679→889 min in 1s steps, roughly power2.in, then decelerates into 24h 24m.
  - The plane wraps at the map edge. A swarm is the same component instanced 50–200 times, each with its own depart and arrive times.
- **Counters** [V]
  - A mono card: "IN THE AIR / 00h 00m / 2 KM" ticking to "24h 24m / 23,075 KM", driven by the same progress value as the plane.
  - Serif hero numbers count up over about 1.5–3s (`power2.out`), for example 0.0 → 3.6 million alongside a dot cloud filling in.
  - Tabular figures, so digits never jitter.
- **Stamps** [V]: mono 600 caps in a 2.5–5px rounded border (radius 6px), rotated −5°, coloured gold (navy) or red (cream). Examples: "NOT BANNED", "A STUNT", "DROPPED", "LONGEST EVER", "SPECIAL APPROVAL". There is no ink-texture erosion.
- **Info cards**
  - Square double-bordered bookplate (Antarctica): 1.5px outer #5C5546, a 4px gap, a 1px inner rule.
  - Or a soft rounded translucent ivory card with about 12px radius and no border (Sydney) [V].
  - Content: mono kicker → serif hero → mono sub-line.
  - Cards slide or fade 8–12px and are placed in an empty quadrant, so the map never moves out of the way for them. Sometimes the globe **docks** instead, moving to about 31% of the width at 88% scale to share the stage [R×2].
- **Dim to context** [R×8, V]: finished layers fade to **22–32% opacity** over about 0.4s when the next layer arrives, or switch to a pale tint (a red route turns pale pink). Layers build up into a visual proof.
- **Globe rotations:** true 3-axis `rotate([λ,φ,γ])` tweens, never a 2D spin of an image. Rotations are interpolated with `d3.geoInterpolate` on the centre (or quaternion slerp) so the path is the shortest one.
- **Map pans and zooms:** scale and translate tweens with `power3.inOut`. "Portal" zooms run 1→8× with `power3.in` while crossfading into a schematic, and the reverse on the way out [R×2].
- **Chart builds** [V]
  - Bars grow from the baseline (0.6–1.2s `power2.out`, stagger 0.05–0.08s).
  - Line charts draw on left to right.
  - Seat maps fill in by cabin class.
  - Waffle and people grids pop in row by row with a 0.03–0.08s stagger.
  - Timeline bars (sleep or meal schedules, airport curfews) wipe on from the left.
- **Typewriter text:** rare. A few mono data lines and the counter are the only "typing". Headlines fade, they do not type [R×3]. Do not overuse it.
- **Highlight one of many:** 10 silhouettes in ink with 1 in red; or one bar or route in an accent while the others stay ink or muted [V].

---

## 5. Transitions catalogue

All figures are measured or estimated over the top 3 videos (about 26 minutes).

| Transition | Frequency | Spec |
|---|---|---|
| **In-scene evolution** (same map, layers added, dimmed or panned) | ~40–50% of beat changes | No transition at all. This is the backbone |
| **Crossfade, same theme** | ~35–45% | 0.4–0.6s |
| **Theme flip, cream↔navy** | 3–8 per video [V: 9 in Antarctica, 6 in Sydney–London, 4 in Atlantic] | 0.27–0.30s S-curve crossfade. Too fast to read as a dissolve, too soft to read as a cut |
| **Chapter cards** | 5 per video (the I–V structure) [R×8] | Cream; centred `— I —` with hairlines; title with an italic word; optional italic deck; holds 3–5s; HUD updates. Sydney–London uses a "WALL 1 / The *fuel*" top-left variant, Atlantic a "REASON 1 / The *watch*" variant [V] |
| **Match cut, projection swap** (flat→globe, globe→regional) | 1–3 per video | Crossfade with the route kept in place |
| **Zoom portal** | 0–2 per video | Scale push with crossfade |
| **Hard cut** | ~0–1 per video [V: my frame differencing found 0 true one-frame cuts in the top 3] | Saved for one shock beat (the Antarctica WHITEOUT → "12:49 PM") |
| Wipes, slides, whip pans, glitches | 0 | Never |

---

## 6. Illustration library

All of it is flat vector with uniform 3–4px strokes, flat fills, no gradients and no rigging [R×8, V].

- **Map plane icon:** a top-down swept-wing jet, 20–30px, white or gold fill, sometimes with a thin ink outline. Rotated to the path.
- **Side-view airliner** [V]: a long white fuselage with a 3px ink outline, a row of dot windows, a navy tail fin, a grey-blue wing and engine. About 560px long for hero shots. Variants have the fuel tank highlighted in an accent, or are cut away.
- **Planform diagram:** an outline-only twin-engine jet (4px ink stroke, ivory fill, engines as rounded rectangles). Used for ETOPS.
- **Silhouettes:** a pictogram person (circle head plus trapezoid body), solid ink, one in red. A head-profile silhouette with an EEG trace (Sydney "BODY").
- **Clocks** [V]: white face, 4px ink ring, 12 tick marks, ink hands. Also a 24-hour **ring clock**: a thick arc ring split into day (gold) and night (navy) arcs, a sun or moon glyph in the centre, and a plane orbiting the ring.
- **Thermometer** [V]: a tall rounded tube with a 4px ink stroke, a petrol-blue mercury column and bulb, a mono tick scale from 0 to −90 °C, and dashed threshold callouts.
- **Fuel line:** a rounded box with hexagonal wax crystals (outline circles or hexagons) and a hatched filter.
- **Seat maps** [V]: a long capsule fuselage outline with cabins made of rows of small rounded squares, coloured by class (ink = economy, teal = premium, blue = business, red = first), and mono counts below (140 / 40 / 52 / 6).
- **Charts** [V]: bar charts (flat fill, no axes beyond a baseline and mono ticks), stepped area charts (Atlantic "waves", gold up and navy down), line or curve charts with a red curve, horizontal schedule or timeline bars, ring (donut) progress ("42% of the way around"), elevation strip charts (Floodgate).
- **Others seen:** a sailing ship, a "$$$" price tag, a sun glyph, checkmarks and crosses, radar range circles (teal 16% fill), a jet-stream "road" ribbon (a translucent blue band with dashed centre line), a book cover (Mediterranean), and the woodcut hand. The hand is the only engraved-style asset.

---

## 7. Sound design and sync

- **Voice:** a dry, close-mic male narrator, calm and journalistic. Pace is 155–160 wpm, dropping to about 125–135 wpm with 0.8–1.5s pauses at turns [R×6].
- **Music:** understated ambient or neoclassical: felt piano or plucks over pads. It turns to a minor drone in the tragedy acts and resolves warm in the coda, then plays solo for about 15s on the end card.
  - Measured [V]: the music bed sits at about −33 to −35 dBFS RMS in pauses, against voice peaks of −6 to −10 dBFS. That puts the music about **25 dB under the voice**.
  - Phrases swell slowly, about 6–8s per cycle (end-hold envelope).
- **SFX:** **the reports conflict.**
  - The Antarctica report lists paper ticks, stamp thuds, soft whooshes on globe spins and a chime on chapter cards.
  - The Atlantic report found no literal SFX at all.
  - My RMS check around the Antarctica "NOT BANNED" stamp found no isolated transient in the gap before the narration resumed.
  - **Verdict:** SFX are absent, or at most very quiet and sparse. Never use loud whooshes.
  - Recommendation: no SFX by default. Optionally add a −30 dB paper tick on stamps and a soft low swell on chapter cards.
- **Sync:** visual entrances land on the narrated noun, usually 0–150ms before it. Stamps land on the end of the stressed phrase. Chapter cards sit in the narration pause and the music swell. The single hard cut lands on a silence.

---

## 8. Production pipeline guess

**Evidence**
- Pixel-identical chrome and tokens across 8 videos.
- True orthographic projection with ambient spherical drift.
- Mathematically exact great circles with antimeridian wrapping.
- Dashes locked under reveal masks.
- Label halos done with a stroke behind the fill (`paint-order`-style).
- Instanced flight swarms with per-flight schedules (data-driven).
- Tabular counters bound to path progress.
- Disclaimers such as "TRACKS ILLUSTRATIVE".
- A switch from 30 to 60 fps between uploads.
- A weekly cadence ("A NEW DEEP DIVE EVERY WEEK" end-card line [R1]).
- Brand-new 2026 dates in the content.

**Most likely (about 60%): code-driven.** d3-geo on SVG or canvas, with GSAP-like tweening or a frame-driven renderer (Remotion, HyperFrames, Motion Canvas or similar), rendered headless. Shaded-relief rasters would be reprojected on canvas.
- The swarms, exact geodesics, data-bound counters and identical templating across very different topics all point this way.
- The switch to 60 fps is a trivial render flag in code.

**Alternative (about 40%): After Effects + GEOlayers 3.** GEOlayers gives orthographic globes, relief tiles, great-circle routes and Natural Earth data, plus Essential Graphics templates for cards, stamps and the HUD.
- The 3D terrain slices and satellite shots (Tibet, MH370) are Blender or GEOlayers renders composited in either case [R×4].

**How template-driven is it:** very. An estimated **80–85% of shots** are built from about 15 parametrised components: globe, flat map, route, plane, pin, card, stamp, chapter card, HUD, counter, bar chart, ring, timeline, silhouette row and chip. Each video adds 3–6 bespoke diagrams (thermometer, seat map, jet-stream road).

---

## 9. Replicability verdict (HyperFrames + d3 + GSAP)

| Element | Rating | How |
|---|---|---|
| Themes, vignette, grain | Easy | CSS tokens. Radial-gradient background. SVG feTurbulence overlay at 2.5% (cream only). The theme flip is a 0.28s opacity crossfade between two full-frame layers |
| Typography and italic accent word | Easy | Newsreader + IBM Plex Mono. A title component splits `{accent}` markup into an italic span in the accent colour |
| Logo and chapter HUD | Easy | Inline SVG hand (trace once) plus mono wordmark. HUD = numerals, an underline rect with x tweened, and a keyword crossfade |
| Orthographic globe (vector) | Easy–Medium | `geoOrthographic` + `geoPath` on SVG at 1080p, Natural Earth 50m. Animate `rotate` per frame from the GSAP timeline (a proxy object `{λ,φ,γ}` with onUpdate re-projecting). Keep the path count low or use canvas for speed |
| Globe with relief raster | Hard | Canvas per-pixel inverse projection of an equirectangular hillshade, or pre-render frames. Optional: the vector-only version is about 90% of the look |
| Equirectangular or regional maps | Easy | `geoEquirectangular`/`geoMercator` + `fitExtent`. Zoom by tweening scale and translate, or a CSS transform on a pre-projected SVG for speed |
| Great-circle routes | Easy | GeoJSON LineString through `geoPath` (d3 resamples to geodesics). On flat maps, split at the antimeridian |
| Dashed draw-on without marching | Medium | Dashed path masked by a duplicate solid path whose dashoffset animates. Same `d` string, so recompute both when the globe rotates |
| Glow arcs | Easy | Two strokes: the core plus a blurred halo (`filter: blur(8px)` or feGaussianBlur stdDeviation 6–10) |
| Plane on path | Easy–Medium | `getPointAtLength` at p and p+ε for heading; GSAP drives p. On a rotating globe, interpolate in lon/lat with `geoInterpolate` and project each frame |
| Flight swarm (100+) | Medium | Canvas layer with per-flight progress from a timetable, a tapered gradient trail, and drawn plane sprites |
| Counters | Easy | GSAP tween on a number with tabular-nums. Format h/m/km. Tie to the same progress as the plane |
| Stamps | Easy | SVG rect + text, rotate −5°, scale 1.1→1 in 0.2s |
| Info cards | Easy | HTML div; double border via border + outline-offset or an inner box-shadow; 0.35s rise |
| Dim to context | Easy | A timeline helper that tweens the previous layer group to 0.28 opacity |
| Charts (bars, lines, rings, timelines, waffles) | Easy | d3 scales + GSAP. Ring = arc path with dashoffset. Use the `dataviz` skill palette swapped to these tokens |
| Clocks, thermometer, seat map, silhouettes, side-view plane | Medium (one-time asset work) | Hand-built SVG components with props. The side-view airliner is the only fiddly drawing |
| Zoom portal | Medium | Scale tween of the map group with `power3.in` plus a crossfade to the schematic |
| 3D terrain slices, satellite imagery | Hard / out of scope | Replace with a 2D elevation profile or a flat relief inset |
| Sound | Easy | Music bed ducked about 25 dB under the voice; no SFX by default |

---

## 10. Manicule-style component kit

Shared props on every component:
- `theme: 'cream'|'navy'|'frost'`
- `start` (s): time on the composition timeline
- `in`/`out`: presets `fadeUp|fade|pop|draw`
- `dimAt?` (s): fade to 0.28 opacity at that time

| Component | Props |
|---|---|
| **Stage** | `theme`, `vignette=true`, `grain=0.025`, `logo=true`, `hud?: ChapterTabs props` |
| **ThemeFlip** | `from`, `to`, `at`, `duration=0.28` |
| **Logo** | `theme`, `x=66`, `y=68` |
| **ChapterTabs** | `variant:'roman'|'boxes'|'clock'`, `items:[{label, keyword}]`, `active`, `activeColor='red'`, `x=1810`, `y=64` |
| **ChapterCard** | `numeral:'I'`, `title:'Nobody to {fly to}'`, `deck?`, `kicker?` ('REASON 1', 'WALL 2'), `layout:'center'|'topLeft'`, `hold=4` |
| **TitleCard** | `text:'Why planes {avoid} Antarctica'`, `theme`, `size=68`, `align`, `subtitle?` |
| **GlobeOrtho** | `rotate:[λ,φ,γ]`, `radius=440`, `center=[960,580]`, `land`, `relief?:url`, `graticule=15`, `rim`, `drift=1.5` (deg over hold), `keyframes:[{t, rotate, radius, center}]`, `ease='power3.inOut'` |
| **FlatMap** | `projection:'equirect'|'mercator'`, `bounds?:[[w,s],[e,n]]`, `rotateLon?`, `relief?`, `graticule`, `zoomKeys:[{t, bounds}]` |
| **RouteArc** | `from:[lon,lat]`, `to`, `via?[]`, `style:'solid'|'dashed'|'dotted'|'glow'`, `color:'red'|'blue'|'gold'|'teal'|'ink'`, `width=4`, `dash=[16,10]`, `drawStart`, `drawDur=1.6`, `ease`, `arrow?`, `label?`, `dimAt?`, `tintAt?` |
| **PlaneOnPath** | `route` (RouteArc id), `icon:'top'|'side'`, `size=28`, `color`, `progressEase='power2.in'`, `trail=true`, `glow`, `wrap=true` |
| **FlightSwarm** | `flights:[{from,to,dep,arr}]`, `clock:{start,end,dur}`, `color='gold'`, `trailLen=0.15`, `count` |
| **Pin** | `at:[lon,lat]`, `label`, `labelFont:'mono'|'serif'`, `color`, `r=10`, `offset=[12,-12]`, `halo=6` |
| **MapLabel** | `at`, `text`, `kind:'ocean'|'continent'|'region'`, `italic`, `tracking`, `curved?` |
| **Counter** | `from`, `to`, `format:'hm'|'int'|'km'|'pct'|'million'`, `font:'mono'|'serif'`, `kicker`, `subline?`, `boundTo?` (PlaneOnPath progress), `dur`, `ease` |
| **InfoCard** | `kicker`, `hero`, `heroColor`, `body?`, `subline?`, `style:'bookplate'|'soft'|'dark'`, `anchor:'tl'|'tr'|'bl'|'br'|[x,y]`, `width` |
| **Stamp** | `text`, `color:'red'|'gold'`, `rotate=-5`, `at`, `size=34` |
| **Chip** | `text`, `pos:'bottomLeft'|'top'`, `tone:'light'|'dark'` |
| **DimGroup** | `targets[]`, `at`, `to=0.28`, `dur=0.4` |
| **BarChart** | `data:[{label,value,color?}]`, `orientation`, `unit`, `highlight?`, `axisTicks`, `stagger=0.08`, `grow=0.9` |
| **LineChart** | `series`, `x`, `y`, `color`, `drawDur`, `annotations[]` |
| **RingProgress** | `value`, `max`, `color`, `trackColor`, `radius`, `width=10`, `label`, `endLabels` |
| **RingClock** (24-hour) | `segments:[{from,to,color}]`, `marker:'plane'`, `markerFrom`, `markerTo`, `centerGlyph:'sun'|'moon'`, `labels` |
| **AnalogClock** | `time`, `toTime?`, `city`, `size=150` |
| **TimelineBars** | `rows:[{label, spans:[{from,to,color,text}]}]`, `axis:{from,to,ticks}`, `wipe=0.8` |
| **SilhouetteRow** | `count=10`, `highlight=[9]`, `color`, `highlightColor='red'`, `stagger=0.08` |
| **SeatMap** | `cabins:[{rows, cols, color, label, count}]`, `fillOrder`, `stagger` |
| **Thermometer** | `min`, `max`, `value`, `toValue`, `thresholds:[{v,label}]`, `dur` |
| **AirlinerSide** | `livery:{tail,wing}`, `highlight?:'tank'|'cabin'`, `length=560` |
| **ElevationProfile** | `profile[]`, `yMax`, `dashedLines[]`, `plane?`, `disclaimer` |
| **EndCard** | `question:'Would you fly {over the ice?}'`, `subscribeAt`, `bgDim=0.22` |

**Defaults to bake into the kit**
- Entrance 0.35s `power2.out` with a 10px rise.
- Exit 0.3s fade.
- Camera 1.0s `power3.inOut`.
- Same-theme crossfade 0.5s; theme flip 0.28s.
- Dim to 0.28.
- Stamp at 1.1→1 in 0.2s.
- At most 2 accent colours per frame.
- Hold every state at least 2s.
- Hard cuts are opt-in only.

Frames and measurements used: `style/frames/*.png`, `style/all_frames.jpg`, `style/tmp/stamp.jpg`, `style/tmp/plane.jpg`, `style/tmp/diff.py`.
