#!/usr/bin/env python3
"""🔍 Bonanza Labs ✦ Search CLI."""

import asyncio
import click
from rich.console import Console

console = Console()


@click.group()
@click.version_option(version="0.1.0", prog_name="bonanza-search")
def main():
    """🔍 Bonanza Labs ✦ Search — AI web search & extract."""
    pass


@main.command()
@click.argument("query")
@click.option("--max", "-m", default=5, help="Max results")
@click.option("--provider", "-p", default="duckduckgo")
def search(query, max, provider):
    """Search the web."""
    from bonanza_search.core.engine import WebSearchEngine

    engine = WebSearchEngine()
    resp = asyncio.run(engine.search(query, max, provider))
    for i, r in enumerate(resp.results, 1):
        console.print(f"[bold]{i}.[/] {r.title}")
        console.print(f"   [cyan]{r.url}[/]")
        if r.snippet:
            console.print(f"   {r.snippet[:100]}")
        console.print()


@main.command()
@click.argument("url")
@click.option("--max-chars", default=3000, help="Max characters to extract")
def extract(url, max_chars):
    """Extract text from a URL."""
    from bonanza_search.core.engine import WebSearchEngine

    engine = WebSearchEngine()
    result = asyncio.run(engine.extract(url, max_chars))
    if "error" in result:
        console.print(f"[red]❌ {result['error']}[/]")
    else:
        console.print(f"[bold]{result['title']}[/]")
        console.print(f"[cyan]{result['url']}[/] — {result['length']} chars")
        console.print(result["text"][:500] + "...")


if __name__ == "__main__":
    main()