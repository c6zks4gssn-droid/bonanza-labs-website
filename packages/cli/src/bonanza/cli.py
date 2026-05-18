#!/usr/bin/env python3
"""Bonanza Labs CLI — One command for all tools."""

import click
from rich.console import Console

console = Console()


@click.group()
@click.version_option(version="0.2.0", prog_name="bonanza")
def main():
    """🧨 Bonanza Labs — AI tools for builders."""
    console.print("[bold violet]🧨 Bonanza Labs[/] — AI tools for builders", style="")


@main.command()
@click.argument("topic")
@click.option("--style", "-s", default="product", type=click.Choice(["corporate", "product", "viral", "explainer"]), help="Video style")
@click.option("--format", "-f", "fmt", default="16:9", type=click.Choice(["16:9", "9:16", "1:1"]), help="Video format")
@click.option("--duration", "-d", default=20, type=int, help="Duration in seconds")
@click.option("--voice", default="en-US-AriaNeural", help="Edge-TTS voice")
@click.option("--output", "-o", help="Output file path")
def video(topic, style, fmt, duration, voice, output):
    """🎬 Generate a video from a topic."""
    console.print(f"[bold]🎬 Generating video:[/] {topic}")
    console.print(f"   Style: {style} | Format: {fmt} | Duration: {duration}s | Voice: {voice}")

    try:
        from bonanza.commands.video import generate_video
        result = generate_video(topic, style, fmt, duration, voice, output)
        if result.get("success"):
            console.print(f"[bold green]✅ Video saved:[/] {result['video']}")
        else:
            console.print(f"[bold red]❌ Error:[/] {result.get('error', 'Unknown error')}")
    except ImportError:
        console.print("[yellow]⚠️ Video dependencies not installed. Run:[/] pip install bonanza-labs[video]")


@main.command()
@click.argument("repo", required=False)
@click.option("--full", is_flag=True, help="Run all 13 checks")
@click.option("--json", "as_json", is_flag=True, help="Output as JSON")
def doctor(repo, full, as_json):
    """🩺 Check repository health."""
    if not repo:
        repo = "."

    console.print(f"[bold]🩺 Checking:[/] {repo}")

    try:
        from bonanza.commands.doctor import run_check
        result = run_check(repo, full=full)
        if as_json:
            import json
            console.print(json.dumps(result, indent=2))
        else:
            for check in result.get("checks", []):
                status = "✅" if check["passed"] else "❌"
                console.print(f"  {status} {check['name']}: {check.get('message', '')}")
    except ImportError:
        console.print("[yellow]⚠️ Doctor dependencies not installed. Run:[/] pip install bonanza-labs[doctor]")


@main.command()
@click.argument("action", type=click.Choice(["create", "balance", "spend", "analytics"]))
@click.option("--chain", default="solana", type=click.Choice(["solana", "bsc", "base"]), help="Blockchain")
@click.option("--budget", default=50, type=float, help="Monthly budget in USD")
def wallet(action, chain, budget):
    """💰 Manage AI agent wallet."""
    console.print(f"[bold]💰 Wallet:[/] {action} on {chain}")

    try:
        from bonanza.commands.wallet import handle_action
        result = handle_action(action, chain, budget)
        console.print(result)
    except ImportError:
        console.print("[yellow]⚠️ Wallet dependencies not installed. Run:[/] pip install bonanza-labs[wallet]")


# Polymarket commands
try:
    from bonanza.commands.poly import poly
    main.add_command(poly)
except ImportError:
    pass

if __name__ == "__main__":
    main()