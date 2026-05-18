#!/usr/bin/env python3
"""📊 Bonanza Labs ✦ Analytics CLI."""

import click
from rich.console import Console
from rich.table import Table

console = Console()


@click.group()
@click.version_option(version="0.1.0", prog_name="bonanza-analytics")
def main():
    """📊 Bonanza Labs ✦ Analytics — AI-first analytics dashboard."""
    pass


@main.command()
@click.option("--site-id", "-s", required=True, help="Site ID")
def script(site_id):
    """Generate tracking script for your site."""
    from bonanza_analytics.core.engine import AnalyticsEngine
    engine = AnalyticsEngine()
    console.print("[bold]Add this to your <head>:[/]")
    console.print(engine.tracking_script(site_id))


@main.command()
@click.option("--site-id", "-s", required=True, help="Site ID")
@click.option("--period", "-p", default="7d", help="Period (1d, 7d, 30d)")
def summary(site_id, period):
    """Show analytics summary."""
    from bonanza_analytics.core.engine import AnalyticsEngine
    engine = AnalyticsEngine()
    s = engine.summary(site_id, period)
    console.print(f"[bold]📊 {site_id}[/] — Last {period}")
    console.print(f"   Page views: {s.page_views} | Unique: {s.unique_visitors} | Avg duration: {s.avg_duration_sec}s")
    if s.top_pages:
        table = Table(title="Top Pages")
        table.add_column("URL")
        table.add_column("Views", justify="right")
        for p in s.top_pages[:5]:
            table.add_row(p["url"][:50], str(p["views"]))
        console.print(table)


if __name__ == "__main__":
    main()