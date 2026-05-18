#!/usr/bin/env python3
"""🤖 Bonanza Labs ✦ Agents CLI."""

import click
from rich.console import Console
from rich.table import Table

console = Console()


@click.group()
@click.version_option(version="0.2.1", prog_name="bonanza-agents")
def main():
    """🤖 Bonanza Labs ✦ Agents — AI agent orchestration."""
    pass


@main.command()
@click.option("--name", "-n", required=True, help="Agent name")
@click.option("--model", "-m", default="glm-5.1:cloud", help="LLM model")
@click.option("--budget", "-b", default=10.0, help="Budget limit in USD")
def create(name, model, budget):
    """Create a new agent."""
    from bonanza_agents.core.models import Agent, Tool, BUILT_IN_TOOLS
    agent = Agent(name=name, model=model, budget_limit_usd=budget, tools=list(BUILT_IN_TOOLS.values()))
    console.print(f"[bold green]✅ Agent created:[/] {agent.id}")
    console.print(f"   Name: {name} | Model: {model} | Budget: ${budget}")
    console.print(f"   Tools: {', '.join(BUILT_IN_TOOLS.keys())}")


@main.command()
def tools():
    """List available tools."""
    from bonanza_agents.core.models import BUILT_IN_TOOLS, ToolType
    table = Table(title="🛠️ Built-in Tools")
    table.add_column("Tool", style="bold")
    table.add_column("Type")
    table.add_column("Description")
    for t in BUILT_IN_TOOLS.values():
        table.add_row(t.name, t.type.value, t.description)
    console.print(table)


@main.command()
@click.option("--name", "-n", required=True, help="Workflow name")
def workflow(name):
    """Create a multi-agent workflow."""
    console.print(f"[bold]🔄 Workflow:[/] {name}")
    console.print("   Define steps in YAML config")
    console.print("   Run with: bonanza-agents run workflow.yaml")


@main.command()
def list_agents():
    """List all agents."""
    console.print("[bold]🤖 No agents yet.[/]")
    console.print("   Create one with: bonanza-agents create --name MyAgent")


@main.group()
def wallet():
    """Agent Wallet with Stripe Link CLI / MPP support."""
    pass


@wallet.command("status")
def wallet_status():
    """Check Stripe Link CLI auth status."""
    from bonanza_agents.wallet import LinkCLIClient

    client = LinkCLIClient()
    if not client.available():
        console.print("[red]npx/npm is not available. Install Node/npm first.[/]")
        return
    try:
        status = client.auth_status()
        authenticated = status.get("authenticated", False)
        color = "green" if authenticated else "yellow"
        console.print(f"[{color}]Link authenticated: {authenticated}[/]")
        if status.get("update"):
            console.print(f"Update: {status['update']}")
    except Exception as e:
        console.print(f"[red]Link CLI error: {e}[/]")


@wallet.command("login")
@click.option("--client-name", default="Bonanza Agent Wallet", help="Name shown in Link approval UI")
def wallet_login(client_name):
    """Start Link auth flow. User approves in Link."""
    from bonanza_agents.wallet import LinkCLIClient

    try:
        result = LinkCLIClient().login(client_name=client_name)
        console.print(result)
    except Exception as e:
        console.print(f"[red]Link login error: {e}[/]")


@wallet.command("payment-methods")
def wallet_payment_methods():
    """List Link payment methods."""
    from bonanza_agents.wallet import LinkCLIClient

    try:
        result = LinkCLIClient().list_payment_methods()
        console.print(result)
    except Exception as e:
        console.print(f"[red]Payment method error: {e}[/]")


@wallet.command("spend")
@click.option("--agent-id", default="agent_demo", help="Agent id requesting the spend")
@click.option("--payment-method-id", required=True, help="Link payment method id")
@click.option("--merchant-name", required=True, help="Merchant name")
@click.option("--merchant-url", required=True, help="Merchant URL")
@click.option("--context", required=True, help="Purchase context, at least 100 chars")
@click.option("--amount", required=True, type=int, help="Amount in cents")
@click.option("--currency", default="USD", help="ISO currency")
@click.option("--credential-type", default="virtual_card", type=click.Choice(["virtual_card", "shared_payment_token"]))
@click.option("--budget", default=100.0, type=float, help="Local wallet budget in USD")
@click.option("--test", is_flag=True, help="Use Link CLI test mode")
@click.option("--no-approval", is_flag=True, help="Create request without immediately requesting approval")
def wallet_spend(agent_id, payment_method_id, merchant_name, merchant_url, context, amount, currency, credential_type, budget, test, no_approval):
    """Create a budget-checked Link spend request."""
    from bonanza_agents.wallet import Wallet, WalletClient
    from bonanza_agents.wallet.models import CredentialType

    try:
        wallet_model = Wallet(agent_id=agent_id, budget_limit_usd=budget)
        client = WalletClient(wallet=wallet_model)
        result = client.create_spend_request(
            agent_id=agent_id,
            payment_method_id=payment_method_id,
            merchant_name=merchant_name,
            merchant_url=merchant_url,
            context=context,
            amount_cents=amount,
            currency=currency,
            credential_type=CredentialType(credential_type),
            request_approval=not no_approval,
            test=test,
        )
        console.print(result)
    except Exception as e:
        console.print(f"[red]Spend request error: {e}[/]")


