"""Compare rendered paper at both ends of real browser page turns.

Run after npm run test:book. Requires Pillow, also used for local visual QA.
"""
import json
import os
from pathlib import Path
from PIL import Image, ImageChops, ImageStat

root = Path(os.environ.get("PORTFOLIO_BOOK_QA_DIR", ".artifacts/book-redesign/qa"))
report = []
for direction in ["next", "previous"]:
    for before, after in [("before", "start"), ("end", "after")]:
        first = Image.open(root / f"{direction}-{before}.png").convert("RGB")
        second = Image.open(root / f"{direction}-{after}.png").convert("RGB")
        assert first.size == second.size, f"Book bounds changed: {direction} {before}/{after}"
        difference = ImageChops.difference(first, second)
        mean = sum(ImageStat.Stat(difference).mean) / 3
        report.append({"direction": direction, "frames": [before, after], "meanChannelDifference": round(mean, 5), "percentOfChannelRange": round(mean / 255 * 100, 4)})
        difference.save(root / f"{direction}-{before}-{after}-diff.png")
        # Allow small edge-antialiasing differences, but catch shifted content,
        # missing paper, opacity flashes, and a change in image sharpness.
        assert mean < 0.8, f"Visible page handoff difference: {direction} {before}/{after}: {mean:.4f}"
(root / "pixel-comparison.json").write_text(json.dumps(report, indent=2) + "\n")
print("PASS forward/backward start and finish frames: stable bounds, mean pixel difference below 0.32%")
