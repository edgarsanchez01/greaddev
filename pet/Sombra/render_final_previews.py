from pathlib import Path
from PIL import Image, ImageDraw
import importlib.util
import json

root = Path(__file__).parent
atlas = Image.open(root / 'final/spritesheet-extended.png').convert('RGBA')
out = root / 'qa/final-previews'
out.mkdir(parents=True, exist_ok=True)
spec = importlib.util.spec_from_file_location('preview', '/root/.codex/plugins/cache/openai-curated-remote/work-pets/0.1.6/skills/create-pet/scripts/render_animation_previews.py')
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
states = list(mod.ROW_DURATIONS)
all_frames, all_durations = [], []
raw = {}
for row, state in enumerate(states):
    duration = mod.ROW_DURATIONS[state]
    frames = [atlas.crop((col*192,row*208,(col+1)*192,(row+1)*208)) for col in range(len(duration))]
    raw[state] = frames
    dest = root / 'final-frames' / state
    dest.mkdir(parents=True, exist_ok=True)
    for col, im in enumerate(frames):
        im.save(dest / f'{col:02}.png')
    for im in frames:
        canvas = Image.new('RGB', (256,256), '#777777')
        canvas.paste(im, (32,24), im)
        ImageDraw.Draw(canvas).text((10,8), state, fill='white')
        all_frames.append(canvas)
    all_durations.extend(duration)
mod.save_preview(all_frames, all_durations, out / 'all-states.gif')
transition = raw['idle'] + raw['jumping'] + raw['idle']
mod.save_preview(transition, mod.ROW_DURATIONS['idle'] + mod.ROW_DURATIONS['jumping'] + mod.ROW_DURATIONS['idle'], out / 'idle-jump-idle.gif')
looks = [atlas.crop((col*192,row*208,(col+1)*192,(row+1)*208)) for row in [9,10] for col in range(8)]
mod.save_preview(looks, [180]*16, out / 'look-loop.gif')
proof = Image.new('RGB', (768,236), '#777777')
for i, (state, idx) in enumerate([('idle',0),('waving',2),('jumping',2),('review',2)]):
    im = raw[state][idx]
    proof.paste(im, (i*192,24), im)
    ImageDraw.Draw(proof).text((i*192+8,8), f'{state} / {idx}', fill='white')
proof.save(out / 'motion-stills.png')
import subprocess
subprocess.run(['ffmpeg','-y','-v','error','-i',str(out / 'all-states.gif'),'-pix_fmt','yuv420p','-movflags','+faststart',str(out / 'all-states.mp4')],check=True)
print(json.dumps({'frames':len(all_frames),'output':str(out)}))