@wallet.command("request")
@click.option("--agent-id", default="agent_demo", help="Agent id requesting spend")
@click.option("--merchant-name", required=True, help="Merchant/product name")
@click.option("--merchant-url", required=True, help="Merchant URL")
@click.option("--context", required=True, help="Why the agent wants to spend")
@click.option("--amount", required=True, type=int, help="Amount in cents")
@click.option("--currency", default="USD", help="ISO currency")
@click.option("--budget", default=100.0, type=float, help="Local budget in USD")
@click.option("--firewall", is_flag=True, help="Evaluate Spending Firewall before creating request")
@click.option("--allow-vendor", multiple=True, help="Allowed vendor/domain substring")
@click.option("--block-vendor", multiple=True, help="Blocked vendor/domain substring")
@click.option("--max-per-tx", default=2500, type=int, help="Firewall max per transaction in cents")
@click.option("--approval-threshold", default=1000, type=int, help="Require approval at/above cents")
def wallet_request(
    agent_id,
    merchant_name,
    merchant_url,
    context,
    amount,
    currency,
    budget,
    firewall,
    allow_vendor,
    block_vendor,
    max_per_tx,
    approval_threshold,
):
    """Create a manual approval spend request, optionally protected by Spending Firewall."""
    from bonanza_agents.wallet import ManualApprovalStore, Wallet
    from bonanza_agents.wallet.firewall import (
        FirewallAuditStore,
        FirewallDecision,
        SpendingFirewall,
        SpendingPolicy,
    )

    try:
        wallet_model = Wallet(agent_id=agent_id, budget_limit_usd=budget)
        req = ManualApprovalStore().create_request(
            wallet=wallet_model,
            agent_id=agent_id,
            merchant_name=merchant_name,
            merchant_url=merchant_url,
            context=context,
            amount_cents=amount,
            currency=currency,
        )
        if firewall:
            policy = SpendingPolicy(
                agent_id=agent_id,
                max_per_tx_cents=max_per_tx,
                approval_threshold_cents=approval_threshold,
                daily_limit_cents=int(budget * 100),
                monthly_limit_cents=int(budget * 100),
                allowed_vendors=list(allow_vendor),
                blocked_vendors=list(block_vendor),
                currency=currency.upper(),
            )
            evaluation = SpendingFirewall(policy).evaluate(req)
            FirewallAuditStore().append(evaluation)
            if evaluation.decision == FirewallDecision.DENY:
                ManualApprovalStore().deny(req.id)
                console.print("[red]Spending Firewall denied this request[/]")
                console.print(evaluation.model_dump(mode="json"))
                return
            console.print("[bold]Spending Firewall evaluation[/]")
            console.print(evaluation.model_dump(mode="json"))
            if evaluation.decision == FirewallDecision.REQUIRE_APPROVAL:
                console.print(evaluation.approval_message())
        console.print("[green]Manual approval request created[/]")
        console.print(req.model_dump(mode="json"))
        console.print(f"Approve with: bonanza-agents wallet approve {req.id}")
    except Exception as e:
        console.print(f"[red]Manual request error: {e}[/]")


