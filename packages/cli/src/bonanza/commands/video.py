"""🎬 Video generation command — delegates to FrameForge pipeline."""
import subprocess
import sys
from pathlib import Path


def generate_video(topic, style="product", fmt="16:9", duration=20, voice="en-US-AriaNeural", output=None):
    """Generate a video using FrameForge pipeline."""
    frameforge = Path.home() / ".openclaw/workspace/frameforge/pipeline.py"

    if not frameforge.exists():
        return {"success": False, "error": "FrameForge not found. Install from https://github.com/c6zks4gssn-droid/bonanza-labs-frameforge"}

    cmd = [sys.executable, str(frameforge), topic, "--style", style, "--format", fmt]
    if output:
        cmd.extend(["--output", output])

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if result.returncode == 0:
            # Find the output file
            for line in result.stdout.split("\n"):
                if "Final video:" in line or "Done!" in line:
                    path = line.split("→")[-1].strip() if "→" in line else ""
                    if path and Path(path).exists():
                        return {"success": True, "video": path}
            return {"success": True, "video": "Video generated (check output)"}
        return {"success": False, "error": result.stderr[-500:]}
    except subprocess.TimeoutExpired:
        return {"success": False, "error": "Render timed out"}
    except Exception as e:
        return {"success": False, "error": str(e)}