"""🩺 Doctor command — delegates to Fork Doctor."""
import subprocess
import sys
from pathlib import Path


def run_check(repo, full=False):
    """Run Fork Doctor health checks on a repo."""
    fork_doctor = Path.home() / ".openclaw/workspace/fork-doctor-pkg/src/fork_doctor"

    if not fork_doctor.exists():
        return {"checks": [{"name": "fork-doctor", "passed": False, "message": "Fork Doctor not found. pip install fork-doctor"}]}

    try:
        cmd = [sys.executable, "-m", "fork_doctor", repo]
        if full:
            cmd.append("--full")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        import json
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return {"checks": [{"name": "parse", "passed": False, "message": result.stdout[:200]}]}
    except Exception as e:
        return {"checks": [{"name": "error", "passed": False, "message": str(e)}]}