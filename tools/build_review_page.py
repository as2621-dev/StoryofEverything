#!/usr/bin/env python3
"""
Clip review page, shared by Marked in Red and The Stranded Files (owner rules 2026-11-13 and 2026-11-14; keep both
repos' copies of this file and review_page.html identical). One clip per shot on the left with its script line under
it, autoplaying into the next; a big comment box on the right; comments in the artifact's db. Earlier-round notes fold
under the clip they now belong to. Cuts 720p clips + posters from the render and writes <part>/review/index.html.

Marked in Red layout (edit/cuts.json, audio/pieces.json, shots.json, ../sections.json):
  python -X utf8 tools/build_review_page.py episodes/001-deshazer production/part1 \\
      --video "edit/renders/mir-001-part1-v1.mp4" --title "DeShazer, part 1" --drive <viewUrl>
Any other layout: pass --clips, a JSON list of {id, start, end, text, beat?, kind?} (paths relative to the part folder):
  python -X utf8 tools/build_review_page.py episodes/001-grafton video --clips review/clips.json \\
      --video renders/cut-v3.mp4 --title "Grafton, cut v3" --tag v3 --collection notes-v3 --prev notes-v2

Each round gets its own collection: --collection notes-vN --prev notes-v(N-1). Notes are docs keyed by shot id
{text, status open|done, reply, next}. To answer one, set status "done", reply (one short line: what changed) and
next (the new version's shot ids it maps to), so it folds under the right clip on the next page.

Publish <part>/review/index.html with files clips/*.mp4 and posters/*.jpg (batches of <= 60 MB), capabilities
{db: {}, user: {}}; republish revisions to the same artifact link.
"""

import argparse
import json
import pathlib
import re
import subprocess

TEMPLATE = pathlib.Path(__file__).with_name("review_page.html")
TOK = re.compile(r"[A-Za-z0-9’']+")
WPS = 2.55  # narration speed, words per second (153 wpm)


def norm(t: str) -> str:
    return re.sub(r"[^a-z0-9]", "", t.lower())


def shot_lines(cuts: list[dict], pieces: list[dict]) -> list[str]:
    """Script text from each shot's anchor phrase up to the next shot's anchor."""
    text = " ".join(p["text"] for p in pieces)
    toks = [(norm(m.group()), m.start()) for m in TOK.finditer(text)]
    toks = [t for t in toks if t[0]]
    starts, pos = [], 0
    for c in cuts:
        p = [norm(w) for w in TOK.findall(c["at"]) if norm(w)]
        for i in range(pos, len(toks) - len(p) + 1):
            if [t[0] for t in toks[i:i + len(p)]] == p:
                starts.append(toks[i][1])
                pos = i + 1
                break
        else:
            raise SystemExit(f"anchor not found: {c['at']!r}")
    starts[0] = 0
    ends = starts[1:] + [len(text)]
    return [text[a:b].strip() for a, b in zip(starts, ends)]


def fit_line(line: str, dur: float) -> str:
    """The last anchor runs to the end of the script, past the end of a partial render: keep what the clip can say."""
    kept = []
    for sent in re.split(r"(?<=[.!?\"])\s+", line):
        if kept and sum(len(x.split()) for x in kept) + len(sent.split()) > dur * WPS * 1.25:
            break
        kept.append(sent)
    return " ".join(kept)


def mir_rows(episode: pathlib.Path, part: pathlib.Path, total: float) -> list[dict]:
    cuts = json.loads((part / "edit" / "cuts.json").read_text(encoding="utf-8"))
    pieces = json.loads((part / "audio" / "pieces.json").read_text(encoding="utf-8"))
    shots = json.loads((part / "shots.json").read_text(encoding="utf-8"))["shots"]
    titles = {s["id"]: s["title"] for s in json.loads((episode / "sections.json").read_text(encoding="utf-8"))}
    lines = shot_lines(cuts, pieces)
    rows = []
    for k, (c, s, line) in enumerate(zip(cuts, shots, lines)):
        dur = (total - c["start"]) if k == len(cuts) - 1 else c["dur"]
        rows.append({"id": c["id"], "n": c["shot"], "sec": c["sec"], "secTitle": titles.get(c["sec"], ""),
                     "start": round(c["start"], 2), "dur": round(dur, 2), "kind": s.get("kind", ""), "line": line})
    return rows


