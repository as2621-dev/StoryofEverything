# Final-pass production rules (owner rules 2026-11-18)

Identical copy in every channel repo (The Stranded Files, Marked in Red) and in the owner's global CLAUDE.md;
change all copies at once. Derived from the Story of Everything ep-001 (nutmeg) review rounds.

## Final narration pass: one take, never stretched (owner rule 2026-11-18)

In every repository and every video: once the owner has approved a cut's content (script, shots, order), and before
the publish version, re-record the WHOLE narration in ONE TTS take, then re-time every visual and sound effect to it.
- One call reads the entire script (per narrative chapter only if a single call comes back truncated), same voice,
  same settings. Never per-paragraph chunks for the publish version.
- Never time-stretch narration to hit a words-per-minute target (Rubber Band or any tempo change). Pacing is set only
  by silences between paragraphs; the speech itself is untouched.
- Verify each paragraph on its own with local Whisper (owner audio rule): on a 10+ minute file Whisper repeats words at
  its 30 s window edges, so a long-file transcript reports false doubled words. A real glitch in one paragraph: read
  another full take and swap in only that paragraph.
- Cut paragraphs at real silence in the audio (energy), not at Whisper word gaps: Whisper folds pauses into words.
Why: per-paragraph chunks each stretched 0.80–1.25x made the voice speed up and slow down, and the chopping and
re-recording across rounds left sync errors (ep-001 nutmeg, v4).
How: reference implementation `C:\Users\ash\trade-routes\tools\tts_onetake.py` (`--take N`, `--patch K=N`).

## Structure must be audible: pauses, music turns, signposts, word-level sync (owner rule 2026-11-18)

In every repository and every video, the viewer must hear and see one section end and the next begin:
- **Pauses:** about 3 s of narration silence at every chapter break, about 1.6 s between sections, natural gaps
  (0.45–1.0 s) between paragraphs, longer where the script marks a pause.
- **Music:** at each chapter break the cue fades out and resolves into the silence, one soft low impact marks the
  turn, and a NEW cue starts from its first bar just before the next chapter's first word. Inside a chapter the music
  dips at section changes. Never one continuous bed across chapters.
- **Picture:** each chapter opens about 0.8 s before its first word on a settled frame, and closes on a calm hold
  (no new motion in its last 1.2 s).
- **Script:** wherever time, place or topic jumps without a chapter title, add a short signpost line ("Then it
  cracked.", "Now, back to the kitchen.", a spoken date).
- **Sync:** every list the narration names lands item by item, each visual change on its own word; snapshot each
  list beat before handing a cut over.
Why: in ep-001 v4 the owner said everything "flows at once… it all looks like a blur", with no sense of one section
ending, and a list beat (seedlings shipped to Penang, Ceylon, Singapore) ran out of sync.
How: `C:\Users\ash\trade-routes\tools\sound_mix.py` (chapter turns from `sections.json` "chapter") and
`tools/make_packets.py` (chapter lead-in).

## Review pages keep two versions of clips (owner rule 2026-11-18)

An artifact holds at most 512 files. When publishing round N of a clip review page, remove the clip and poster files
of rounds older than N−1 in the same publish (`files` entries set to null); the notes stay in the db.
