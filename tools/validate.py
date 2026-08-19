from pathlib import Path
import json, subprocess, sys

root = Path(__file__).resolve().parents[1]
app = json.loads((root/'app.json').read_text(encoding='utf-8'))

for page in app['pages']:
    for ext in ['js','json','wxml','wxss']:
        p = root / f'{page}.{ext}'
        assert p.exists(), f'missing: {p}'

for p in root.rglob('*.json'):
    json.loads(p.read_text(encoding='utf-8'))

for p in root.rglob('*.js'):
    r = subprocess.run(['node','--check',str(p)], capture_output=True, text=True)
    if r.returncode:
        print(r.stderr)
        sys.exit(r.returncode)

assert (root/'custom-tab-bar/index.js').exists()
assert (root/'project.config.json').exists()
print('OK: JSON parsed, page files exist, JavaScript syntax valid.')
