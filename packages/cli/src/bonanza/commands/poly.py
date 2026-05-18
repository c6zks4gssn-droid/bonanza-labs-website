"""Polymarket trading commands for Bonanza CLI"""
import click
import subprocess
import sys


@click.group("poly")
def poly():
    """🦞 Polymarket trading commands"""
    pass


@poly.command("markets")
@click.option("--limit", default=20, help="Number of markets to show")
def markets(limit):
    """List active prediction markets"""
    _run(["markets", "--limit", str(limit)])


@poly.command("search")
@click.argument("query")
def search(query):
    """Search markets by keyword"""
    _run(["search", query])


@poly.command("analyze")
@click.argument("question")
def analyze(question):
    """AI analysis of a market"""
    _run(["analyze", question])


@poly.command("debate")
@click.argument("question")
def debate(question):
    """Bull/Bear AI debate on a market"""
    _run(["debate", question])


@poly.command("signals")
@click.option("--limit", default=15, help="Number of markets to scan")
@click.option("--min-volume", default=100000, help="Minimum 24h volume")
def signals(limit, min_volume):
    """Scan markets for AI trading signals"""
    _run(["signals", "--limit", str(limit), "--min-volume", str(min_volume)])


@poly.command("monitor")
@click.option("--keywords", multiple=True, help="Filter keywords")
@click.option("--interval", default=300, help="Check interval in seconds")
def monitor(keywords, interval):
    """Continuous monitoring with AI alerts"""
    args = ["monitor", "--interval", str(interval)]
    for kw in keywords:
        args.extend(["--keywords", kw])
    _run(args)


def _run(args):
    """Run bonanza_polybot.py with given arguments"""
    script = str(_get_script_path())
    result = subprocess.run(
        [sys.executable, script] + args,
        cwd=str(script.parent)
    )
    sys.exit(result.returncode)


def _get_script_path():
    from pathlib import Path
    return Path(__file__).parent.parent.parent.parent / "polymarket-bot" / "bonanza_polybot.py"