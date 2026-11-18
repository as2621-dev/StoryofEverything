#!/usr/bin/env python3
"""
Chunked narration for History of Old America: one Gemini TTS call per script paragraph, pauses added in code.

  uvx --with "google-genai>=2.32.0" --with faster-whisper --with nvidia-cublas-cu12 --with "nvidia-cudnn-cu12>=9,<10"       python3 tools/tts_chunks.py episodes/demo-001-burlend

Stages (each skips work already on disk, so a rerun only redoes missing/deleted chunks):
  1. synth   — audio/raw/NNN.wav per paragraph (designed voice, per-section pace instruction)
  2. verify  — transcribe each chunk back with local Whisper (large-v3 on the GPU, never an API) and diff against
               the script; flags glitches and any spoken words outside the script (a read-aloud style instruction).
               A chunk already verified by Whisper is not re-checked unless its audio file changed.
  3. stitch  — trim chunk edges, insert exact pauses, apply the 5-stage voice chain, normalise to -19 LUFS
Writes audio/narration.wav and audio/timeline.json (start/end/text of every paragraph).
Per-section pace comes from <episode>/sections.json: "wpm", "pause" (s after each paragraph) and "style".
--dry-run prints the chunks with their pace and style, without calling the API.
"""

import argparse
import difflib
import glob
import os
import json
import pathlib
import re
import subprocess
import sys
import site
import time
import wave

import numpy as np
from google import genai
from google.genai import errors, types

ROOT = pathlib.Path("C:/Users/ash/youtube")  # Old Routes reuses the youtube repo .env (Vertex voices)
TTS_MODEL = "gemini-3.8-flash-tts"
# Owner rule 2026-11-07: matching narration to the script is always done locally with Whisper on the RTX 4090,
# never through an API (the Gemini check cost ~$31 in two weeks and missed two read-aloud style lines in ep-005).
WHISPER_MODEL = "large-v3"
# The only two channel voices (channel playbook): primary "youtube 2", secondary "Ember 3".
# "youtube 2" recreated on Vertex AI in GCP project 24115434369 (2026-10-24). "Ember 3" (secondary) still has its
# old Gemini API project ID and must be recreated the same way before it can be used.
# "documentary" (ep-009 on): a firm, clear American baritone, a public-television history narrator, designed on
# Vertex AI 2026-11-10 (episodes/ep-009-all-of-mexico/audio/voice-audition/audition.py, candidate "correspondent").
VOICES = {"primary": "voice_c9b129a2-0108-4f05-9207-b0d095eb30c7", "secondary": "voice_nssu50iigm2w",
          "documentary": "voice_50cfd6c0-9695-4472-8168-c8768afd93bb"}
SAMPLE_RATE = 24000

# Per-section pace fields in sections.json. TTS models often ignore the pace in "style", so stitch()
# time-stretches each chunk (Rubber Band, pitch and formants preserved) to land on "wpm".
PACE_FIELDS = ("wpm", "pause", "style")
SECTION_GAP = 2.0
MIN_TEMPO = 0.75  # never slow more than this; beyond it the voice starts to smear
MAX_TEMPO = 1.25  # allow gentle speedup when target_wpm is faster than the voice's natural ~130 wpm read
MAX_EXTRA_WORDS = 3  # words heard before the script's first / after its last matched word (number readings, slips)
VOICE_CHAIN = (
    "highpass=f=80,equalizer=f=3200:t=q:w=1.4:g=-3.5,equalizer=f=180:t=q:w=1:g=1.5,"
    "deesser=i=0.6:m=0.5:f=0.5,lowpass=f=8000,loudnorm=I=-19:TP=-3:LRA=7"
)


