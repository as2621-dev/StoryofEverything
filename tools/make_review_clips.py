#!/usr/bin/env python3
"""One review clip per visual cue: writes <ep>/review/clips.json for build_review_page.py (--clips).

  python tools/make_review_clips.py episodes/ep-001-run-and-manhattan

Shot ids are <section>-<n> (e.g. 1a-2). Each shot runs from its cue's spoken time to the next cue; its text is the
script words from the cue's anchor to the next cue's anchor (from script.md, so numbers read as written).
"""
import json
import pathlib
import re
import sys

ep = pathlib.Path(sys.argv[1])
BUILD = sys.argv[2] if len(sys.argv) > 2 else "build"  # round 2: build_r2
cues = [c for c in json.loads((ep / "cues_timed.json").read_text(encoding="utf-8")) if c["kind"] == "visual"]
timeline = json.loads((ep / "audio" / "timeline.json").read_text())
plan = json.loads((ep / BUILD / "plan.json").read_text())
total = (plan[-1]["start_frame"] + plan[-1]["frames"]) / 30
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())  # noqa: E731

# script tokens with their paragraph index
toks = [(w, p["index"]) for p in timeline for w in p["text"].split()]


def tok_index(c):
    para_toks = [i for i, t in enumerate(toks) if t[1] == c["para"]]
    if c["anchor"]:
        want = [norm(w) for w in c["anchor"].split() if norm(w)]
        for i in para_toks:
            if [norm(toks[j][0]) for j in range(i, min(i + len(want), len(toks)))] == want:
                return i
    return para_toks[0]


idx = [tok_index(c) for c in cues]
rows, count = [], {}
for k, c in enumerate(cues):
    start = 0.0 if k == 0 else c["t"]
    end = cues[k + 1]["t"] if k + 1 < len(cues) else total
    text = " ".join(t[0] for t in toks[idx[k]:(idx[k + 1] if k + 1 < len(cues) else len(toks))])
    count[c["section"]] = count.get(c["section"], 0) + 1
    rows.append({"id": f"{c['section']}-{count[c['section']]}", "start": round(start, 2), "end": round(end, 2),
                 "text": text, "beat": c["section"], "kind": c["text"][:140]})
(ep / "review").mkdir(exist_ok=True)
(ep / "review" / "clips.json").write_text(json.dumps(rows, indent=1, ensure_ascii=False), encoding="utf-8")
print(len(rows), "shots; shortest", min(r["end"] - r["start"] for r in rows), "s")
