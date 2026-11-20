#!/usr/bin/env python3
"""Split the episode into chapter build packets (one per builder agent).

  python tools/make_packets.py episodes/ep-001-run-and-manhattan

Writes build/<ch>/packet.md: the chapter's exact duration, every paragraph with local start/end, every visual cue
with its local time, and word timings, so a builder can sync animation to the narration without hearing it.
"""
import json
import pathlib
import sys

ep = pathlib.Path(sys.argv[1])
TAIL = 4.0  # seconds held after the last word
BUILD = sys.argv[2] if len(sys.argv) > 2 else "build"  # round 2: build_r2
if BUILD == "build":  # round 1 split
    CHAPTERS = [("c1", ["1a", "1b"]), ("c2", ["2a", "2b"]), ("c3", ["3a", "4a"]), ("c4", ["4b"]),
                ("c5", ["5a", "5b"]), ("c6", ["6a", "6b"]), ("c7", ["7a", "7b"])]
    TABS = {"1a": -1, "1b": -1, "2a": 0, "2b": 1, "3a": 2, "4a": 3, "4b": 3, "5a": 3, "5b": 3, "6a": 4, "6b": 4,
            "7a": 4, "7b": 4}
else:  # round 2: nutmeg-led, 14 sections, reason bar (0 seed, 1 route, 2 company, 3 island, 4 treaty, -1 none)
    CHAPTERS = [("c1", ["1a", "1b"]), ("c2", ["2a", "2b"]), ("c3", ["3a", "3b"]), ("c4", ["4a", "4b"]),
                ("c5", ["5a", "5b"]), ("c6", ["6a", "6b"]), ("c7", ["7a"]), ("c8", ["7b"])]
    TABS = {"1a": -1, "1b": -1, "2a": 0, "2b": 1, "3a": 2, "3b": 2, "4a": 3, "4b": 3, "5a": 3, "5b": 3, "6a": 4,
            "6b": 4, "7a": -1, "7b": -1}
_cfg = ep / "episode.json"  # per-episode split (ep-002 on); without it, the ep-001 constants above apply
if _cfg.exists():
    _c = json.loads(_cfg.read_text(encoding="utf-8"))
    CHAPTERS = [(c["id"], c["sections"]) for c in _c["chapters"]]
    TABS = _c["tabs"]
timeline = json.loads((ep / "audio" / "timeline.json").read_text())
cues = json.loads((ep / "cues_timed.json").read_text(encoding="utf-8"))
words = json.loads((ep / "audio" / "words.json").read_text())
end_all = timeline[-1]["end"] + TAIL
first = {}
for p in timeline:
    first.setdefault(p["section"], p["start"])
# Round 5: each chapter opens LEAD s before its first word (the music reset and chapter card land in the silence
# before the voice); the previous chapter keeps the rest of the break as its closing hold.
LEAD = 0.8 if (BUILD >= "build_r5" or _cfg.exists()) else 0.0
starts = [max(0.0, first[secs[0]] - (LEAD if i else 0)) for i, (_, secs) in enumerate(CHAPTERS)]
plan = []
for i, (cid, secs) in enumerate(CHAPTERS):
    t0 = starts[i]
    t1 = starts[i + 1] if i + 1 < len(CHAPTERS) else end_all
    paras = [p for p in timeline if p["section"] in secs]
    lines = [f"# Chapter {cid}: sections {', '.join(secs)}", "",
             f"- Global start in the film: {t0:.2f} s. Chapter DURATION: **{t1 - t0:.2f} s** (root data-duration).",
             f"- All times below are LOCAL to this chapter (0 = chapter start).",
             f"- Chapter tab active per section: " + ", ".join(f"{s}→{TABS[s]}" for s in secs) + " (-1 = no tab highlighted).",
             ""]
    for p in paras:
        lines.append(f"## Paragraph {p['index']} [{p['section']}] {p['start'] - t0:.2f}–{p['end'] - t0:.2f} s")
        lines.append(p["text"])
        for c in cues:
            if c["para"] == p["index"]:
                tag = "PAUSE (hold, let it breathe)" if c["kind"] == "pause" else "VISUAL"
                lines.append(f"- **{c['t'] - t0:.2f} s {tag}:** {c['text']}")
        ws = [w for w in words if p["start"] - 0.3 <= w["s"] <= p["end"] + 0.3]
        lines.append("  - words: " + " ".join(f"{w['w']}@{w['s'] - t0:.1f}" for w in ws))
        lines.append("")
    d = ep / BUILD / cid
    d.mkdir(parents=True, exist_ok=True)
    (d / "packet.md").write_text("\n".join(lines), encoding="utf-8")
    plan.append({"id": cid, "start": round(t0, 3), "duration": round(t1 - t0, 3), "sections": secs})
    if _cfg.exists():  # frame counts for the builders and assemble.py (ep-001 added these by hand)
        plan[-1]["start_frame"] = round(t0 * 30)
        plan[-1]["frames"] = round(t1 * 30) - round(t0 * 30)
        (d / "packet.md").write_text((d / "packet.md").read_text(encoding="utf-8").replace(
            f"Chapter DURATION: **{t1 - t0:.2f} s** (root data-duration).",
            f"Chapter DURATION: **{t1 - t0:.2f} s** → EXACTLY **{plan[-1]['frames']} frames**; root data-duration = "
            f"**{(plan[-1]['frames'] - 0.5) / 30:.4f}** ((frames-0.5)/30)."), encoding="utf-8")
(ep / BUILD / "plan.json").write_text(json.dumps(plan, indent=1))
for p in plan:
    print(p)