def clip_to_render(rows: list[dict], total: float) -> list[dict]:
    """A partial render (e.g. the first 5 minutes) holds only some shots: drop the rest, trim the last one to fit."""
    rows = [r for r in rows if r["start"] < total - 0.2]
    last = rows[-1]
    last["dur"] = round(total - last["start"], 2)
    last["line"] = fit_line(last["line"], last["dur"])
    return rows


def generic_rows(path: pathlib.Path, total: float) -> list[dict]:
    rows = []
    for k, c in enumerate(json.loads(path.read_text(encoding="utf-8"))):
        start, end = float(c["start"]), min(float(c.get("end", total)), total)
        rows.append({"id": c["id"], "n": k + 1, "sec": c.get("beat", ""), "secTitle": "", "start": round(start, 2),
                     "dur": round(end - start, 2), "kind": c.get("kind", ""), "line": c.get("text", "")})
    return rows


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("episode", type=pathlib.Path)
    ap.add_argument("part")
    ap.add_argument("--video", required=True, help="render, relative to the part folder")
    ap.add_argument("--title", required=True)
    ap.add_argument("--drive", default="", help="Drive viewUrl of the full-quality cut, linked at the top")
    ap.add_argument("--clips", default="", help="generic clip list JSON, relative to the part folder (skips the MiR files)")
    ap.add_argument("--tag", default="", help="version folder for the clips (new URLs, so browsers never show a cached old clip)")
    ap.add_argument("--collection", default="notes", help="db collection for this version's notes")
    ap.add_argument("--prev", default="", help="db collection of the previous version's notes, folded under each clip")
    args = ap.parse_args()
    part = args.episode / args.part
    out = part / "review"
    base = out / args.tag if args.tag else out
    (base / "clips").mkdir(parents=True, exist_ok=True)
    (base / "posters").mkdir(exist_ok=True)
    rel = f"{args.tag}/" if args.tag else ""
    video = part / args.video
    total = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                  str(video)], capture_output=True, text=True, check=True).stdout)
    rows = generic_rows(part / args.clips, total) if args.clips else mir_rows(args.episode, part, total)
    rows = clip_to_render(rows, total)

    for r in rows:
        start, dur = r["start"], r["dur"]
        clip, poster = base / "clips" / f"{r['id']}.mp4", base / "posters" / f"{r['id']}.jpg"
        if not clip.exists():
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{start:.3f}", "-i", str(video), "-t", f"{dur:.3f}",
                            "-vf", "scale=1280:720", "-c:v", "libx264", "-preset", "medium", "-crf", "27",
                            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
                            str(clip)], check=True)
        if not poster.exists():
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{start + min(dur * 0.6, dur - 0.1):.3f}",
                            "-i", str(video), "-frames:v", "1", "-vf", "scale=640:360", "-q:v", "5", str(poster)],
                           check=True)
        r["clip"], r["poster"] = f"{rel}clips/{r['id']}.mp4", f"{rel}posters/{r['id']}.jpg"
        print(f"  {r['id']} {start:7.2f} +{dur:5.2f}", flush=True)

    data = {"title": args.title, "drive": args.drive, "total": round(total, 2), "shots": rows,
            "collection": args.collection, "prev": args.prev}
    html = TEMPLATE.read_text(encoding="utf-8").replace("/*DATA*/null", json.dumps(data, ensure_ascii=False))
    html = html.replace("{{TITLE}}", args.title)
    (out / "index.html").write_text(html, encoding="utf-8")
    size = sum(f.stat().st_size for f in base.rglob("*") if f.is_file())
    print(f"Wrote {out / 'index.html'} ({len(rows)} clips, {size / 1e6:.1f} MB in review/)")


if __name__ == "__main__":
    main()