@wallet.command("firewall-check")
@click.option("--agent-id", default="agent_demo", help="Agent id requesting spend")
@click.option("--merchant-name", required=True, help="Merchant/product name")
@click.option("--merchant-url", required=True, help="Merchant URL")
@click.option("--context", default="Firewall dry-run", help="Why the agent wants to spend")
@click.option("--amount", required=True, type=int, help="Amount in cents")
@click.option("--currency", default="USD", help="ISO currency")
@click.option("--allow-vendor", multiple=True, help="Allowed vendor/domain substring")
@click.option("--block-vendor", multiple=True, help="Blocked vendor/domain substring")
@click.option("--max-per-tx", default=2500, type=int, help="Max per transaction in cents")
@click.option("--daily-limit", default=10000, type=int, help="Daily limit in cents")
@click.option("--monthly-limit", default=100000, type=int, help="Monthly limit in cents")
@click.option("--approval-threshold", default=1000, type=int, help="Require approval at/above cents")
@click.option("--audit/--no-audit", default=True, help="Write evaluation to audit log")
def wallet_firewall_check(
    agent_id,
    merchant_name,
    merchant_url,
    context,
    amount,
    currency,
    allow_vendor,
    block_vendor,
    max_per_tx,
    daily_limit,
    monthly_limit,
    approval_threshold,
    audit,
):
    """Dry-run the Spending Firewall before any payment moves."""
    from bonanza_agents.wallet.firewall import FirewallAuditStore, SpendingFirewall, SpendingPolicy
    from bonanza_agents.wallet.models import SpendRequest

    req = SpendRequest(
        agent_id=agent_id,
        merchant_name=merchant_name,
        merchant_url=merchant_url,
        context=context,
        amount_cents=amount,
        currency=currency.upper(),
    )
    policy = SpendingPolicy(
        agent_id=agent_id,
        max_per_tx_cents=max_per_tx,
        daily_limit_cents=daily_limit,
        monthly_limit_cents=monthly_limit,
        approval_threshold_cents=approval_threshold,
        allowed_vendors=list(allow_vendor),
        blocked_vendors=list(block_vendor),
        currency=currency.upper(),
    )
    evaluation = SpendingFirewall(policy).evaluate(req)
    if audit:
        FirewallAuditStore().append(evaluation)
    color = "green" if evaluation.decision == "allow" else "yellow" if evaluation.decision == "require_approval" else "red"
    console.print(f"[{color}]Decision: {evaluation.decision.value} | Risk: {evaluation.risk_level.value} ({evaluation.risk_score}/100)[/]")
    console.print(evaluation.model_dump(mode="json"))
    if evaluation.decision == "require_approval":
        console.print(evaluation.approval_message())


@wallet.command("firewall-audit")
def wallet_firewall_audit():
    """List Spending Firewall audit events."""
    from bonanza_agents.wallet.firewall import FirewallAuditStore

    table = Table(title="Bonanza Spending Firewall Audit")
    table.add_column("ID")
    table.add_column("Decision")
    table.add_column("Risk")
    table.add_column("Merchant")
    table.add_column("Amount")
    for event in FirewallAuditStore().list_events():
        table.add_row(
            event.get("id", ""),
            event.get("decision", ""),
            f"{event.get('risk_level', '')} {event.get('risk_score', '')}",
            event.get("merchant_name", ""),
            f"{event.get('currency', 'USD')} {event.get('amount_cents', 0) / 100:.2f}",
        )
    console.print(table)


@wallet.command("approvals")
def wallet_approvals():
    """List manual approval requests."""
    from bonanza_agents.wallet import ManualApprovalStore

    table = Table(title="Agent Wallet Manual Approvals")
    table.add_column("ID")
    table.add_column("Status")
    table.add_column("Merchant")
    table.add_column("Amount")
    table.add_column("Agent")
    for req in ManualApprovalStore().list_requests():
        table.add_row(
            req.get("id", ""),
            req.get("status", ""),
            req.get("merchant_name", ""),
            f"{req.get('currency', 'USD')} {req.get('amount_cents', 0) / 100:.2f}",
            req.get("agent_id", ""),
        )
    console.print(table)


@wallet.command("approve")
@click.argument("request_id")
def wallet_approve(request_id):
    """Approve a manual spend request."""
    from bonanza_agents.wallet import ManualApprovalStore

    try:
        req = ManualApprovalStore().approve(request_id)
        console.print("[green]Approved[/]")
        console.print(req)
    except Exception as e:
        console.print(f"[red]Approval error: {e}[/]")


@wallet.command("deny")
@click.argument("request_id")
def wallet_deny(request_id):
    """Deny a manual spend request."""
    from bonanza_agents.wallet import ManualApprovalStore

    try:
        req = ManualApprovalStore().deny(request_id)
        console.print("[yellow]Denied[/]")
        console.print(req)
    except Exception as e:
        console.print(f"[red]Deny error: {e}[/]")


