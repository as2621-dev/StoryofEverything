# Handoff: Story of Everything, ep-001 "The nutmeg" (from the 2026-11-18 session)

Read this first, then continue. Delete it once the new session has taken over.

## Where things stand
- **Episode 1 is DONE as final cut v5 (11:55), waiting for the owner's "approved".**
  - Review page (clips + comment boxes, db notes): https://claude.ai/artifact/BTj3v9hHrBwY2GMLfSLtn7
    (notes collections `notes-v1`…`notes-v5`; v5 page reads `notes-v5`, folds `notes-v4`).
  - Full cut on Drive: https://drive.google.com/file/d/1y1khKbte6m2JUSFzV59ASeMrYQPFuZZi/view
    (local: `C:\Users\ash\trade-routes\episodes\ep-001-run-and-manhattan\out\ep-001-nutmeg-v5-final.mp4`;
    Drive folder `G:\My Drive\Old Routes`).
- The channel was renamed from "Old Routes" to **Story of Everything** (wordmark, outro line).

## Where the work lives
- The trade-routes workspace (tools, kit, episodes) is merged into THIS repo with its history (2026-11-19),
  same layout, so the paths below are relative to the repo root. Media, audio and build outputs are git-ignored
  and exist only on disk in `C:\Users\ash\trade-routes` (renders, narration takes, chapter builds): copy those
  folders here before running the pipeline from this repo, and keep ONE working copy.
  - Episode: `episodes/ep-001-run-and-manhattan/` — `script_annotated.md` (truth: narration + [VISUAL] cues),
    `script.md`, `facts.md`/`facts2.md`, `sections.json` (per section: narrative "chapter"), `cues_timed.json`,
    `audio/` (narration.wav, timeline.json, words.json, mix.wav, onetake/ takes), `build_r5/c1..c8/proj`
    (HyperFrames chapter projects, `plan.json`, packets, time maps, `sfx.json`), `review/`.
  - Tools: `tools/tts_onetake.py` (final one-take narration), `tools/sound_mix.py` (music turns + sfx mix),
    `tools/make_packets.py`, `tools/align_cues.py`, `tools/assemble.py`, `tools/make_review_clips.py`,
    `tools/build_review_page.py`, `tools/mix_intelligibility.py`, `tools/lyria_clip.py`, `tools/fetch_sfx.py`.
  - Kit: `kit/assets/kit/kit.js` (+ `kit/KIT_API.md`); sfx palette `assets/sfx/manifest.json`,
    CC BY credits for the video description in `assets/sfx/CREDITS.md`.
- ep-002 "cold machine" was started by a parallel session; its text files are in `episodes/ep-002-cold-machine/`.

## Pipeline (how a round is made)
script_annotated.md → `tools/strip_script.py` → narration (`tools/tts_onetake.py`, Vertex Gemini TTS, voice
"primary"; final pass = ONE take, never stretched) → `tools/align_cues.py` (local Whisper) →
`tools/make_packets.py <ep> build_rN` + frame plan → 8 builder agents (Opus 5.5, medium), one per chapter, from a
`BUILDER_BRIEF_RN.md` → `tools/sound_mix.py <ep> build_rN` → `tools/assemble.py <ep> build_rN` →
`tools/mix_intelligibility.py` → Drive copy → `tools/make_review_clips.py` + `tools/build_review_page.py` →
publish to the same artifact (≤255 files per publish; ≤512 per version; drop clip rounds older than N−1).

## Owner rules that matter here (all in `~/.claude/CLAUDE.md`)
- Review link = the artifact page; full cut on Drive. Whisper checks are local only (never an API).
- Scripts follow the Storytelling Guide (critic: 34/40; v5 scored 34/40).
- NEW 2026-11-18: final narration is one never-stretched take; structure must be audible (≈3 s chapter breaks,
  1.6 s section breaks, music resolves and restarts per chapter, signposts, list items land on their words);
  review pages keep two clip rounds. Also committed as `reference/final-pass-rules.md` on branch
  `rules/final-narration-pass` in The Stranded Files and Marked in Red (pushed, no PR).

## Next steps
1. Wait for the owner's notes on v5 (read `notes-v5` on the page) or "approved".
2. On "approved": the upload kit — title, description (with the CC BY sound credits from `CREDITS.md`),
   YouTube chapter timestamps from `audio/timeline.json` chapter starts, thumbnail.
3. Decide whether work continues here or in `C:\Users\ash\trade-routes`, and keep only one working copy.