def make_client() -> genai.Client:
    # Reason: supports either GEMINI_API_KEY from .env (if --api-key is passed or GOOGLE_CLOUD_PROJECT is unset)
    # or Vertex AI on GOOGLE_CLOUD_PROJECT (required for project-scoped designed voices like "youtube 2").
    env_lines = (ROOT / ".env").read_text().splitlines() if (ROOT / ".env").exists() else []
    env_map = {line.split("=", 1)[0].strip(): line.split("=", 1)[1].strip()
               for line in env_lines if "=" in line and not line.strip().startswith("#")}
    project = env_map.get("GOOGLE_CLOUD_PROJECT", "")
    api_key = env_map.get("GEMINI_API_KEY", "")
    if project:
        return genai.Client(vertexai=True, project=project, location="global", http_options=types.HttpOptions(
            api_version="v1beta1", headers={"x-goog-user-project": project}))
    if api_key:
        return genai.Client(api_key=api_key, http_options=types.HttpOptions(api_version="v1beta1"))
    sys.exit("Error: neither GOOGLE_CLOUD_PROJECT nor GEMINI_API_KEY found in .env")


def load_pace(episode: pathlib.Path, items: list[dict]) -> dict[str, dict]:
    # Reason: fail before any API call, not mid-run, if a section has no pace (it used to be a KeyError on synth).
    plan = {spec["id"]: spec for spec in json.loads((episode / "sections.json").read_text())}
    problems = [f"section {s} is in script.md but not in sections.json"
                for s in dict.fromkeys(item["section"] for item in items) if s not in plan]
    problems += [f"section {sid} lacks {', '.join(f for f in PACE_FIELDS if f not in spec)}"
                 for sid, spec in plan.items() if any(f not in spec for f in PACE_FIELDS)]
    if problems:
        sys.exit("Error in " + str(episode / "sections.json") + ":\n  " + "\n  ".join(problems)
                 + '\nEvery section needs "wpm" (int), "pause" (seconds) and "style" (TTS read instruction); '
                 "see reference/sections-template.json.")
    return plan


def paragraphs(script_path: pathlib.Path, max_words: int) -> list[dict]:
    # Group consecutive paragraphs of one section into chunks of at most max_words (1 paragraph = 1 chunk at 0).
    items: list[dict] = []
    for block in re.split(r"^## ", script_path.read_text(), flags=re.MULTILINE)[1:]:
        header, _, body = block.partition("\n")
        section = header.split()[0]
        chunk: list[str] = []
        for text in [p.strip().replace("*", "") for p in body.split("\n\n") if p.strip()]:
            if chunk and len(" ".join(chunk + [text]).split()) > max_words:
                items.append({"index": len(items), "section": section, "text": "\n\n".join(chunk)})
                chunk = []
            chunk.append(text)
        if chunk:
            items.append({"index": len(items), "section": section, "text": "\n\n".join(chunk)})
    return items


def with_retry(call):
    # Reason: free-tier TTS returns 429/503 in bursts; spaced retries get through without manual reruns.
    for attempt in range(8):
        try:
            return call()
        except (errors.ServerError, errors.ClientError) as exc:
            if getattr(exc, "code", 0) not in (429, 500, 503):
                raise
            wait = 15 * (attempt + 1)
            print(f"    api busy ({exc.code}), waiting {wait}s")
            time.sleep(wait)
    sys.exit("Error: API stayed unavailable; rerun later — finished chunks are kept.")


def synth(client: genai.Client, item: dict, style: str, out_path: pathlib.Path, model: str, voice_id: str) -> None:
    resp = with_retry(lambda: client.models.generate_content(
        model=model,
        # Reason: a bare "style\n\ntext" prompt gets the style read aloud (test-002, 2026-10-25); the model keeps
        # labelled director's notes out of the audio. It rejects system_instruction (400 INVALID_ARGUMENT).
        # Old Routes: an empty style sends the bare transcript (short chunks read the notes header aloud).
        contents=(f"### DIRECTOR'S NOTES\n{style}\n\n### TRANSCRIPT\n{item['text']}" if style else item["text"]),
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(voice=voice_id)),
        ),
    ))
    part = next(p for p in resp.candidates[0].content.parts if p.inline_data and p.inline_data.data)
    data = part.inline_data.data
    out_path.parent.mkdir(parents=True, exist_ok=True)
    if data[:4] == b"RIFF":
        out_path.write_bytes(data)
        return
    with wave.open(str(out_path), "wb") as wav:  # raw 16-bit PCM from the API
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(data)


