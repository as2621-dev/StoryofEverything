#!/usr/bin/env python3
"""Turn script_annotated.md into script.md for tts_chunks.py (drops [VISUAL ...] and [PAUSE ...] lines),
and write cues.json: every cue with its section, paragraph index and the words it is anchored to.

  python3 tools/strip_script.py episodes/ep-001-run-and-manhattan
"""
import json
import pathlib
import re
import sys

ep = pathlib.Path(sys.argv[1])
src = (ep / "script_annotated.md").read_text(encoding="utf-8")
out, cues = [], []
para_index = -1  # global paragraph index, matching tts_chunks.py's one-paragraph-per-chunk default
for block in re.split(r"^## ", src, flags=re.MULTILINE)[1:]:
    header, _, body = block.partition("\n")
    section = header.split()[0]
    out.append(f"## {header.strip()}\n")
    pending = []
    for chunk in [c.strip() for c in body.split("\n\n") if c.strip()]:
        lines = chunk.splitlines()
        text_lines = []
        for line in lines:
            s = line.strip()
            if s.startswith("[") and s.endswith("]"):
                pending.append(s)
            elif s:
                text_lines.append(s)
        if text_lines:
            para_index += 1
            text = " ".join(text_lines).replace("*", "")
            out.append(text + "\n")
            for cue in pending:
                m = re.match(r'\[VISUAL @ "([^"]+)"\s*:\s*(.*)\]$', cue, re.S)
                kind = "pause" if cue.upper().startswith("[PAUSE") else "visual"
                cues.append({"section": section, "para": para_index, "kind": kind,
                             "anchor": m.group(1).rstrip(".… ") if m else None,
                             "text": (m.group(2) if m else re.sub(r"^\[(VISUAL:?|PAUSE)\s*", "", cue)[:-1]).strip()})
            pending = []
    for cue in pending:  # trailing cues (e.g. a pause after the last paragraph) attach to it
        cues.append({"section": section, "para": para_index, "kind": "pause" if "PAUSE" in cue.upper() else "visual",
                     "anchor": None, "text": cue.strip("[]")})
(ep / "script.md").write_text("\n".join(out), encoding="utf-8")
(ep / "cues.json").write_text(json.dumps(cues, indent=1, ensure_ascii=False), encoding="utf-8")
words = sum(len(l.split()) for l in out if not l.startswith("## "))
print(f"{para_index + 1} paragraphs, {words} words, {len(cues)} cues")
