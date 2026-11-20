# Builder brief: Story of Everything ep-002 "The Machine That Doesn't Make Cold" (5-minute sample)

You are one of 4 motion designers. Each of you builds ONE chapter of a ~5-minute 2D paper-cutout explainer about how
people learned to make cold (Persian ice pits → Cullen's ether trick → Perkins's closed loop, the fridge cycle). Your
chapter is rendered on its own as a silent MP4. The narration, music and sound effects go on afterwards, and the
chapters are joined end to end. So the timing must match your packet exactly, and the look must match the other chapters.
This sample is what the owner judges the whole channel's 20-minute film by. **The physics animation is the point:**
the viewer must SEE heat move, liquid boil into vapour, a gas heat up when squeezed, and the loop run.

## Read first
- `C:\Users\ash\trade-routes\kit\KIT_API.md`, the shared paper-cutout kit (read §13 first). Use it for the stage,
  chrome, themes, date label, reason icon bar, cards, titles, labels, portraits, cutouts, figures, `Kit.exit` lift and
  motion helpers. Anything the kit lacks (a fridge, an air pump, a bell jar, a piston, a coil, a dome, a hill) you draw
  in YOUR chapter in the same cut-paper style: 2–4 flat colours, `Kit.paperFill` texture, the kit's rough-edge filter
  and shadow. Put it in `proj/assets/<ch>/` or inline.
- Your packet: `C:\Users\ash\trade-routes\episodes\ep-002-cold-machine\build\<ch>\packet.md`. It gives the frame count
  at the top, every paragraph with LOCAL start/end times, each VISUAL cue at its local time, and word timings
  (`word@seconds`). Land each visual change on its word, within ±0.15 s.
- The whole script for context: `...\ep-002-cold-machine\script_annotated.md` (its header has the shared grammar).
  The facts: `...\facts.md`.
- The style rules: `C:\Users\ash\trade-routes\reference\style-analysis.md` sections 1–5.
- The `hyperframes` skill (invoke it with the Skill tool) and its contract.

## Project and output
- Copy `C:\Users\ash\trade-routes\kit` to `...\ep-002-cold-machine\build\<ch>\proj`, skipping `demo.mp4`,
  `demo_v2.mp4` and any `renders/`. Never edit `assets/kit/kit.js`. Work only inside `build\<ch>`. Build your chapter
  as the root `index.html` there, with sub-compositions in `compositions/`, one per scene, as you like.
- Portraits (c3 and c4): copy from `...\ep-002-cold-machine\assets\portraits\` into `proj/assets/portraits/`.
- 1920×1080, 30 fps, no audio elements. The root `data-duration` must be EXACTLY `(frames - 0.5) / 30`, using the
  frame count at the top of your packet.
- Render: `npx hyperframes render -o chapter.mp4 --quality standard` inside `proj` (allow a long timeout, up to 45 min;
  renders share a machine lock, so wait). Frame check:
  `C:\Users\ash\anaconda3\envs\rubberband\Library\bin\ffprobe.exe -v error -count_frames -select_streams v:0
  -show_entries stream=nb_read_frames -of csv=p=0 chapter.mp4`. It must equal your frame count.

## Chrome for this episode
- Wordmark: the stage `channel` = `"STORY OF EVERYTHING"` (logo bottom-right).
- Date top-left: `Kit.stage(root, { date: ... })` / `Kit.setDate`. Follow the DATE in each cue.
- Reason icon bar top-right, THIS episode's five chapters, same order in every chapter (draw each icon as a small
  cutout function or use the closest kit cutout):
  `[{icon: <ice block>, label: "The ice"}, {icon: <glass flask>, label: "The trick"}, {icon: <circular arrow loop>,
  label: "The loop"}, {icon: <bottle with skull>, label: "The poison"}, {icon: <small globe>, label: "The sky"}]`.
  Active index per section is in your packet (-1 = all muted). **c1 owns the icon designs**. If you are c2–c4, use
  the same simple shapes: ice block = pale-blue rounded square with a white highlight; flask = round-bottom flask
  outline with blue liquid; loop = two curved arrows forming a circle; poison = brown bottle with a white skull label;
  sky = blue disc with a cream land patch.

## Visual code (identical in all chapters)
- **Heat** = soft red-gold wavy arrows (kit `red`/`gold`), drawn on as they flow (stroke draw-on or dashes moving
  along the path). Heat always flows hot → cold unless WORK pushes it.
- **Cold liquid** = small blue drops (`blue` / `#7FA9C4`). **Vapour** = pale cream puffs. **Hot vapour** = puffs
  tinted red. A liquid boiling = drops turning into puffs that rise.