def load_whisper():
    # Reason: on Windows, ctranslate2 finds the pip-installed CUDA DLLs (nvidia-cublas/cudnn) only on PATH.
    for sp in site.getsitepackages():
        for d in glob.glob(os.path.join(sp, "nvidia", "*", "bin")):
            os.add_dll_directory(d)
            os.environ["PATH"] = d + os.pathsep + os.environ["PATH"]
    from faster_whisper import WhisperModel
    return WhisperModel(WHISPER_MODEL, device="cuda", compute_type="float16")


def similarity(whisper, wav_path: pathlib.Path, expected: str) -> tuple[float, str, int]:
    """Score a chunk against its script text. Returns (similarity, transcript, words spoken outside the script)."""
    # Reason: faster-whisper's own decoder (PyAV) failed on the installed av version (2026-11-07); ffmpeg is on PATH.
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(wav_path), "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    segments, _ = whisper.transcribe(np.frombuffer(pcm, np.float32), language="en", beam_size=5,
                                     condition_on_previous_text=False)
    heard = " ".join(s.text.strip() for s in segments)
    norm = lambda s: re.findall(r"[a-z']+", s.lower())  # noqa: E731
    want, got = norm(expected), norm(heard)
    matcher = difflib.SequenceMatcher(None, want, got, autojunk=False)
    blocks = [b for b in matcher.get_matching_blocks() if b.size]
    extra = (blocks[0].b + len(got) - (blocks[-1].b + blocks[-1].size)) if blocks else len(got)
    return matcher.ratio(), heard, extra


def duration_of(path: pathlib.Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def trim(src: pathlib.Path, dst: pathlib.Path, words: int, target_wpm: int) -> float:
    # Strip leading/trailing silence so the pauses we insert are exact, then stretch to the target pace.
    edge = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05"
    edged = dst.with_suffix(".edge.wav")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-af",
         f"{edge},areverse,{edge},areverse", "-ar", "48000", "-ac", "1", str(edged)],
        check=True,
    )
    measured_wpm = words / (duration_of(edged) / 60)
    tempo = max(MIN_TEMPO, min(MAX_TEMPO, target_wpm / measured_wpm))
    if abs(tempo - 1.0) > 0.01:
        subprocess.run(["rubberband", "-q", "-3", "--formant", "-T", f"{tempo:.4f}", str(edged), str(dst)],
                       check=True)
        edged.unlink()
    else:
        edged.replace(dst)  # Reason: rename fails on Windows when a rerun finds dst already there
    return duration_of(dst)


def stitch(items: list[dict], plan: dict[str, dict], audio_dir: pathlib.Path) -> None:
    trimmed_dir = audio_dir / "trimmed"
    trimmed_dir.mkdir(exist_ok=True)
    concat_lines: list[str] = []
    timeline: list[dict] = []
    cursor = 0.0
    for i, item in enumerate(items):
        dst = trimmed_dir / f"{item['index']:03d}.wav"
        words = len(item["text"].split())
        duration = trim(audio_dir / "raw" / f"{item['index']:03d}.wav", dst, words, plan[item["section"]]["wpm"])
        last = i == len(items) - 1
        next_section = None if last else items[i + 1]["section"]
        pause = 0.0 if last else (SECTION_GAP if next_section != item["section"] else plan[item["section"]]["pause"])
        timeline.append({**item, "start": round(cursor, 2), "end": round(cursor + duration, 2),
                         "wpm": round(words / (duration / 60))})
        concat_lines.append(f"file '{dst.resolve()}'")
        if pause:
            silence = trimmed_dir / f"silence_{pause:.1f}.wav"
            if not silence.exists():
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i",
                                "anullsrc=r=48000:cl=mono", "-t", str(pause), str(silence)], check=True)
            concat_lines.append(f"file '{silence.resolve()}'")
        cursor += duration + pause
    concat_file = audio_dir / "concat.txt"
    concat_file.write_text("\n".join(concat_lines) + "\n")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(concat_file),
                    "-af", VOICE_CHAIN, "-ar", "48000", str(audio_dir / "narration.wav")], check=True)
    (audio_dir / "timeline.json").write_text(json.dumps(timeline, indent=2))
    print(f"Stitched {len(items)} chunks -> {audio_dir / 'narration.wav'} ({cursor / 60:.2f} min)")
    for t in timeline:
        print(f"  {t['index']:03d} [{t['section']}] {t['start']:7.1f}s  {t['wpm']} wpm")


