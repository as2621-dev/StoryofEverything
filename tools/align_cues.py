#!/usr/bin/env python3
"""Word-level timing for the narration and exact times for every visual cue (local Whisper on the GPU, per owner rule).

  uvx --with numpy --with faster-whisper --with nvidia-cublas-cu12 --with "nvidia-cudnn-cu12>=9,<10" \
      python tools/align_cues.py episodes/ep-001-run-and-manhattan

Reads audio/narration.wav, audio/timeline.json (paragraph start/end from tts_chunks.py) and cues.json.
Writes audio/words.json (every word with start/end) and cues_timed.json (each cue with t, and the paragraph span).
A cue anchored to words ("@ first words") gets the time those words are spoken inside its paragraph; an unanchored
cue gets its paragraph's start. Pauses get the paragraph's end.
"""
import difflib
import glob
import json
import os
import pathlib
import re
import site
import subprocess
import sys

import numpy as np

ep = pathlib.Path(sys.argv[1])
for sp in site.getsitepackages():
    for d in glob.glob(os.path.join(sp, "nvidia", "*", "bin")):
        os.add_dll_directory(d)
        os.environ["PATH"] = d + os.pathsep + os.environ["PATH"]
from faster_whisper import WhisperModel  # noqa: E402

timeline = json.loads((ep / "audio" / "timeline.json").read_text())
cues = json.loads((ep / "cues.json").read_text(encoding="utf-8"))
words_path = ep / "audio" / "words.json"
if words_path.exists():
    words = json.loads(words_path.read_text())
else:
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(ep / "audio" / "narration.wav"), "-f", "f32le", "-ac", "1",
                          "-ar", "16000", "-"], capture_output=True, check=True).stdout
    model = WhisperModel("large-v3", device="cuda", compute_type="float16")
    segs, _ = model.transcribe(np.frombuffer(pcm, np.float32), language="en", beam_size=5, word_timestamps=True,
                               condition_on_previous_text=False)
    words = [{"w": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2)} for s in segs for w in s.words]
    words_path.write_text(json.dumps(words))
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower())  # noqa: E731
heard = [norm(w["w"]) for w in words]

out = []
for c in cues:
    para = timeline[c["para"]]
    t = para["start"]
    if c["kind"] == "pause":
        t = para["end"]
    elif c["anchor"]:
        # words heard inside this paragraph's span
        idx = [i for i, w in enumerate(words) if para["start"] - 0.3 <= w["s"] <= para["end"] + 0.3]
        want = [norm(x) for x in c["anchor"].split() if norm(x)][:5]
        best, best_i = 0.0, None
        for k in range(len(idx)):
            window = [heard[i] for i in idx[k:k + len(want)]]
            r = difflib.SequenceMatcher(None, want, window).ratio()
            if r > best:
                best, best_i = r, idx[k]
        if best_i is not None and best >= 0.5:
            t = words[best_i]["s"]
        else:
            print(f"  anchor not found ({best:.2f}): {c['anchor']!r} in para {c['para']}")
    out.append({**c, "t": round(t, 2), "para_start": para["start"], "para_end": para["end"]})
(ep / "cues_timed.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
print(f"{len(words)} words, {len(out)} cues timed, narration ends {timeline[-1]['end']:.1f}s")