@wallet.command("checkout-test")
@click.argument("request_id")
@click.option("--stripe-key-path", default=None, help="Path to sk_test_* key file")
@click.option("--success-url", default="https://bonanza-labs.com/success")
@click.option("--cancel-url", default="https://bonanza-labs.com/cancel")
def wallet_checkout_test(request_id, stripe_key_path, success_url, cancel_url):
    """Create a Stripe Checkout session for an approved manual request using test key only."""
    from bonanza_agents.wallet import ManualApprovalStore, StripeCheckoutClient

    try:
        req = ManualApprovalStore().get_request(request_id)
        if req.get("status") != "approved":
            console.print("[red]Request must be approved before creating checkout.[/]")
            return
        client = StripeCheckoutClient.from_env_or_file(stripe_key_path)
        session = client.create_session(
            merchant_name=req.get("merchant_name", "Agent Wallet Demo"),
            amount_cents=int(req.get("amount_cents", 0)),
            currency=req.get("currency", "USD"),
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"bonanza_request_id": request_id, "agent_id": req.get("agent_id", "")},
            allow_live=False,
        )
        console.print("[green]Stripe Checkout test session created[/]")
        console.print({"id": session.get("id"), "url": session.get("url"), "mode": "test"})
    except Exception as e:
        console.print(f"[red]Checkout test error: {e}[/]")


@wallet.command("mpp-pay")
@click.argument("url")
@click.option("--spend-request-id", required=True, help="Approved Link spend request id")
@click.option("--method", default="GET", help="HTTP method")
@click.option("--data", default=None, help="JSON/body data")
def wallet_mpp_pay(url, spend_request_id, method, data):
    """Pay an MPP endpoint with an approved shared payment token."""
    from bonanza_agents.wallet import MPPClient

    try:
        result = MPPClient().pay(url, spend_request_id=spend_request_id, method=method, data=data)
        console.print(result)
    except Exception as e:
        console.print(f"[red]MPP payment error: {e}[/]")


@main.command()
def avatars():
    """List available HeyGen avatars."""
    try:
        from bonanza_agents.tools.avatar import HeyGenClient
        client = HeyGenClient()
        avatars = client.list_avatars()
        if not avatars:
            console.print("[yellow]No avatars found. Set HEYGEN_API_KEY.[/]")
            return
        table = Table(title="🎭 Available Avatars")
        table.add_column("ID", style="dim")
        table.add_column("Name", style="bold")
        table.add_column("Gender")
        table.add_column("Type")
        for a in avatars[:10]:
            table.add_row(a.avatar_id[:12] + "...", a.name, a.gender, a.type)
        console.print(table)
    except ValueError as e:
        console.print(f"[red]{e}[/]")
    except Exception as e:
        console.print(f"[red]Error: {e}[/]")


@main.command()
@click.argument("script")
@click.option("--anchor", "-a", default="female_pro", help="Anchor preset (female_pro, male_pro, female_casual, male_casual)")
@click.option("--format", "-f", default="16:9", help="Aspect ratio (16:9, 9:16)")
@click.option("--bg", default="#0a0a0f", help="Background hex color")
def news(script, anchor, format, bg):
    """Create an AI news video with human avatar."""
    try:
        from bonanza_agents.tools.avatar import HeyGenClient
        client = HeyGenClient()
        console.print(f"[bold]🎬 Creating news video...[/]")
        console.print(f"   Anchor: {anchor} | Format: {format}")
        result = client.create_news_video(script=script, anchor=anchor, aspect_ratio=format, background=bg)
        if result.error:
            console.print(f"[red]❌ {result.error}[/]")
            return
        console.print(f"[green]✅ Video created![/] ID: {result.video_id}")
        console.print(f"   Status: {result.status}")
        console.print(f"   Poll with: bonanza-agents status {result.video_id}")
    except ValueError as e:
        console.print(f"[red]{e}[/]")
    except Exception as e:
        console.print(f"[red]Error: {e}[/]")


@main.command()
@click.argument("video_id")
def status(video_id):
    """Check video generation status."""
    try:
        from bonanza_agents.tools.avatar import HeyGenClient
        client = HeyGenClient()
        result = client.get_video_status(video_id)
        console.print(f"Video: {result.video_id}")
        console.print(f"Status: {result.status}")
        if result.video_url:
            console.print(f"[green]URL: {result.video_url}[/]")
        if result.thumbnail_url:
            console.print(f"Thumbnail: {result.thumbnail_url}")
        if result.error:
            console.print(f"[red]Error: {result.error}[/]")
    except ValueError as e:
        console.print(f"[red]{e}[/]")
    except Exception as e:
        console.print(f"[red]Error: {e}[/]")


if __name__ == "__main__":
    main()
