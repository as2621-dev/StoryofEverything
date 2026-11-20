#!/usr/bin/env python3
"""Whisper (local large-v3) on the final mix vs the script, per paragraph: catches music/SFX masking the voice.
  python tools/mix_intelligibility.py episodes/<ep>
"""
import difflib, glob, json, os, pathlib, re, site, subprocess, sys
for sp in site.getsitepackages():
    for b in glob.glob(os.path.join(sp, "nvidia", "*", "bin")):
        os.environ["PATH"] = b + os.pathsep + os.environ["PATH"]; os.add_dll_directory(b)
import numpy as np
from faster_whisper import WhisperModel
ep = pathlib.Path(sys.argv[1]); tl = json.loads((ep / "audio" / "timeline.json").read_text())
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(ep / "audio" / "mix.wav"), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
a = np.frombuffer(pcm, np.float32); m = WhisperModel("large-v3", device="cuda", compute_type="float16")
v = json.loads((ep / "audio" / "verify.json").read_text())
norm = lambda s: re.sub(r"[^a-z0-9 ]", "", s.lower()).split()
worse = []
for p in tl:
    seg = a[int(max(0, p["start"] - 0.2) * 16000):int((p["end"] + 0.3) * 16000)]
    heard = " ".join(s.text for s in m.transcribe(seg, language="en", beam_size=5)[0])
    ref = v[str(p["index"])]["heard"] if str(p["index"]) in v else p["text"]
    r = difflib.SequenceMatcher(None, norm(ref), norm(heard)).ratio()
    if r < 0.9: worse.append((p["index"], round(r, 2), heard))
print(len(tl), "paragraphs;", len(worse), "below 0.90 vs the clean-voice transcript")
for w in worse: print(w)
