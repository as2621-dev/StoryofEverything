#!/usr/bin/env python3
"""Final narration pass (owner rule 2026-11-18): the WHOLE script read in ONE TTS take, never time-stretched.

  uvx --with "google-genai>=2.32.0" --with faster-whisper --with nvidia-cublas-cu12 --with "nvidia-cudnn-cu12>=9,<10" \
      --with numpy --with soundfile python tools/tts_onetake.py episodes/<ep> [--take N] [--patch 12=1,32=3]

Why: per-paragraph chunks each stretched to a words-per-minute target (Rubber Band, 0.80-1.25x) made the voice
audibly speed up and slow down, and every chunk was a separate read. One take keeps one pace and one delivery.

Stages (a finished take and its Whisper words are reused from audio/onetake/; pass a new --take to read again):
  1. synth    audio/onetake/take_N.wav: the whole script.md in one call (bare transcript, the channel voice).
              --per-chapter: one call per narrative chapter (sections.json "chapter"), identical settings, joined at
              the chapter breaks; use it only if the one-call take comes back truncated.
  2. align    local Whisper large-v3 word timestamps (owner rule: never an API); each paragraph boundary is cut in
              the quietest spot of the longest silence between the two paragraphs' aligned words.
  3. verify   per paragraph: heard vs script similarity, doubled words and speech rate -> audio/onetake/verify.json.
              A glitch in one paragraph (e.g. a doubled word): read another full take and --patch K=thatTake, which
              swaps in that take's paragraph K only (same voice, same settings, still never stretched).
  4. assemble paragraphs back to back with designed silences only; the speech itself is never stretched:
                natural gap (clamped 0.45-1.0 s) inside a section, SECTION_GAP between sections,
                CHAPTER_GAP where sections.json "chapter" changes, and at least N s for a [PAUSE Ns] cue.
              Voice chain + -19 LUFS. Writes audio/narration.wav and audio/timeline.json (tts_chunks format).
"""
import argparse, difflib, json, pathlib, re, subprocess, sys
import numpy as np
import soundfile as sf

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import tts_chunks as T  # noqa: E402  (client, voices, model, voice chain, Whisper loader)

SR = 24000
SECTION_GAP = 1.6
CHAPTER_GAP = 3.2
GAP_MIN, GAP_MAX = 0.45, 1.0
_whisper = None


def paragraphs(ep):
    items = T.paragraphs(ep / "script.md", 0)
    # [PAUSE Ns] lines in the annotated script sit after the paragraph they follow
    pause_after, idx = {}, -1
    src = (ep / "script_annotated.md").read_text(encoding="utf-8")
    for block in re.split(r"^## ", src, flags=re.MULTILINE)[1:]:
        for chunk in [c.strip() for c in block.partition("\n")[2].split("\n\n") if c.strip()]:
            if chunk.startswith("[PAUSE"):
                pause_after[idx] = float(re.search(r"(\d+(?:\.\d+)?)\s*s", chunk).group(1))
            elif not chunk.startswith("["):
                idx += 1
    assert idx + 1 == len(items), (idx + 1, len(items))
    return items, pause_after


def synth_take(client, text, voice):
    resp = T.with_retry(lambda: client.models.generate_content(
        model=T.TTS_MODEL, contents=text,
        config=T.types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=T.types.SpeechConfig(voice_config=T.types.VoiceConfig(voice=voice)))))
    data = next(p for p in resp.candidates[0].content.parts if p.inline_data and p.inline_data.data).inline_data.data
    if data[:4] == b"RIFF":
        data = data[44:]
    return np.frombuffer(data, np.int16).astype(np.float32) / 32768


def norm_tokens(s):
    return re.findall(r"[a-z0-9']+", s.lower().replace("-", " "))


def load(path, sr):
    return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar",
                                         str(sr), "-"], capture_output=True, check=True).stdout, np.float32)


