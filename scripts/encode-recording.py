"""Encode real walkthroughs with gentle, eased camera pushes around recorded actions."""
from pathlib import Path
import json
import os
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'public/projects/reels'
CAPTURE = Path(os.environ.get('PORTFOLIO_CAPTURE_DIR', str(ROOT / '.artifacts/capture')))
OUTPUT.mkdir(parents=True, exist_ok=True)
FPS = 30

for slug in sys.argv[1:]:
    record = json.loads((CAPTURE / f'{slug}.json').read_text())
    raw, seconds = record['file'], record['seconds']
    raw_duration = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', raw]))
    start = max(0, raw_duration - seconds)
    duration = min(26, seconds)
    speed = duration / seconds
    camera = []
    for index, cue in enumerate(record.get('cues', [])[:2]):
        cue_start = max(1.2, min(duration - 5, cue['at'] * speed))
        if camera:
            cue_start = max(cue_start, camera[-1]['end'] + .8)
        if cue_start + 4.2 > duration - .5:
            continue
        camera.append({'start': round(cue_start, 3), 'end': round(cue_start + 4.2, 3), 'x': cue['x'] / 1440, 'y': cue['y'] / 900, 'scale': cue.get('scale', 1.15)})
    zoom = '1'
    cx, cy = 'iw/2', 'ih/2'
    for cue in reversed(camera):
        a, b = cue['start'], cue['end']
        active = f'between(on/{FPS},{a},{b})'
        pulse = f'{active}*pow(sin(PI*(on/{FPS}-{a})/({b}-{a})),2)'
        zoom += f'+{cue["scale"]-1:.4f}*{pulse}'
        cx = f'if({active},iw*{cue["x"]:.5f},{cx})'
        cy = f'if({active},ih*{cue["y"]:.5f},{cy})'
    x = f'max(0,min(iw-iw/zoom,({cx})-iw/(2*zoom)))'
    y = f'max(0,min(ih-ih/zoom,({cy})-ih/(2*zoom)))'
    filters = f"setpts={speed}*(PTS-STARTPTS),fps={FPS},scale=1920:-2,zoompan=z='{zoom}':x='{x}':y='{y}':d=1:s=1280x800:fps={FPS}"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(start), '-i', raw, '-an', '-filter_threads', '2', '-vf', filters, '-t', str(duration), '-c:v', 'libx264', '-crf', '22', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-threads', '2', str(OUTPUT / f'{slug}.mp4')], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(start + .8), '-i', raw, '-frames:v', '1', '-vf', 'scale=1280:-2', '-quality', '88', '-threads', '2', str(OUTPUT / f'{slug}.webp')], check=True)
    record.update({'file': f'/projects/reels/{slug}.mp4', 'poster': f'/projects/reels/{slug}.webp', 'duration': round(duration, 2), 'speed': round(1/speed, 2), 'camera': camera, 'type': 'Real public-site walkthrough with spring-smoothed cursor and eased camera zooms'})
    (OUTPUT / f'{slug}.json').write_text(json.dumps(record, indent=2) + '\n')
    print('ENCODED', slug, flush=True)
