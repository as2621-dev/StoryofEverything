# Critique: ep-001 round 2, The Seed That Emptied an Island Chain

Critic: independent (did not write the script). Checked 2026-11-17 against `reference/storytelling-guide.md`
(Part 10 gates A and B, Parts 5, 6, 9), `facts.md` + `facts2.md`, `REVISION_BRIEF_R2.md` and the 44 raw owner notes in
`notes_r1/notes-v1/`. The writer's self-score in `notes.md` was not used. Round 1's critique stays in `r1/critique.md`.
The draft as submitted is saved as `script_annotated.r2draft.md`; the required fixes are applied in
`script_annotated.md` (cue lines diffed: identical).

## Verdict

- **As submitted (r2draft): FAIL on Gate A** (two own-arithmetic comparisons stated differently from the fact base,
  one claim not in the source, one unsourced claim). Gate B **34/40**, no zero on items 1, 2, 5, 7, 11, 18.
- **After the four required fixes (applied): PASS.** Gate A passes; Gate B **34/40** (exactly the threshold); Gate C:
  all 44 owner notes satisfied (two with a sourced, flagged deviation from the owner's literal wording).
- **Words:** 1,592 → **1,600** narration words (inside the brief's 1,500–1,600). Runtime about 12:20 at round 1's
  measured rate, about 20 s over the 11–12 min target (writer's flag stands).

## Gate A: fact check

Arithmetic recomputed in Python (`datetime` for dates):

| Comparison in the script | Inputs (fact row) | Result | Verdict |
|---|---|---|---|
| 60 guilders bought "about fourteen kilos" of nutmeg, 1626 | 2.05 fl per Amsterdam lb, 1 lb = 0.494 kg (R12.1) | 60 / 2.05 × 0.494 = **14.46 kg** | Pass |
| Run's harvest "about ten seconds" of Manhattan | $1,006.7 bn a year (R14.3); 50 t × $4.20–7.20 (R14.1–2) | $31,922 a second → **6.6 to 11.3 s** | Pass (hedged "about"; 50 t is single-source, on screen only) |
| A kilo "nearly a week's pay" for an Amsterdam labourer, 1626 | 6.9 g silver a day ÷ 10.16 g per fl = 0.679 fl a day (R12.3) | 4.15 fl/kg ÷ 0.679 = **6.1 working days**: a full six-day week, not "nearly" | **Fix F2** → "about a week's pay" (R12.4's wording) |
| Farmer's kilo "about what an American earns in an hour" | $4.20–7.20/kg vs the $7.25/h **minimum** wage (R12.4) | 0.58 to 0.99 h of *minimum* wage. "An American" (typical wage several times the minimum) overstates it | **Fix F3** → "less than an hour's pay at the American minimum wage" (matches the on-screen card) |
| 1609 Amsterdam price "forty-nine times" Banda | 1.27 / 0.026 (R12.1–2) | **48.8×** | Pass |
| Beaver "close to a thousand times" the island | 50,000–60,000 fl / 60 (6.5, contested) | **833× to 1,000×** | Pass ("one modern estimate") |
| "More than a hundred times"; $2 coffee → $200 | Jordan 122× (2.13), 9.4 | 100× = $200 | Pass (attributed) |
| "≈ 50 : 1" (screen) | (1,655 + 286) / 39 (5.4, 4.6) | 49.8 | Pass |
| "≈ 1,400 days · nearly four years" (screen) | 14 Dec 1616 → 20/26 Oct 1620 | 1,406 to 1,413 days | Pass |
| "Four hundred years ago" | 1621 → 2026 | 405 years | Pass |
| "Fifteen thousand kilometers"; "about fourteen thousand" | 9.9 (15,350); 2.9 (14,400) | | Pass |
| "Two years into a new war" (June 1667) | 7.1 (war 1665–67) | about 27 months | Pass |
| "The monopoly lasted about a hundred years" | 1667 → early 1770s (8.2) | about 103 years | Pass (interpretive; "the gap was small" follows) |
| "That same week" (Coen's letter) | death 20 or 26 Oct; letter 26 Oct (R6.4, 5.2) | 0 to 6 days | Pass |
| "Of every fifteen, one remained" | 1,000 / 15,000 (5.8–5.9) | 1 in 15 | Pass |

Claims traced (every narration sentence was checked; failures and notable passes are listed):

| # | Claim (section) | Trace | Verdict |
|---|---|---|---|
| 1 | "Britain, **the rising power at sea**" (7a) | R10.4: not researched. Web check (now facts2 **R10.5**): the Royal Navy was already the world's largest by the early-to-mid 1700s and "the largest and most experienced in the world" in 1775. By 1796 it was not rising; it was dominant | **Fix F1** → "by then the strongest power at sea" (sourced; keeps the owner's "super power" sense) |
| 2 | "Dutch officials sailed out to check that **nobody had replanted**" (5b) | R7.2: "to check no trade had restarted"; 5.14: inspected "for English settlers". Replanting is in neither source | **Fix F4** → "to check that no one had come back to trade" |
| 3 | Pinch on eggnog, "nothing happens" (1a) | R1.1, R1.4 | Pass |
| 4 | "It emptied an entire people" (1a) | Owner's chosen framing (brief §1), qualified at once by "Of every fifteen islanders, one remained" | Pass (framing, not a count) |
| 5 | "The story goes… They chose Run" → "The truth is stranger" → "not islands, but claims" (1a, 1b, 6b) | Red flag 1, 7.4, 7.5 | Pass: the myth is labelled a story and corrected at 80% |
| 6 | Manhattan ≈ a trillion dollars a year (1b) | R14.3 | Pass |
| 7 | Moluccas; Ternate and Tidore grew cloves; Banda volcanic, Run at the western end (2a) | 1.2, 1.4, 1.9–1.10, 2.3, R2.4 | Pass |
| 8 | Boats to Malacca, >3,000 km; on to India, Arabia, Egypt, Venice (2b) | 2.4–2.9. Round 1's conflation is gone: no "thousands of years", and the cue dates it 1400s | Pass |
| 9 | Portuguese 1512; fort attacked; no king, orang kaya councils; bought second-hand in Malacca (3a) | 3.2, R2.1–R2.3, R2.5 (contested secondary summary, used as its suggested framing) | Pass |
| 10 | VOC 1602, its powers, "own the relay" (3a) | 3.5, 3.6; the plan is interpretive | Pass |
| 11 | 1609 ambush, 46 Dutch dead; forts on the central islands; Ai, English paying more; 1616 Ai taken, ~400 drowned (3b) | 3.10, R3.7, R3.2, 5.1 | Pass |
| 12 | "Why hadn't the Dutch taken Run? No record says… next on the list" (3b) | R3.7, its suggested wording, after admitting the gap | Pass |
| 13 | EIC a string of posts, some years a single ship; Run's leaders offered; Bantam sent the Swan and Defence (4a) | R4.2 (1608, 1612: one ship), R4.5, R3.4, R3.6. "So when… sent" is a little more causal than R3.6's fair wording, but R3.6 calls it a mutual deal | Pass (see O4) |
| 14 | "No portrait of him survives" (4a) | R8.3 (none found; the sheet advises this label) | Pass |
| 15 | Chiefs aboard; tree, clod of earth, goat; flag; thirty guns; Puloroon quote and gloss (4a) | R3.5, 4.4 (verbatim, 13 words), 4.14 | Pass |
| 16 | Three Dutch ships Jan 1617; Swan after 90 min; nine mutineers took the Defence; sago from Seram; two relief ships taken, a third vanished; 1619 peace, a third of the spices; no fleet (4b) | R5.3–R5.5, R5.7, R5.8, R5.10, R5.12, R5.14 | Pass |
| 17 | £100 a year, recommended for promotion; "a pay rise, not a warship"; never heard of it (4b) | 4.11, R5.14, facts beat 3 | Pass ("never heard" is a beat-level inference, as in round 1) |
| 18 | Late October to Lonthor to accept its surrender; caught on the way back; shot in the chest, over the side (4b) | R6.1 (sworn depositions), R6.3, R6.4. The spy and night ambush (R6.2, Milton only) are not claimed | Pass |
| 19 | Coen's quote and motto; 19 ships, 1,655, 286; Lonthor by March 1621; April torture; May, dozens beheaded (5a) | 5.2–5.7 ("dozens": red flag 10 respected) | Pass |
| 20 | 2,500 dead (Coen's count); hundreds shipped to Batavia or fled east; 15,000 → 1,000; 68 plantations (5a) | 5.7–5.10, 5.12, R13.2 | Pass |
| 21 | Run: men killed or enslaved, women and children sent away, every tree cut; "on paper, Run belonged to the king of England"; English ships kept coming back (5b) | 5.14, R7.1, R7.2, R6.5 | Pass (see O5 on the order of cause and effect) |
| 22 | Schaghen letter, 60 guilders' worth of trade goods; 7,246 beaver; the letter gives no value (6a) | 6.4, 6.5, R9.1. No $24, no beads | Pass |
| 23 | 1664 surrender, no war declared, New York; the Medway, June 1667; Breda; the Dutch kept Run and Suriname, England New Netherland; claims dropped (6a, 6b) | 6.8, 6.9, 7.1–7.6 | Pass |
| 24 | France after 1763 wanted into the nutmeg business; Poivre ran French Mauritius; smuggled nutmeg growing by the early 1770s (7a) | R11.2, R11.3, 8.1–8.3. France's earlier trade (R11.6, unverified) is not claimed | Pass |
| 25 | 1796 French Revolutionary Wars, 1810 Napoleonic Wars; seedlings in soil to Penang, Ceylon, Singapore; on to Grenada; one of the biggest producers; the 1974 flag (7a) | R10.1, R10.2, 8.5–8.7, 8.9, 8.10, R16.4 ("one of the biggest", not "second") | Pass |
| 26 | The language in two Kei villages founded by survivors; Run's trees grown back (7b) | R13.2, R13.3 (distance unverified, rightly omitted), 8.13 | Pass |

Unverified list and red flags: none asserted (no Amsterdam bonfires, no spy ambush, no exact day for Courthope's
death, no "ten times the capital", no 45,050 guilders, no Kei distance, no $24 or beads, no 60,000%, no plague cure, no
Puloway title, no Christmas Day, no 1,540 days, no 13 km², no "44"). The 1619 Accord's exact day and when Run heard of
it are not claimed. Red coats stay visual only.

**Gate A result: r2draft FAIL (rows 1, 2 and arithmetic F2, F3). After fixes: PASS.**

## Gate B: the 20 items (scored on the fixed script; the fixes change no score)

| # | Item | Score | Evidence |
|---|---|:-:|---|
| 1 | Cold open | 1 | No throat-clearing: an object in the viewer's hand and the anomaly ("men killed for this seed") inside 10 s. But the date is approximate ("four hundred years ago"), and the first dated scene with humans in motion (Breda, 1667) arrives at about 0:25. |
| 2 | Whole-video question by 1:30 | 2 | Explicit at word 148 (about 1:00): "So why would anyone kill for a seed? How did it end up on a flag, and tangled up with Manhattan?" Answered at 80% (claims), 82% (every nutmeg from land they held) and 91% (the flag). |
| 3 | Cast limit | 2 | Named in narration: Courthope (5 paragraphs), Coen (2), Poivre (1). Everyone else by role. |
| 4 | Explain the machine early | 2 | Tree clock at 2a (≈1:50) pays at 5b (≈7:20); "what you have, you hold" at 1b (≈1:00) pays at 6b (≈8:40). |
| 5 | State the plan before it fails | 2 | VOC "own the relay" before the English slip into Run; Courthope's "hold on until help came" before "No fleet came for Run"; Poivre's bold idea before "the gap was small". |
| 6 | Overlapping chapter questions | 1 | Every reason boundary hooks forward ("would get rich", "The English got there first", "The English claim was not", "lasted about a hundred years"). Two subsection ends still land flat: 3a on the ×49 figure and 5a on the 68 plantations (the same 5a weakness as round 1). |
| 7 | Scene-question cadence | 2 | No 300-word stretch in 3a–6b without an open question (map below). |
| 8 | Concrete object every 150 words | 2 | Mug and grater, fruit and net, boats, fort, coins, goat and clod, letter, guns, sago, ledger, small boat, trees, cattle, beaver skins, sack, flag. |
| 9 | False safety and hope spot | 2 | Pedestal: the surrender ceremony with thirty guns and 39 men holding; hope spot: the pay rise, then "But he never heard about that promotion." |
| 10 | Track one rising number | 2 | The price of nutmeg across four beats: ×100 on the relay (2b), ×49 in 1609 (3a), 14 kg for Manhattan's 60 guilders (6a), a week's pay then against under an hour now (7b). Also "one in fifteen" in 1a, 5a, 7b and the on-screen siege day counter. |
| 11 | Channel rule | 1 | This channel has no item-11 rules yet (see conflicts). In the spirit of the format: the popular theory (the swap) is set up and replaced. But Suriname ("the prizes: Run and Suriname") is still never weighed against the monopoly answer (round 1's O2, still open). |
| 12 | Long-long-short rhythm | 1 | 28 paragraph-ending punches of 2–7 words (one every 57 words); 34 of 157 sentences are 15–28 words (up from 28 of 166). One run of four identical lengths: "The seed. The route. The company. The island." (a deliberate list, but a 2 needs zero violations). |
| 13 | Cause-and-effect links | 1 | No "and then", "next" or "furthermore"; hinges are So / But / Then. But the force count (nineteen ships, 1,655 soldiers, 286 mercenaries) is a three-measurement run, and round 1's spoken translation ("fifty for every one") is now on screen only. |
| 14 | Human-scale numbers | 1 | Most are translated (ten seconds of Manhattan, Central Park, the coffee, one in fifteen, one sack, a week's pay, an hour's wage). Left raw: £100 a year, 15,000 and 14,000 km, the force count, 2,500 dead. |
| 15 | No label adverbs | 2 | Zero hits; "unfortunately" 0, "however" 0. |
| 16 | No hedging or vague quantifiers | 2 | "must have" 0, "imagine" 0, vague quantifiers 0. Gaps are stated openly. |
| 17 | Short quotes, gaps admitted | 2 | Three quotes (13, 12, 6 words), each sourced on screen; "No record says", "The letter gives no value", "Coen's own count", "one modern estimate". |
| 18 | Tone | 2 | 1621 is told with restraint (two pauses, figures fall silently). The owner-ordered comment prompt and subscribe line are **not** scored (brief §3). Nothing else breaks the frame. |
| 19 | Pauses and visual grounding | 2 | 10 pause markers (nine of 2 s, one of 3 s), each after a reveal; every scene opens on named objects. |
| 20 | Ending | 2 | Ledger (Courthope, every tree, 15,000 → 1,000); synthesis (the language in exile, the trees grown back, the open "who got the better deal"); callback (Run over Central Park, the eggnog). The owner-ordered end lines are not scored (brief §3). |

**Total (summed in Python): 34/40.** Items 1, 2, 5, 7, 11, 18 = 1, 2, 2, 2, 1, 2: no zero. **Gate B passes, at the
threshold.** The cheapest gains are optional O1–O3 below (items 11, 13, 6).

## Gate C: owner notes (44)

All 44 notes were read in the raw JSON and checked against the script or a builder cue, as the brief maps them.

| Note | Satisfied by | Status |
|---|---|---|
| 1a-1 | Pennants on top, distinct English and Dutch figures, labels in flag colours, DATE top-left and plain, logo bottom-right (1a cue, kit grammar) | Met (cue) |
| 1a-2 | Envoys LIFT off; LIFT used throughout | Met (cue) |
| 1a-3 | "was the island of Run" | Met |
| 1a-4 | Run travels on top of Manhattan (1a, repeated last in 7b) | Met (cue) |
| 1a-5 | "They chose Run." | Met |
| 1b-1 | Walk removed; GDP against the harvest | Met |
| 1b-2 | "The story goes…" / "The truth is stranger"; no "They didn't" | Met |
| 1b-6 | "five reasons", "Reason one…five" | Met |
| 2a-1 | "Look at these island groups"; groups drawn and labelled | Met |
| 2a-2 | "four hours on foot" removed | Met |
| 2b-4 | `Kit.priceClimb` along the relay | Met (cue) |
| 3a-1 | Fort attacked, no king, councils, second-hand in Malacca | Met |
| 3a-2, 3a-3 | `Kit.vocLogo` + `vocReveal`, flags waving behind | Met (cue) |
| 3a-5 | "Why hadn't the Dutch taken Run…"; the offer, Bantam's two ships, the ceremony | Met |
| 4a-1 | REASON icon bar with 1–2-word labels; why two ships (posts, single ships, the base on Java) | Met |
| 4a-2 | Swimmers crossing to Run (3b) | Met (cue) |
| 4a-3 | Red-coated `englishman` (visual only), `bandanese` / `orangKaya` figures | Met (cue; history conflict flagged) |
| 4a-4 | `Kit.scrollPaper`; "Puloroon was how the English wrote Run." | Met |
| 4a-5 | Split frame: English flag against the VOC logo with flags | Met (cue) |
| 4b-2 | Day counter, ring of ships, sago canoes, captured relief ships | Met (cue) |
| 4b-3 | How they held (plan, sago, blockade) and why no help came (captures, the 1619 peace, pay not a warship) | Met |
| 4b-4 | "But he never heard about that promotion." + Lonthor, caught, shot | Met |
| 4b-5 | "shot in the chest" (paraphrase, no quote) | Met |
| 4b-7 | "That same week, the head of the VOC in Asia wrote down his plan" | Met |
| 5a-1 | Coen: Waben portrait in B&W. Courthope: no portrait exists (R8.3), so the mannequin and "No portrait of him survives" | Met as far as possible (the Courthope half cannot be met) |
| 5a-4 | Orang kaya mannequin portrait, better animation | Met (cue) |
| 5a-5 | Figures turn red and fall, then lift | Met (cue) |
| 5b-2, 5b-3 | Why cut the trees; "Couldn't they just hold Run?"; "Remember, a nutmeg tree takes seven to nine years" | Met ("seven to nine", not the owner's "seven": facts 1.13 and the brief's own wording) |
| 6a-3 | Lenape line removed | Met |
| 6a-4 | "sixty guilders' worth of trade goods"; one trip's cargo (7,246 skins, ≈1,000×) | Met |
| 6a-5 | "Three years later…" removed | Met |
| 6b-2 | Owner's wording, almost verbatim | Met |
| 6b-3 | 1654 line removed | Met |
| 6b-4 | Claim arrows (red to Run, blue to Manhattan) | Met (cue) |
| 6b-6 | Verdict shot removed; the reason closes on "not islands, but claims" | Met |
| 7a-3 | France wanted in; Poivre portrait, French flag waving; "a bold idea" to smuggle the seeds | Met ("out of the Dutch spice islands", not "out of Banda": facts 8.1 and R11.4 put the smuggling in the Moluccas generally. Justified deviation) |
| 7a-4 | Britain as the sea power; the wars named (1796, 1810) | Met (wording now sourced, F1) |
| 7a-5 | Owner's wording verbatim | Met |
| 7b-1 | Sugar bag and coffees removed; price then against now | Met |
| 7b-2 | 15,000 → 1,000 | Met |
| 7b-3 | Worth it? Better deal? Comment | Met |
| 7b-4 | Central Park narration line removed; subscribe line last | Met |

**Unmet notes: none.** Partial by necessity: 5a-1 (no Courthope portrait exists). Deviations kept for accuracy, to
show the owner: 5b-3 ("seven to nine years") and 7a-3 ("the Dutch spice islands").

## REQUIRED fixes (applied; the draft is kept as `script_annotated.r2draft.md`)

1. **F1 (7a).** `Britain, the rising power at sea, took` → `Britain, by then the strongest power at sea, took`.
   Sourced in new facts2 row R10.5 (the Royal Navy was already the world's largest before 1796).
2. **F2 (7b).** `cost an Amsterdam labourer nearly a week's pay.` → `cost an Amsterdam labourer about a week's pay.`
   (6.1 working days, R12.3; R12.4's wording.)
3. **F3 (7b).** `gets about what an American earns in an hour.` → `gets less than an hour's pay at the American minimum
   wage.` (R12.4 is the minimum wage; matches the cue card.)
4. **F4 (5b).** `to check that nobody had replanted.` → `to check that no one had come back to trade.` (R7.2, 5.14.)

Cue lines unchanged (diffed). Narration 1,592 → 1,600 words.

## OPTIONAL improvements (not applied)

1. **O1, item 11.** Weigh Suriname once after the Breda line, e.g. `Suriname explains why the Dutch let Manhattan go.
   It doesn't explain Run.` (open since round 1).
2. **O2, items 13/14.** Bring back round 1's translation after the force count: `…two hundred and eighty-six Japanese
   mercenaries. Fifty men for every one Courthope had.`
3. **O3, item 6.** Hook 5a's end forward: after the plantations, `One island was left.` (5b opens "On Run").
4. **O4, Gate A nuance (4a).** To match R3.6 exactly: `…offered their island to England, and the English base on Java
   sent what it had nearby to take it before the Dutch could: two ships…` (adds 7 words; only if length allows).
5. **O5 (5b logic).** "English ships kept coming back" (1622, 1638) happened after the felling but is offered as its
   reason. `…and English ships could come back.` keeps the logic clean (R7.1 gives the fear, not the visits, as the
   reason).
6. **O6 (2b against 3a).** ×100 on the relay, then ×49 in 1609 under the VOC, can sound like a contradiction. A cue tag
   "DIFFERENT SOURCES, DIFFERENT COST BASES" (facts2 R12.2 caveat) or one spoken clause would settle it.
7. **O7, runtime.** About 20 s over 12:00. The writer's cut candidates (the 68-plantations line, "second-hand in
   Malacca") both carry beats now (item 8, note 3a-1). Prefer shorter paragraph pauses outside 1621.

## Conflicts (Rule 7: flagged, not blended)

1. **The owner's end lines against the Guide.** The 7b comment prompt and the subscribe line break Part 10 item 20
   and Part 6 step 4 (the clean cut), and touch item 18 ("zero… self-promos"), a no-zero item. The owner ordered
   them, so they stay and were not scored down. **Cleanup: the Guide should state whether this channel ends with a
   call to action** (an owner exception in Part 11, or a channel section).
2. **Part 10 and Part 4 are written for 20–30-minute Stranded Files and Marked in Red scripts.** This is a 12-minute
   trade-routes episode with no channel rules of its own, so item 11 is scored in spirit (as in round 1). Cleanup: give
   the channel its own item-11 rules.
3. **Red coats (4a-3):** visual only, never in narration; R15.4 says they are anachronistic for 1616. Owner's call.

## Counts (Python, narration paragraphs only)

| Count | r2draft | fixed |
|---|---|---|
| Narration words | 1,592 | **1,600** |
| Paragraphs / sentences | 77 / 157 | 77 / 157 |
| Mean / longest sentence | 10.1 / 30 words | 10.2 / 30 |
| Sentences of 2–7 words / 15–28 words | 61 / 34 | 61 / 34 |
| Paragraph-ending punches (2–7 words) | 28 | 28 |
| Runs of 4 identical lengths | 1 (the reasons list) | 1 |
| Banned adverbs, "must have", "imagine", vague quantifiers, "and then", "furthermore" | 0 | 0 |
| Named people (narration) | 3 | 3 |
| Pause markers | 10 | 10 |
| "you" / "your" | 5 / 3 (incl. "what you have, you hold" ×2) | 5 / 3 |
| Digits, parentheses | 0, 0 | 0, 0 |
| Speech at 148 wpm | 10:45 | 10:49 (about 12:20 with pauses, at round 1's measured rate) |

## Curiosity map (148 wpm, by word position)

| Minute | Words | Open question |
|---|---|---|
| 0:00–1:00 | 0–148 | How does a kitchen spice empty a people? Why pick Run over Manhattan? What is "stranger" than the story? |
| 1:00–2:00 | 148–296 | Why kill for a seed; how did it reach a flag and Manhattan? Why remember the Latin rule and the seven to nine years? |
| 2:00–3:00 | 296–444 | How does the price climb a hundredfold? Who sails straight to Banda? |
| 3:00–4:00 | 444–592 | Why did Portugal fail? Can a company own the relay? Why hadn't the Dutch taken Run? |
| 4:00–5:00 | 592–740 | Why only two ships? Can 39 men hold Run? |
| 5:00–6:00 | 740–888 | With no ships, will help come? What happens at Lonthor? What is Coen's plan? |
| 6:00–7:00 | 888–1,036 | How many survive 1621? What happens to Run? |
| 7:00–8:00 | 1,036–1,184 | Why destroy the trees? Where does the English claim lead? What did Manhattan cost against one cargo? |
| 8:00–9:00 | 1,184–1,332 | Who keeps what at Breda, and why let Manhattan go? How long does the fence hold? |
| 9:00–10:00 | 1,332–1,480 | Can anyone break the monopoly; where does the seed go? |
| 10:00–10:49 | 1,480–1,600 | What did it cost then and now; who got the better deal? |

No empty minute. Weakest: the end of 5a (the plantations), carried only by the whole-video question until "On Run".

Sources for R10.5: [American Battlefield Trust](https://www.battlefields.org/learn/articles/royal-navy-during-american-revolution),
[University of Wisconsin LS261, ch. 4.2](https://wisc.pb.unizin.org/ls261/chapter/ch-4-2-the-british-royal-navy/),
[Britannica: Royal Navy](https://www.britannica.com/topic/Royal-Navy).