def get_take(out, n, items, chap, per_chapter, voice):
    wav = out / f"take_{n}{'_pc' if per_chapter else ''}.wav"
    if not wav.exists():
        client = T.make_client()
        groups = [list(items)]
        if per_chapter:
            groups = []
            for it in items:
                if not groups or chap[groups[-1][-1]["section"]] != chap[it["section"]]:
                    groups.append([])
                groups[-1].append(it)
        parts = []
        for g in groups:
            print(f"  synth take {n}: {len(g)} paragraphs, {sum(len(i['text'].split()) for i in g)} words")
            parts += [synth_take(client, "\n\n".join(i["text"] for i in g), T.VOICES[voice]), np.zeros(int(0.8 * SR), np.float32)]
        sf.write(wav, np.concatenate(parts), SR, subtype="PCM_16")
    return wav


def split_take(wav, items):
    """Cut one take into its paragraphs and verify each one. Returns per paragraph: (samples, lead, tail, report)."""
    global _whisper
    x = load(wav, SR)
    wjson = wav.with_suffix(".words.json")
    if wjson.exists():
        words = json.loads(wjson.read_text())
    else:
        _whisper = _whisper or T.load_whisper()
        segs, _ = _whisper.transcribe(load(wav, 16000), language="en", beam_size=5, word_timestamps=True,
                                      condition_on_previous_text=False)
        words = [{"w": w.word.strip(), "s": w.start, "e": w.end} for s in segs for w in s.words]
        wjson.write_text(json.dumps(words))
    heard = [(t, wi) for wi, w in enumerate(words) for t in norm_tokens(w["w"])]
    script = [(t, it["index"]) for it in items for t in norm_tokens(it["text"])]
    sm = difflib.SequenceMatcher(None, [t for t, _ in script], [t for t, _ in heard], autojunk=False)
    s2w = {}
    for b in sm.get_matching_blocks():
        for k in range(b.size):
            s2w[b.a + k] = heard[b.b + k][1]
    first, last = {}, {}
    for si, (_, p) in enumerate(script):
        if si in s2w:
            first.setdefault(p, s2w[si]); last[p] = s2w[si]
    missing = [it["index"] for it in items if it["index"] not in first]
    if missing:
        sys.exit(f"{wav.name}: paragraphs not found (truncated or skipped?): {missing}; read another take or --per-chapter")
    hop = int(0.02 * SR)
    rms = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, mode="same") + 1e-12)
    cuts = [0]
    for k in range(len(items) - 1):
        a_i, b_i = last[k], first[k + 1]
        if b_i <= a_i:
            sys.exit(f"{wav.name}: alignment crossed between paragraphs {k} and {k + 1}")
        # Reason: Whisper often folds a pause into the next word's span ("idea" 552.6-553.0, "smuggle" 553.0-554.4),
        # so word gaps can read as zero; cut in the middle of the longest run of real silence (< -40 dB) between the
        # start of paragraph k's last word and the end of paragraph k+1's first word.
        s0, s1 = int(words[a_i]["s"] * SR), int(words[b_i]["e"] * SR)
        quiet = rms[s0:s1:hop] < 10 ** (-40 / 20)
        best, run, best_end = 0, 0, None
        for j, q in enumerate(quiet):
            run = run + 1 if q else 0
            if run > best:
                best, best_end = run, j
        if best_end is None:
            cuts.append(s0 + int(np.argmin(rms[s0:s1])))
        else:
            cuts.append(s0 + (best_end - best // 2) * hop)
    cuts.append(len(x))
    thr = 10 ** (-50 / 20)
    res = []
    # Reason: on the long take Whisper repeats words at its 30 s window edges ("away. way."), so each paragraph is
    # re-heard on its own to verify it; the cached per-paragraph transcripts live next to the take.
    vjson = wav.with_suffix(".paras.json")
    heard_para = json.loads(vjson.read_text()) if vjson.exists() else {}
    for k, it in enumerate(items):
        seg = x[cuts[k]:cuts[k + 1]]
        loud = np.where(np.abs(seg) > thr)[0]
        lead, tail = (loud[0], len(seg) - loud[-1] - 1) if len(loud) else (0, 0)
        seg = seg[max(0, lead - int(0.03 * SR)):len(seg) - max(0, tail - int(0.06 * SR))]
        key = f"{k}:{len(seg)}"
        if key not in heard_para:
            _whisper = _whisper or T.load_whisper()
            seg16 = np.interp(np.arange(0, len(seg), SR / 16000), np.arange(len(seg)), seg).astype(np.float32)
            ss, _ = _whisper.transcribe(seg16, language="en", beam_size=5, condition_on_previous_text=False)
            heard_para[key] = " ".join(z.text.strip() for z in ss)
        got = heard_para[key]
        r = difflib.SequenceMatcher(None, norm_tokens(it["text"]), norm_tokens(got), autojunk=False).ratio()
        gt = norm_tokens(got)
        doubled = [gt[i] for i in range(1, len(gt)) if gt[i] == gt[i - 1] and len(gt[i]) > 2
                   and f"{gt[i]} {gt[i]}" not in " ".join(norm_tokens(it["text"]))]
        wps = len(it["text"].split()) / (len(seg) / SR)
        flag = "ok" if r >= 0.85 and 1.6 <= wps <= 3.4 and not doubled else "CHECK"
        res.append((seg, lead, tail, {"index": k, "score": round(r, 3), "wps": round(wps, 2), "doubled": doubled,
                                      "flag": flag, "heard": got}))
    vjson.write_text(json.dumps(heard_para))
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode", type=pathlib.Path)
    ap.add_argument("--take", type=int, default=1)
    ap.add_argument("--per-chapter", action="store_true")
    ap.add_argument("--patch", default="", help="K=N,...: use take N's paragraph K (a glitch-free read of it)")
    ap.add_argument("--voice", default="primary")
    a = ap.parse_args()
    ep = a.episode
    out = ep / "audio" / "onetake"; out.mkdir(parents=True, exist_ok=True)
    items, pause_after = paragraphs(ep)
    chap = {s["id"]: s.get("chapter", s["id"]) for s in json.loads((ep / "sections.json").read_text())}
    patch = {int(k): int(v) for k, v in (p.split("=") for p in a.patch.split(",") if p)}
    takes = {}
    for n in {a.take, *patch.values()}:
        takes[n] = split_take(get_take(out, n, items, chap, a.per_chapter, a.voice), items)
    parts = [takes[patch.get(k, a.take)][k] for k in range(len(items))]
    report = [dict(p[3], take=patch.get(k, a.take)) for k, p in enumerate(parts)]
    (out / "verify.json").write_text(json.dumps(report, indent=1))
    bad = [r for r in report if r["flag"] != "ok"]
    for r in bad:
        print(f"  CHECK {r['index']:03d} (take {r['take']}) score {r['score']} {r['wps']} w/s doubled {r['doubled']} | {r['heard'][:100]}")

    pieces, timeline, cur = [], [], 0.0
    for k, it in enumerate(items):
        seg = parts[k][0]; pieces.append(seg); d = len(seg) / SR
        timeline.append({**it, "start": round(cur, 2), "end": round(cur + d, 2),
                         "wpm": round(len(it["text"].split()) / (d / 60))})
        cur += d
        if k + 1 == len(items):
            break
        nxt = items[k + 1]
        nat = (parts[k][2] + parts[k + 1][1]) / SR
        if chap[nxt["section"]] != chap[it["section"]]:
            gap = CHAPTER_GAP
        elif nxt["section"] != it["section"]:
            gap = SECTION_GAP
        else:
            gap = min(GAP_MAX, max(GAP_MIN, nat))
        gap = max(gap, pause_after.get(k, 0))
        pieces.append(np.zeros(int(gap * SR), np.float32)); cur += gap
    raw = out / "assembled.wav"
    sf.write(raw, np.concatenate(pieces), SR, subtype="PCM_16")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", T.VOICE_CHAIN, "-ar", "48000",
                    str(ep / "audio" / "narration.wav")], check=True)
    (ep / "audio" / "timeline.json").write_text(json.dumps(timeline, indent=2))
    rates = sorted(t["wpm"] for t in timeline if len(t["text"].split()) >= 12)
    print(f"narration {cur / 60:.2f} min, {len(items)} paragraphs, {len(bad)} to check; "
          f"pace {rates[0]}-{rates[-1]} wpm (median {rates[len(rates) // 2]}), no stretching")


if __name__ == "__main__":
    main()
