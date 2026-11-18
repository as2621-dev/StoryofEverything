#!/usr/bin/env python3
"""Round-3 soundtrack: narration + Lyria music bed (mood per section, ducked under the voice) + sound effects placed
from each chapter's sfx.json. Writes audio/mix.wav (48 kHz stereo, -15 LUFS, true peak under -1 dBTP) and
audio/sfx_placed.json.

  python tools/sound_mix.py episodes/ep-001-run-and-manhattan build_r3 [--no-sfx]

Music clips: audio/music_r3/<mood>_NN.wav (Lyria 2, 32.8 s each). Mood per section: MOODS below.
SFX: trade-routes/assets/sfx/manifest.json (palette name -> takes); takes rotate; a hit's PEAK lands one frame after
its cue time (light before sound); beds loop/trim to `dur` with fades.
"""
import json, pathlib, subprocess, sys
import numpy as np
import pyloudnorm as pyln

SR = 48000
ep = pathlib.Path(sys.argv[1]); BUILD = sys.argv[2]; NO_SFX = "--no-sfx" in sys.argv
ROOT = pathlib.Path(__file__).resolve().parents[1]
MOODS = {"1a": "dark", "1b": "curious", "2a": "curious", "2b": "curious", "3a": "curious", "3b": "dark",
         "4a": "curious", "4b": "dark", "5a": "dark", "5b": "dark", "6a": "curious", "6b": "dark",
         "7a": "voyage", "7b": "ending"}
BEDS = {"waves", "fire", "gulls", "ship_creak", "march", "clock_tick", "flag", "ui_typing", "quill"}
meter = pyln.Meter(SR)


def load(f):
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.float32).reshape(-1, 2).copy()


def lufs(x):
    return meter.integrated_loudness(x) if len(x) > SR * 0.5 else 20 * np.log10(np.abs(x).max() + 1e-9) - 3


def gain(x, db):
    return x * (10 ** (db / 20))


def xfade_join(a, b, sec):
    n = min(int(sec * SR), len(a), len(b))
    t = np.linspace(0, np.pi / 2, n)[:, None]
    return np.concatenate([a[:-n], a[-n:] * np.cos(t) + b[:n] * np.sin(t), b[n:]])


def trim_silence(x, thr=1e-3):
    idx = np.where(np.abs(x).max(1) > thr)[0]
    return x[idx[0]:idx[-1] + 1] if len(idx) else x


timeline = json.loads((ep / "audio" / "timeline.json").read_text())
plan = json.loads((ep / BUILD / "plan.json").read_text())
total_n = sum(c["frames"] for c in plan) * SR // 30
voice = load(ep / "audio" / "narration.wav")
voice = np.pad(voice, ((0, max(0, total_n - len(voice))), (0, 0)))[:total_n]

# ---------------- music
clips = {}
for f in sorted((ep / "audio" / "music_r3").glob("*_[0-9][0-9].wav")):
    x = trim_silence(load(f))
    clips.setdefault(f.stem.rsplit("_", 1)[0], []).append(gain(x, -19 - lufs(x)))
use = {m: 0 for m in clips}


def mood_track(mood, seconds):
    out = None
    while out is None or len(out) < seconds * SR:
        c = clips[mood][use[mood] % len(clips[mood])]; use[mood] += 1
        out = c if out is None else xfade_join(out, c, 4.0)
    return out


# Round 5 (owner note 2026-11-18: "no sense of pause, it all looks like a blur"): the music marks the structure.
# - narrative chapter break (sections.json "chapter" changes): the cue fades out and RESOLVES into the break
#   (ends CH_TAIL s after the last word), a low impact lands on the next chapter's first frame, and a NEW cue starts
#   from its first bar CH_LEAD s before the next chapter's first word;
# - section change inside a chapter: the music dips (SECTION_DIP dB) through the gap; a new mood crossfades there.
CH_TAIL, CH_FADE, CH_LEAD, CH_FADE_IN, SECTION_DIP, XF = 1.35, 2.0, 0.9, 0.35, -6.0, 3.0
sections = json.loads((ep / "sections.json").read_text())
chap = {x["id"]: x.get("chapter", x["id"]) for x in sections}
segs = []  # [start, end, mood, fade_in, fade_out]
kitchen_end = timeline[0]["end"] + 0.4
segs.append([0.0, kitchen_end + XF / 2, "kitchen", 0.5, XF])
segs.append([kitchen_end - XF / 2, None, MOODS["1a"], XF, None])
dips, turns = [], []
for k in range(len(timeline) - 1):
    a_, b_ = timeline[k], timeline[k + 1]
    if chap[b_["section"]] != chap[a_["section"]]:
        segs[-1][1], segs[-1][4] = a_["end"] + CH_TAIL, CH_FADE
        segs.append([b_["start"] - CH_LEAD, None, MOODS[b_["section"]], CH_FADE_IN, None])
        turns.append(b_["start"] - 0.8)
    elif b_["section"] != a_["section"]:
        dips.append((a_["end"], b_["start"]))
        if MOODS[b_["section"]] != segs[-1][2]:
            t = b_["start"] - 1.0
            segs[-1][1], segs[-1][4] = t + XF / 2, XF
            segs.append([t - XF / 2, None, MOODS[b_["section"]], XF, None])
