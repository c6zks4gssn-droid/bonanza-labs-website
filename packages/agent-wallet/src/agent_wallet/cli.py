#!/usr/bin/env python3
"""💰 Agent Wallet CLI — Manage AI agent payments from the terminal."""

import click
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

from agent_wallet.core.models import ChainType, Policy
from agent_wallet.core.wallet_manager import WalletManager

console = Console()


@click.group()
@click.version_option(version="0.1.0", prog_name="agent-wallet")
def main():
    """💰 Agent Wallet — Policy-based payments for AI agents."""
    pass


@main.command()
@click.option("--name", "-n", required=True, help="Agent name")
@click.option("--chain", "-c", default="solana", type=click.Choice(["solana", "bsc", "base"]), help="Blockchain")
@click.option("--budget", "-b", default=500.0, type=float, help="Monthly budget (USD)")
@click.option("--auto-approve", default=5.0, type=float, help="Auto-approve under $X")
def create(name, chain, budget, auto_approve):
    """Create a new agent wallet."""
    mgr = WalletManager()
    policy = Policy(
        monthly_limit=budget,
        daily_limit=budget / 30,
        auto_approve_under=auto_approve,
        human_approval_above=auto_approve,
    )
    wallet = mgr.create_wallet(name, ChainType(chain), policy=policy)
    console.print(Panel(
        f"[bold green]✅ Wallet created![/]\n\n"
        f"Agent: {name}\n"
        f"ID: {wallet.id}\n"
        f"Chain: {chain}\n"
        f"Budget: ${budget}/mo\n"
        f"Auto-approve: under ${auto_approve}",
        title="💰 Agent Wallet",
    ))


@main.command(name="list")
def list_wallets():
    """List all agent wallets."""
    mgr = WalletManager()
    wallets = mgr.list_wallets()
    if not wallets:
        console.print("[yellow]No wallets found. Create one with:[/] agent-wallet create --name MyAgent")
        return

    table = Table(title="💰 Agent Wallets")
    table.add_column("ID", style="dim")
    table.add_column("Agent", style="bold")
    table.add_column("Chain")
    table.add_column("Spent/Month")
    table.add_column("Budget")
    table.add_column("Status")

    for w in wallets:
        status = "🟢 Active" if w.active else "🔴 Inactive"
        pct = (w.spent_month_usd / w.policy.monthly_limit * 100) if w.policy.monthly_limit > 0 else 0
        table.add_row(w.id[:12], w.agent_name, w.chain.value, f"${w.spent_month_usd:.2f} ({pct:.0f}%)", f"${w.policy.monthly_limit:.0f}", status)

    console.print(table)


@main.command()
@click.argument("wallet_id")
def balance(wallet_id):
    """Check wallet balance and spending."""
    mgr = WalletManager()
    wallet = mgr.load_wallet(wallet_id)
    if not wallet:
        console.print(f"[red]❌ Wallet {wallet_id} not found[/]")
        return

    remaining = wallet.policy.monthly_limit - wallet.spent_month_usd
    console.print(Panel(
        f"Agent: [bold]{wallet.agent_name}[/]\n"
        f"Chain: {wallet.chain.value}\n"
        f"Spent today: ${wallet.spent_today_usd:.2f} / ${wallet.policy.daily_limit:.2f}\n"
        f"Spent month: ${wallet.spent_month_usd:.2f} / ${wallet.policy.monthly_limit:.2f}\n"
        f"Remaining: [bold {'green' if remaining > 50 else 'red'}]${remaining:.2f}[/]",
        title=f"💰 {wallet_id[:12]}",
    ))


@main.command()
@click.argument("wallet_id")
@click.argument("amount", type=float)
@click.option("--recipient", "-r", required=True, help="Recipient address")
@click.option("--description", "-d", default="", help="Transaction description")
def pay(wallet_id, amount, recipient, description):
    """Propose a payment from a wallet."""
    mgr = WalletManager()
    try:
        txn, result = mgr.propose_transaction(wallet_id, amount, recipient, description)
        if result.allowed and result.approval_type.value == "auto":
            console.print(f"[bold green]✅ Auto-approved:[/] ${amount:.2f} → {recipient}")
        elif result.allowed:
            console.print(f"[bold yellow]⏳ Pending human approval:[/] ${amount:.2f} → {recipient}")
            console.print(f"   Approval ID: {result.request.id if result.request else 'N/A'}")
        else:
            console.print(f"[bold red]❌ Rejected:[/] {result.reason}")
    except ValueError as e:
        console.print(f"[red]{e}[/]")


@main.command()
@click.argument("wallet_id")
def analytics(wallet_id):
    """Show spending analytics."""
    mgr = WalletManager()
    data = mgr.get_analytics(wallet_id)
    if "error" in data:
        console.print(f"[red]{data['error']}[/]")
        return

    table = Table(title=f"📊 Analytics — {data['agent_name']}")
    table.add_column("Metric", style="bold")
    table.add_column("Value")
    for k, v in data.items():
        if k not in ("wallet_id", "agent_name"):
            table.add_row(k, str(v))
    console.print(table)


if __name__ == "__main__":
    main()