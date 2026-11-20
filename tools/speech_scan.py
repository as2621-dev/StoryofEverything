#!/usr/bin/env python3
"""Flag audio files that contain speech or singing (local Whisper large-v3 on the GPU, never an API).
  python tools/speech_scan.py out.json file1 file2 ...
"""
import glob, json, os, site, subprocess, sys
for sp in site.getsitepackages():
    for b in glob.glob(os.path.join(sp, "nvidia", "*", "bin")):
        os.environ["PATH"] = b + os.pathsep + os.environ["PATH"]; os.add_dll_directory(b)
import numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("large-v3", device="cuda", compute_type="float16")
res = {}
for f in sys.argv[2:]:
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
    a = np.frombuffer(pcm, np.float32)
    segs, _ = m.transcribe(a, language="en", vad_filter=True)
    words = [s.text.strip() for s in segs if s.no_speech_prob < 0.5 and s.avg_logprob > -1.0]
    res[os.path.basename(f)] = " ".join(words)
    print(os.path.basename(f), "|", res[os.path.basename(f)][:80])
json.dump(res, open(sys.argv[1], "w"), indent=1)
