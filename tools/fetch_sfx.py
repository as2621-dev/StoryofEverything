#!/usr/bin/env python3
"""Fetch the Old Routes SFX palette from Openverse (CC0 / CC BY only) into trade-routes/assets/sfx/.
Writes manifest.json (name -> takes with file, duration, licence, credit) and CREDITS.md.
  python tools/fetch_sfx.py
"""
import json, pathlib, time, urllib.parse, urllib.request
OUT = pathlib.Path(__file__).resolve().parents[1] / "assets" / "sfx"
OUT.mkdir(parents=True, exist_ok=True)
PALETTE = {  # name: (query, max seconds, takes)
 "paper_slide": ("paper slide", 2.5, 3), "paper_rustle": ("paper rustle", 3, 2), "stamp": ("rubber stamp", 1.5, 2),
 "quill": ("quill pen writing", 6, 2), "scroll": ("paper unroll", 4, 2), "waves": ("ocean waves calm", 40, 2),
 "splash": ("water splash", 3, 2), "cannon": ("cannon shot", 6, 3), "musket": ("musket shot", 3, 2),
 "ship_creak": ("wooden ship creak", 20, 2), "coins": ("coins clink", 3, 3), "tree_fall": ("tree falling", 8, 2),
 "clock_tick": ("clock ticking", 10, 1), "flag": ("flag flapping wind", 12, 1), "wind": ("night wind", 40, 1),
 "gulls": ("seagulls harbor", 20, 1), "march": ("marching footsteps", 10, 2), "oars": ("rowing oars boat", 12, 2),
 "grater": ("cheese grater", 4, 2), "mug": ("ceramic mug on table", 2, 2), "fire": ("fire crackling", 15, 1),
 "seal_wax": ("wax seal", 3, 1), "sword": ("sword unsheathe", 3, 1), "thud": ("wood thud", 1.5, 2),
 "steam": ("kettle steam", 6, 1), "sack": ("sack drop", 2, 2), "bell": ("ship bell", 4, 1),
}
UA = {"User-Agent": "old-routes-sfx/1.0"}
manifest, credits = {}, ["# SFX credits (Openverse; CC0 and CC BY only)\n"]
for name, (q, maxs, takes) in PALETTE.items():
    url = "https://api.openverse.org/v1/audio/?" + urllib.parse.urlencode({"q": q, "license": "cc0,by", "page_size": 20})
    try:
        res = json.loads(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read())["results"]
    except Exception as e:
        print("search failed", name, e); time.sleep(4); continue
    ok = [r for r in res if r.get("duration") and 300 <= r["duration"] <= maxs * 1000 and r["license"] in ("cc0", "by")]
    ok.sort(key=lambda r: 0 if r["license"] == "cc0" else 1)  # stable: keeps relevance within licence
    got = []
    for r in ok[:takes]:
        ext = r.get("filetype") or "mp3"
        f = OUT / f"{name}_{len(got)+1}.{ext}"
        try:
            f.write_bytes(urllib.request.urlopen(urllib.request.Request(r["url"], headers=UA), timeout=60).read())
        except Exception as e:
            print("dl failed", name, e); continue
        lic = "CC0" if r["license"] == "cc0" else f"CC BY {r.get('license_version','')}".strip()
        cred = f'"{r["title"]}" by {r.get("creator","unknown")}, {lic}, {r.get("foreign_landing_url","")}'
        got.append({"file": f.name, "duration": r["duration"] / 1000, "license": r["license"], "credit": cred, "title": r["title"]})
        if r["license"] != "cc0": credits.append(f"- {f.name}: {cred}")
    manifest[name] = got
    print(name, len(got), [g["title"][:30] for g in got])
    time.sleep(3.2)  # anonymous limit: 20 searches a minute
(OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False), encoding="utf-8")
(OUT / "CREDITS.md").write_text("\n".join(credits) + "\n", encoding="utf-8")
