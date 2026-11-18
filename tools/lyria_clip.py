#!/usr/bin/env python3
"""One 30-s Lyria 2 clip on Vertex AI (project from C:/Users/ash/youtube/.env, ADC credentials).
  python tools/lyria_clip.py out.wav "prompt" [--neg "..."] [--seed N]
"""
import argparse, base64, json, pathlib, re, urllib.request
import google.auth, google.auth.transport.requests
ap = argparse.ArgumentParser(); ap.add_argument("out"); ap.add_argument("prompt")
ap.add_argument("--neg", default="vocals, singing, choir voices, drums kit, electronic beat, distortion")
ap.add_argument("--seed", type=int, default=None); ap.add_argument("--model", default="lyria-002")
a = ap.parse_args()
env = dict(re.findall(r"^([A-Z_]+)=(.*)$", pathlib.Path("C:/Users/ash/youtube/.env").read_text(), re.M))
project = env["GOOGLE_CLOUD_PROJECT"].strip().strip('"')
creds, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
creds.refresh(google.auth.transport.requests.Request())
url = f"https://us-central1-aiplatform.googleapis.com/v1/projects/{project}/locations/us-central1/publishers/google/models/{a.model}:predict"
inst = {"prompt": a.prompt, "negative_prompt": a.neg}
if a.seed is not None: inst["seed"] = a.seed
req = urllib.request.Request(url, json.dumps({"instances": [inst], "parameters": {}}).encode(),
    {"Authorization": f"Bearer {creds.token}", "Content-Type": "application/json", "x-goog-user-project": project})
r = json.loads(urllib.request.urlopen(req, timeout=300).read())
p = r["predictions"][0]
b = p.get("bytesBase64Encoded") or p.get("audioContent")
pathlib.Path(a.out).write_bytes(base64.b64decode(b)); print("wrote", a.out)
