#!/usr/bin/env python3
"""🔐 Bonanza Labs ✦ Auth CLI."""

import click
from rich.console import Console

console = Console()


@click.group()
@click.version_option(version="0.1.0", prog_name="bonanza-auth")
def main():
    """🔐 Bonanza Labs ✦ Auth — AI agent authentication & identity."""
    pass


@main.command()
@click.option("--name", "-n", required=True, help="Agent name")
@click.option("--scopes", "-s", default="read", help="Comma-separated scopes")
def identity(name, scopes):
    """Create an agent identity."""
    from bonanza_auth.core.manager import AuthManager
    mgr = AuthManager()
    ident = mgr.create_identity(name=name, scopes=scopes.split(","))
    console.print(f"[bold green]✅ Identity created:[/] {ident.id}")
    console.print(f"   Name: {name} | Scopes: {scopes}")


@main.command()
@click.option("--agent-id", "-a", required=True, help="Agent ID")
@click.option("--scopes", "-s", default="read", help="Comma-separated scopes")
def key(agent_id, scopes):
    """Create an API key for an agent."""
    from bonanza_auth.core.manager import AuthManager
    mgr = AuthManager()
    ak, raw = mgr.create_api_key(agent_id=agent_id, scopes=scopes.split(","))
    console.print(f"[bold green]✅ API Key created:[/] {ak.prefix}...")
    console.print(f"[bold yellow]⚠️ Save this key (shown once):[/] {raw}")
    console.print(f"   Scopes: {scopes} | Expires: {ak.expires_at[:10]}")


@main.command()
@click.option("--agent-id", "-a", required=True, help="Agent ID")
def token(agent_id):
    """Create a JWT for agent-to-agent auth."""
    from bonanza_auth.core.manager import AuthManager
    mgr = AuthManager()
    ident = mgr.create_identity(name="agent")
    tok = mgr.create_jwt(agent_id=ident.id)
    console.print(f"[bold green]✅ JWT created[/]")
    console.print(f"   [dim]{tok.token[:50]}...[/]")
    console.print(f"   Expires: {tok.expires_at[:10]}")


if __name__ == "__main__":
    main()