- Thermometers: a paper tube with a column that moves, red when warm, blue when cold.
- Labels: tracked mono uppercase. Titles: serif with *one italic accent word*. Never subtitles of the narration.
- Themes: kitchen table (warm cream desk) for the fridge scenes (1a, 4b); cream paper for explanations; navy night for
  the desert night (2a) and the poison ending (end of 4b).

## Look rules (from the nutmeg episode; the owner approved them)
- Paper cutout first: things enter as if placed by hand (slide 30–60 px, ±4°, a small settle), `Kit.exit(..., {style:
  "lift"})` when finished, never left dimmed. Dim only what is still context.
- One idea on screen at a time. Motion comes in short bursts on the narrated noun, then the frame holds. Add a new
  visual beat every 6–10 s; no still frame longer than about 8 s unless the cue says hold.
- **Lists land item by item on their words** (the five chapter icons; the four parts of the loop; the three
  poisons). Snapshot each list item's word time and LOOK.
- **Opening beat (c2–c4):** your chapter starts about 0.8 s BEFORE its first word. Use that silence for the
  establishing frame and the date/icon-bar change; the narration then starts on a settled frame.
- **Closing beat (c1–c3):** after your last word there are about 2–3 s left. Let everything settle: no new element,
  label or camera move starts in the last 1.2 s. c4 ends on its calm hold.
- **Section breaks inside your chapter** (about 1.6 s of silence): finish the scene's motion before the gap; start the
  next scene's first move on or just before its first word.

## Truth on screen
Every number, date, name and label on screen must match `script_annotated.md` / `facts.md` exactly. Never invent
figures. Diagrams are schematic: add the kit chip "SCHEMATIC · NOT TO SCALE" on the loop diagram and the yakhchāl
section. Portrait credit lines as given in the script header.

## Sound-effect cues (write `proj/sfx.json`)
A JSON list of `{ "t": <local seconds>, "sfx": <name>, "note": "...", "gain_db"?: n, "dur"?: s }`. Names must come
from `C:\Users\ash\trade-routes\assets\sfx\manifest.json` (for example `paper_slide`, `paper_rustle`, `ui_pop`,
`ui_whoosh_short`, `stamp`, `fridge_hum`, `fridge_door`, `ice_crack`, `boil`, `hiss`, `pump`, `glass_clink`,
`clock_tick`, `quill`, `scroll`). Beds (`fridge_hum`, `boil`, `clock_tick`) take `dur`. Keep it sparse (8–20 cues
per chapter), each on a visible event, quiet under narration (`gain_db` -4 to -8 for most). Keep 0.6 ≤ t ≤ duration −
0.5. The mixer adds a soft low impact on every chapter's first frame itself.

## Quality loop
1. Build.
2. Run `npx hyperframes check --json` and fix every error.
3. Run `npx hyperframes snapshot --at ...` at one time per cue plus your first and last second, LOOK at the frames, and
   compare them with the cues and word times.
4. Fix and repeat, at most 3 rounds.
5. Render, check the frame count, and validate sfx.json (JSON, palette names, time range).

The final message (under 12 lines) gives the path to chapter.mp4, the frame count, the render time, the sfx cue count, and
any cue you could not realise.