segs[-1][1], segs[-1][4] = total_n / SR, 6.0
music = np.zeros_like(voice)
for t0, t1, mood, fi, fo in segs:
    a, b = int(max(0, t0) * SR), int(min(total_n / SR, t1) * SR)
    tr = mood_track(mood, (b - a) / SR + 1)[:b - a]
    env = np.ones(b - a)
    n_in, n_out = min(int(fi * SR), b - a), min(int(fo * SR), b - a)
    env[:n_in] = np.sin(np.linspace(0, np.pi / 2, n_in))
    env[-n_out:] = np.minimum(env[-n_out:], np.cos(np.linspace(0, np.pi / 2, n_out)))
    music[a:b] += tr * env[:, None]
# duck: -14 dB under speech, -8 dB in gaps longer than 1.2 s, smoothed
speech = np.zeros(total_n, bool)
for p in timeline:
    speech[int((p["start"] - 0.15) * SR):int((p["end"] + 0.25) * SR)] = True
lvl = np.where(speech, -14.0, -8.0)
for d0, d1 in dips:  # section change inside a chapter: the music steps back for the breath
    lvl[int(d0 * SR):int(d1 * SR)] += SECTION_DIP
k = int(0.6 * SR); cs = np.concatenate([[0.0], np.cumsum(np.pad(lvl, (k // 2, k - k // 2 - 1), mode="edge"))]); lvl = (cs[k:] - cs[:-k]) / k
music *= (10 ** (lvl / 20))[:, None]
music[:int(0.5 * SR)] *= np.linspace(0, 1, int(0.5 * SR))[:, None]

# ---------------- sfx
sfx = np.zeros_like(voice); placed = []
if not NO_SFX:
    SFXDIR = ROOT / "assets" / "sfx"
    manifest = json.loads((SFXDIR / "manifest.json").read_text(encoding="utf-8"))
    cache, turn = {}, {}
    for ch in plan:
        f = ep / BUILD / ch["id"] / "proj" / "sfx.json"
        if not f.exists():
            print("no sfx.json for", ch["id"]); continue
        for c in json.loads(f.read_text(encoding="utf-8")):
            name = c["sfx"]
            if name not in manifest:
                print("unknown sfx", ch["id"], name); continue
            takes = manifest[name]; k_ = turn.get(name, 0); turn[name] = k_ + 1
            fn = takes[k_ % len(takes)]["file"]
            if fn not in cache:
                x = trim_silence(load(SFXDIR / fn), 3e-4)
                cache[fn] = x
            x = cache[fn]
            T = ch["start_frame"] / 30 + float(c["t"])
            if name in BEDS or c.get("dur"):
                dur = float(c.get("dur", min(len(x) / SR, 6)))
                y = gain(x, -19 - lufs(x))
                while len(y) < dur * SR: y = xfade_join(y, y, min(1.0, len(y) / SR / 3))
                y = y[:int(dur * SR)].copy(); fd = min(int(0.6 * SR), len(y) // 3)
                y[:fd] *= np.linspace(0, 1, fd)[:, None]; y[-fd:] *= np.linspace(1, 0, fd)[:, None]
                y = gain(y, -13 + float(c.get("gain_db", 0))); start = T
            else:
                y = gain(x, -1 - 20 * np.log10(np.abs(x).max() + 1e-9))  # peak -1 dBFS
                y = gain(y, -14 + float(c.get("gain_db", 0)))
                pk = np.argmax(np.abs(y[:int(1.5 * SR)]).max(1)) / SR
                start = T + 1 / 30 - pk
            a = int(max(0, start) * SR); y = y[int(max(0, -start) * SR):][:max(0, total_n - a)]
            sfx[a:a + len(y)] += y
            placed.append({"ch": ch["id"], "t_global": round(T, 3), "sfx": name, "file": fn, "note": c.get("note", "")})
    # chapter turns: one soft low impact on each new chapter's first frame (the builders keep that 0.5 s clear)
    for T in turns:
        x = trim_silence(load(SFXDIR / manifest["ui_impact_bass_2"][0]["file"]), 3e-4)
        y = gain(gain(x, -1 - 20 * np.log10(np.abs(x).max() + 1e-9)), -21)
        pk = np.argmax(np.abs(y[:int(1.5 * SR)]).max(1)) / SR
        a = int(max(0, T + 1 / 30 - pk) * SR); y = y[:max(0, total_n - a)]
        sfx[a:a + len(y)] += y
        placed.append({"ch": "turn", "t_global": round(T, 3), "sfx": "ui_impact_bass_2", "file": manifest["ui_impact_bass_2"][0]["file"], "note": "chapter turn"})
    (ep / "audio" / "sfx_placed.json").write_text(json.dumps(placed, indent=1, ensure_ascii=False), encoding="utf-8")

mix = voice + music + sfx
mix = gain(mix, -15 - meter.integrated_loudness(mix))
out = ep / "audio" / "mix_pre.wav"
import soundfile as sf
sf.write(out, mix, SR, subtype="FLOAT")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(out), "-af", "alimiter=limit=0.85:attack=1:release=50:level=false",
                "-ar", str(SR), "-c:a", "pcm_s24le", str(ep / "audio" / "mix.wav")], check=True)
sf.write(ep / "audio" / "music.wav", music, SR, subtype="PCM_24")
fin = load(ep / "audio" / "mix.wav")
print(f"mix {len(fin)/SR:.2f}s  {meter.integrated_loudness(fin):.1f} LUFS  peak {20*np.log10(np.abs(fin).max()):.2f} dBFS  "
      f"music segs {[(round(t0,1),m) for t0,_,m,_,_ in segs]}  sfx placed {len(placed)}")