def main() -> None:
    parser = argparse.ArgumentParser(description="Chunked Gemini TTS with verification and stitching.")
    parser.add_argument("episode", type=pathlib.Path)
    parser.add_argument("--skip-verify", action="store_true")
    parser.add_argument("--model", default=TTS_MODEL, help="free tier: gemini-3.8-flash-lite-tts (separate quota)")
    parser.add_argument("--max-words", type=int, default=0, help="group paragraphs per call (0 = one per call)")
    parser.add_argument("--voice", choices=sorted(VOICES), default="primary")
    parser.add_argument("--audio-dir", default="audio", help="relative to the episode; use a separate one per voice")
    parser.add_argument("--dry-run", action="store_true", help="print chunks, pace and style; no API calls")
    args = parser.parse_args()
    audio_dir = args.episode / args.audio_dir
    items = paragraphs(args.episode / "script.md", args.max_words)
    plan = load_pace(args.episode, items)
    if args.dry_run:
        for item in items:
            spec = plan[item["section"]]
            print(f"  {item['index']:03d} [{item['section']}] {len(item['text'].split())} words, "
                  f"{spec['wpm']} wpm, pause {spec['pause']}s | {spec['style']}")
        return
    client = make_client()

    for item in items:
        raw = audio_dir / "raw" / f"{item['index']:03d}.wav"
        if not raw.exists():
            print(f"  synth {item['index']:03d} [{item['section']}] {len(item['text'].split())} words")
            synth(client, item, plan[item["section"]]["style"], raw, args.model, VOICES[args.voice])

    if not args.skip_verify:
        verify_path = audio_dir / "verify.json"
        previous = {r["index"]: r for r in json.loads(verify_path.read_text())} if verify_path.exists() else {}
        report, whisper = [], None
        for item in items:
            wav = audio_dir / "raw" / f"{item['index']:03d}.wav"
            stamp = wav.stat().st_mtime_ns
            old = previous.get(item["index"])
            # Reason: re-checking every chunk on every rerun made the old Gemini check run ~3.4x per chunk.
            # Entries without "checked_by" came from the old Gemini check (which missed leaks) and are redone once.
            if old and old.get("checked_by") == WHISPER_MODEL and old.get("audio_mtime_ns") == stamp:
                report.append(old)
                continue
            whisper = whisper or load_whisper()
            score, heard, extra = similarity(whisper, wav, item["text"])
            # Reason: a leaked style line adds ~12 words before the text but barely moves the ratio on long chunks.
            flag = "LEAK?" if extra > MAX_EXTRA_WORDS else "GLITCH?" if score < 0.92 else "ok"
            print(f"  verify {item['index']:03d}: {score:.2f} {flag}")
            report.append({"index": item["index"], "score": round(score, 3), "extra_words": extra, "flag": flag,
                           "heard": heard, "checked_by": WHISPER_MODEL, "audio_mtime_ns": stamp})
        verify_path.write_text(json.dumps(report, indent=2))
        bad = [r["index"] for r in report if r["flag"] != "ok"]
        if bad:
            print(f"Chunks to re-check or delete and regenerate: {bad}")

    stitch(items, plan, audio_dir)


if __name__ == "__main__":
    main()
