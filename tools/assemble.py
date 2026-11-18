#!/usr/bin/env python3
"""Join the chapter renders and lay the mixed soundtrack under them.

  python tools/assemble.py episodes/ep-001-run-and-manhattan

Checks every build/<ch>/proj/chapter.mp4 against plan.json's frame count (fails loudly on a mismatch), concatenates
them (stream copy when the codecs match), muxes audio/mix.wav, and writes out/<episode>.mp4 plus a 720p review copy.
"""
import json
import pathlib
import subprocess
import sys

ep = pathlib.Path(sys.argv[1])
BUILD = sys.argv[2] if len(sys.argv) > 2 else "build"  # round 2: build_r2
plan = json.loads((ep / BUILD / "plan.json").read_text())
out = ep / "out"
out.mkdir(exist_ok=True)
lines, bad = [], []
for ch in plan:
    f = ep / BUILD / ch["id"] / "proj" / "chapter.mp4"
    if not f.exists():
        bad.append(f"{ch['id']}: missing {f}")
        continue
    n = int(subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries",
                            "stream=nb_read_frames", "-of", "csv=p=0", str(f)], capture_output=True, text=True).stdout.strip())
    if n != ch["frames"]:
        bad.append(f"{ch['id']}: {n} frames, expected {ch['frames']}")
    lines.append(f"file '{f.resolve().as_posix()}'")
if bad:
    sys.exit("Not assembling:\n  " + "\n  ".join(bad))
(out / "concat.txt").write_text("\n".join(lines) + "\n")
video = out / "video_only.mp4"
# Re-encode once: chapters may differ in encoder settings; one consistent high-quality pass for upload.
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(out / "concat.txt"),
                "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-r", "30", str(video)], check=True)
final = out / f"{ep.name}.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-i", str(ep / "audio" / "mix.wav"),
                "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-shortest",
                "-movflags", "+faststart", str(final)], check=True)
review = out / f"{ep.name}_720p.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(final), "-vf", "scale=1280:-2", "-c:v", "libx264",
                "-crf", "24", "-preset", "fast", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(review)],
               check=True)
print("wrote", final, "and", review)
