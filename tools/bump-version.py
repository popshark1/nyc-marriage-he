#!/usr/bin/env python3
"""Stamp every local script / stylesheet reference with ?v=<timestamp>.

Browsers (and the GitHub Pages CDN) cache JS for a while; without a new URL a
phone can end up running a fresh HTML page with yesterday's script.
Run this before each commit that changes code:  python3 tools/bump-version.py
"""
import re, time, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
v = time.strftime("%Y%m%d%H%M")
pat = re.compile(r'''((?:src|href)="|from ")((?!https?:|//|data:)[^"?#]+\.(?:js|css))(?:\?v=[0-9a-z]+)?"''')
for f in ["index.html", "stats.html", "games/wedding.html", "games/wedding.js"]:
    p = root / f; s = p.read_text(encoding="utf-8")
    n = pat.sub(lambda m: f'{m.group(1)}{m.group(2)}?v={v}"', s)
    if n != s: p.write_text(n, encoding="utf-8"); print("stamped", f)
print("version", v)
