# Handoff: Story of Everything, ep-002 "The Machine That Doesn't Make Cold" (from the 2026-11-19 session)

Read this first, then continue from this repo (`C:\Users\ash\StoryofEverything`). It is now the ONE working copy
for ep-002: the text is in git, and the git-ignored media (narration, renders, chapter builds, review clips) was
copied here from `C:\Users\ash\trade-routes`. ep-001's media still lives only in `trade-routes` (see
`HANDOFF-ep001-nutmeg.md`). Delete this file once a new session has taken over.

## What the owner asked for
A video on the evolution of the refrigerator, made the same way as the nutmeg episode: how it works, its mechanism
animated, the basic physics, who worked on it and how it came about. First a demand check, then a **5-minute sample
"to see what is possible"**. The full film is planned at **about 20 minutes**.

## Demand check (vidIQ, 2026-11-19)
- "how does a refrigerator work" about 17.4k searches/month (competition 46); "history of refrigeration" about 16.9k
  (competition **21**); "history of refrigerator/fridge" about 9–10k (competition 21–23). History is the open lane.
- Main competitor: **Veritasium, "Why Cold Drinks Were Deadly Before 1914"** (Feb 2026, 12.3M views, 30 min):
  the US ice trade (Tudor), the first ice machines, why the back of a fridge is hot. Do NOT retell its spine.
- Signal: a 2-minute yakhchāl (Persian ice-house) Short got 4.1M views on a 37k channel (320× its usual).
- Our angle: ancient cold (yakhchāl) → the physics as one idea (a fridge moves heat; heat only flows downhill unless
  work pushes it) → Cullen, Perkins → the poison refrigerants → Midgley/Freon → the ozone hole. These are the parts
  Veritasium skips.

## Where things stand
- **5-minute sample v1 is DONE (5:10), waiting for the owner's notes.**
  - Review page (28 clips, script line under each, comment box, notes in the db collection `notes-v1`):
    https://claude.ai/artifact/4RpktEBaDxgD7WyBzwaMTp
  - Full cut on Drive: https://drive.google.com/file/d/1d8qVx7lLSnN8xC5m8jWYSH_p1B-QOITp/view
    (Drive folder `G:\My Drive\Old Routes`, file `ep-002-cold-machine-sample-v1.mp4`; local
    `episodes/ep-002-cold-machine/out/ep-002-cold-machine.mp4` and `_720p.mp4`).
- The sample is the film's first three of five chapters: **THE ICE, THE TRICK, THE LOOP** (+ cold open). Still to
  write: **THE POISON** (ammonia/SO2/methyl chloride, the 1929 Chicago methyl-chloride deaths, Einstein–Szilárd) and
  **THE SKY** (Midgley, Freon/CFC-12, candle demo 1930, ozone hole 1974/1985, Montreal Protocol, today's R600a).

## Script and checks
- Truth: `episodes/ep-002-cold-machine/script_annotated.md` (narration + [VISUAL] cues; 734 words), stripped to
  `script.md`. Facts: `facts.md` rows F1–F48 (researched by an agent with sources; F45–F48 added after the critic).
- Critic (`critique.md`): Gate A (facts) passed after two rounds; Gate B 30/32 on the 16 items a sample can score.
  Items N/A for the sample but REQUIRED in the full film: answer the sky question after 75%, Freon as the false-safety
  "hope spot" with Midgley's candle before the drop, one rising number tracked through chapters 3–5, and a closing
  bookend on the warm back of the fridge.
- Red flags kept out (facts.md end): "yakhchāls from 400 BC" (an estimate; surviving domes are 1500s–1800s); the
  egg-white/goat-hair sārooj recipe (undocumented); yakhchāls as food stores (they stored ice to sell); Cullen's
  "public demonstration" (a lab trial, paper dated 1 May 1755, printed 1756); Perkins's machine selling (it never did;
  Harrison in the 1850s was the first commercial success); the 1929 Cleveland Clinic fire (X-ray film, not a fridge);
  the Berlin-family fridge story behind Einstein–Szilárd (only Szilárd's recollection via Dannen 1997: hedge it).

## Production (what was run)
- `episode.json` (new, per episode): chapter split c1 [1a,1b], c2 [2a,2b], c3 [3a,3b], c4 [4a,4b]; reason-bar tab per
  section; music mood per section. `tools/make_packets.py` and `tools/sound_mix.py` read it when present (and
  `make_packets` then writes frame counts and the 0.8 s chapter lead-in); without it they behave as for ep-001.
- Narration: `tools/tts_onetake.py` one take (Vertex Gemini TTS, voice "primary"), take 2 patched in for paragraph 13
  only (take 1 ad-libbed a sentence). Local Whisper verify; one remaining difference: paragraph 17 says "he had to keep
  pouring" where the script says "you had to" (left: both true). Narration 5:07.
- `tools/align_cues.py` → `tools/make_packets.py episodes/ep-002-cold-machine build` → 4 builder agents (Opus 5.5,
  medium) from `build/BUILDER_BRIEF.md` → chapters `build/c1..c4/proj` (HyperFrames + kit; frames 1653, 2733, 2492,
  2434 = 9312 = 5:10.4). The chapter source (index.html, compositions, chapter assets, sfx.json, packets) is
  force-added to git; kit copies and renders are not.
- `tools/sound_mix.py ... build` (music reused from ep-001's Lyria cues, copied to `audio/music_r3/`; 81 sfx) →
  `tools/assemble.py` → `tools/mix_intelligibility.py` (29/29 paragraphs clear) → Drive → `tools/make_review_clips.py`
  + `tools/build_review_page.py ... --tag v1 --collection notes-v1` → published from a scratchpad copy of `review/`.
- New sfx in `assets/sfx/manifest.json`: fridge_hum, fridge_door, ice_crack, boil, hiss, pump, glass_clink.
- Portraits: Cullen = Wellcome Collection, CC BY 4.0 (credit on screen); Perkins = public domain
  (`episodes/ep-002-cold-machine/assets/portraits/CREDITS.txt`).

## Known small issues to fix in round 2
1. c3 quote card puts "*crust of ice*" in an italic accent: emphasis not in Cullen's text. Make it plain.
2. c2's "loop" icon in the reason bar is a plain ring; c1/c3/c4 use the two-arrow loop (`build/c1/proj/assets/c1/c1.js`,
   `C1.ICONS`). Make c2 match.
3. The review page template references `dictation` (the mic button) but the publish declared only `db` + `user`, so
   the mic does not work. Ask the owner before declaring it.
4. Music is reused from ep-001. Fresh Lyria cues are optional (small cost).

## Next steps
1. Read the owner's notes: `ArtifactData list` on the review page URL, collection `notes-v1`. For each note set
   `status: "done"`, `reply` (one short line) and `next` (new shot ids). Build round 2 with `--collection notes-v2
   --prev notes-v1`, republish to the SAME artifact URL (from a scratchpad copy), and keep only two clip rounds.
2. Once the sample is approved: write chapters 4–5 (THE POISON, THE SKY) to about 20 minutes with the Storytelling
   Guide (critic 34/40, no zero on items 1, 2, 5, 7, 11, 18), extend `facts.md`, then the final one-take narration of
   the WHOLE film and rebuild per `reference/final-pass-rules.md`.
3. ep-001 still waits for the owner's "approved" (see `HANDOFF-ep001-nutmeg.md`).
4. `main` on GitHub is still only the template's initial commit; this work lives on the branch `import/trade-routes`.
   Merge it (or open a PR) when the owner says so.
