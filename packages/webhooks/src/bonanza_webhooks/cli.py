#!/usr/bin/env python3
"""📡 Bonanza Labs ✦ Webhooks CLI."""

import click
from rich.console import Console
from rich.table import Table

console = Console()


@click.group()
@click.version_option(version="0.1.0", prog_name="bonanza-webhooks")
def main():
    """📡 Bonanza Labs ✦ Webhooks — Webhook hub for AI agents."""
    pass


@main.command()
@click.option("--path", "-p", required=True, help="Webhook path (e.g. /webhooks/github)")
@click.option("--agent", "-a", default="", help="Agent ID to notify")
@click.option("--secret", "-s", default="", help="HMAC secret")
def register(path, agent, secret):
    """Register a webhook endpoint."""
    from bonanza_webhooks.core.hub import WebhookHub
    hub = WebhookHub()
    ep = hub.register_endpoint(path=path, agent_id=agent, secret=secret)
    console.print(f"[bold green]✅ Endpoint registered:[/] {ep.id}")
    console.print(f"   Path: {path} | Agent: {agent or 'none'}")


@main.command()
def list_eps():
    """List all webhook endpoints."""
    from bonanza_webhooks.core.hub import WebhookHub
    hub = WebhookHub()
    eps = hub.list_endpoints()
    if not eps:
        console.print("[yellow]No endpoints yet.[/]")
        return
    table = Table(title="📡 Webhook Endpoints")
    table.add_column("ID", style="dim")
    table.add_column("Path", style="bold")
    table.add_column("Agent")
    table.add_column("Calls")
    for ep in eps:
        table.add_row(ep.id[:8], ep.path, ep.agent_id or "-", str(ep.call_count))
    console.print(table)


@main.command()
def events():
    """Show recent webhook events."""
    from bonanza_webhooks.core.hub import WebhookHub
    hub = WebhookHub()
    evts = hub.list_events()
    if not evts:
        console.print("[yellow]No events yet.[/]")
        return
    for e in evts[-10:]:
        status = "✅" if e.verified else "⚠️"
        console.print(f"{status} [{e.source}] {e.event_type} — {e.created_at}")


if __name__ == "__main__":
    main()