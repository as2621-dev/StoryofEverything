#!/usr/bin/env python3
"""Quiet felt-piano + string-pad bed for Old Routes episodes (deterministic, never looped).

  uvx --with numpy --with scipy python tools/make_music.py episodes/ep-001-run-and-manhattan --seconds 660 [--dark 300:420]

Slow 4-chord cycle (Am - F - C - G / Em), one soft piano note every ~1.6-3.2 s from the chord, over a detuned pad.
--dark a:b  plays a sparser, lower, minor-only passage between a and b seconds (for the 1621 section).
Writes <ep>/audio/music.wav (48 kHz stereo, about -30 LUFS before mixing).
"""
import argparse
import pathlib
import subprocess
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfiltfilt

SR = 24000
OUT = 48000
SEED = 1667
CHORDS = [  # (name, pad notes Hz, piano pool Hz)
    ("Am", [110.0, 164.81, 220.0, 261.63], [220.0, 261.63, 329.63, 440.0, 523.25]),
    ("F", [87.31, 130.81, 174.61, 220.0], [261.63, 349.23, 440.0, 523.25, 349.23]),
    ("C", [130.81, 196.0, 261.63, 329.63], [261.63, 329.63, 392.0, 523.25, 659.25]),
    ("G", [98.0, 146.83, 196.0, 246.94], [246.94, 293.66, 392.0, 493.88, 587.33]),
]
DARK = [("Am", [55.0, 110.0, 164.81, 196.0], [220.0, 246.94, 329.63]),
        ("Dm", [73.42, 110.0, 146.83, 174.61], [220.0, 293.66, 349.23])]
CHORD_S = 12.0


def piano(freq, dur, rng):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    for n in range(1, 7):
        f = freq * n * (1 + 0.0004 * n * n)
        out += (0.6 ** (n - 1)) * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * np.exp(-t * (1.6 + 0.9 * n))
    attack = np.minimum(t / 0.012, 1.0)
    return out * attack


def pad(freqs, dur, rng):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    for f in freqs:
        for cents in (-6, 0, 6):
            ff = f * 2 ** (cents / 1200)
            out += np.sin(2 * np.pi * ff * t + rng.uniform(0, 6.28)) * (0.5 + 0.5 * np.sin(2 * np.pi * t / rng.uniform(9, 17)))
    env = np.minimum(1, np.minimum(t / 3.0, (dur - t) / 3.0).clip(0))
    return out * env / (len(freqs) * 3)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode", type=pathlib.Path)
    ap.add_argument("--seconds", type=float, required=True)
    ap.add_argument("--dark", default="")
    a = ap.parse_args()
    dark = tuple(float(x) for x in a.dark.split(":")) if a.dark else (-1, -1)
    rng = np.random.default_rng(SEED)
    n = int(a.seconds * SR)
    L, R = np.zeros(n + SR * 30), np.zeros(n + SR * 30)
    t0, ci = 0.0, 0
    while t0 < a.seconds:
        in_dark = dark[0] <= t0 < dark[1]
        name, pnotes, pool = (DARK[ci % 2] if in_dark else CHORDS[ci % 4])
        seg = pad(pnotes, CHORD_S + 3.0, rng) * (0.9 if in_dark else 0.7)
        i = int(t0 * SR)
        L[i:i + len(seg)] += seg
        R[i:i + len(seg)] += seg[::-1] * 0 + seg  # same pad both sides; width comes from piano panning
        tn = t0 + rng.uniform(0.3, 1.2)
        while tn < t0 + CHORD_S:
            f = rng.choice(pool) * (0.5 if in_dark else 1.0)
            note = piano(f, 5.0, rng) * rng.uniform(0.18, 0.32) * (0.7 if in_dark else 1.0)
            pan = rng.uniform(0.3, 0.7)
            j = int(tn * SR)
            L[j:j + len(note)] += note * (1 - pan) * 2
            R[j:j + len(note)] += note * pan * 2
            tn += rng.uniform(2.4, 4.0) if in_dark else rng.uniform(1.6, 3.2)
        t0 += CHORD_S
        ci += 1
    sos = butter(4, 2600, "low", fs=SR, output="sos")
    L, R = sosfiltfilt(sos, L), sosfiltfilt(sos, R)
    ir_t = np.arange(int(3.5 * SR)) / SR
    ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 1.6)
    ir /= np.abs(ir).sum() / 6
    L = 0.6 * L + 0.4 * fftconvolve(L, ir)[:len(L)]
    R = 0.6 * R + 0.4 * fftconvolve(R, ir[::-1] * 0 + ir)[:len(R)]
    L, R = L[:n], R[:n]
    fade = np.ones(n)
    k = int(6 * SR)
    fade[-k:] = np.linspace(1, 0, k)
    fade[:int(2 * SR)] = np.linspace(0, 1, int(2 * SR))
    st = np.stack([L * fade, R * fade], 1)
    st /= np.abs(st).max() * 1.12
    out_dir = a.episode / "audio"
    out_dir.mkdir(parents=True, exist_ok=True)
    tmp = out_dir / "music_24k.wav"
    with wave.open(str(tmp), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(tmp), "-ar", str(OUT), str(out_dir / "music.wav")], check=True)
    tmp.unlink()
    print("wrote", out_dir / "music.wav")


if __name__ == "__main__":
    main()
