#!/usr/bin/env python3
"""💳 Bonanza Labs Pay CLI — Stripe + Stablecoin payments."""

import click
from rich.console import Console
from rich.table import Table

console = Console()


@click.group()
@click.version_option(version="0.1.0", prog_name="bonanza-pay")
def main():
    """💳 Bonanza Labs Pay — Stripe + Stablecoin payment framework."""
    pass


@main.command()
@click.argument("product", type=click.Choice(["frameforge", "fork_doctor", "agent_wallet"]))
def plans(product):
    """Show pricing plans for a product."""
    from bonanza_pay.pricing.plans import ProductName, list_plans

    prods = ProductName(product)
    plan_list = list_plans(prods)

    table = Table(title=f"💳 {product.replace('_', ' ').title()} Plans")
    table.add_column("Plan", style="bold")
    table.add_column("Price")
    table.add_column("Features")

    for p in plan_list:
        price = "Free" if p.price_usd == 0 else f"${p.price_usd}/mo"
        feats = " • ".join(p.features[:4])
        table.add_row(p.name.value.upper(), price, feats)

    console.print(table)


@main.command()
@click.argument("product", type=click.Choice(["frameforge", "fork_doctor", "agent_wallet"]))
@click.option("--price-id", required=True, help="Stripe price ID")
@click.option("--email", help="Customer email")
def checkout(product, price_id, email):
    """Create a Stripe checkout session."""
    from bonanza_pay.core.stripe_client import StripeClient

    stripe = StripeClient()
    if not stripe.config.secret_key:
        console.print("[red]❌ STRIPE_SECRET_KEY not set[/]")
        return

    result = stripe.create_checkout_session(
        price_id=price_id,
        success_url="https://bonanza-labs.io/success",
        cancel_url="https://bonanza-labs.io/cancel",
        customer_email=email or None,
    )
    console.print(f"[bold green]✅ Checkout created:[/]")
    console.print(f"   URL: {result['url']}")
    console.print(f"   Session: {result['session_id']}")


@main.command()
@click.argument("amount", type=float)
@click.option("--coin", default="usdc", type=click.Choice(["usdc", "usdt", "usd1"]))
@click.option("--network", default="solana", type=click.Choice(["solana", "ethereum", "base", "bsc", "polygon"]))
def crypto(amount, coin, network):
    """Create a stablecoin payment."""
    from bonanza_pay.core.crypto import StablecoinHandler, CryptoPaymentRequest, StablecoinType, CryptoNetwork

    handler = StablecoinHandler()
    req = CryptoPaymentRequest(
        amount_usd=amount,
        coin=StablecoinType(coin),
        network=CryptoNetwork(network),
    )
    result = handler.create_payment(req)

    console.print(f"[bold]🪙 Stablecoin Payment[/]")
    console.print(f"   Amount: ${amount} {coin.upper()}")
    console.print(f"   Network: {network}")
    if result.checkout_url:
        console.print(f"   Checkout: {result.checkout_url}")
    elif result.deposit_address:
        console.print(f"   Deposit to: {result.deposit_address}")
        console.print(f"   Token: {handler.get_token_address(req.coin, req.network)}")


@main.command()
@click.argument("product", type=click.Choice(["frameforge", "fork_doctor", "agent_wallet"]))
@click.option("--free-users", default=100, type=int)
@click.option("--pro-users", default=10, type=int)
@click.option("--enterprise-users", default=1, type=int)
def revenue(product, free_users, pro_users, enterprise_users):
    """Estimate monthly revenue."""
    from bonanza_pay.pricing.plans import ProductName
    from bonanza_pay.pricing.calculator import estimate_revenue

    result = estimate_revenue(ProductName(product), free_users, pro_users, enterprise_users)
    console.print(f"[bold]📊 Revenue Estimate — {product.replace('_', ' ').title()}[/]")
    console.print(f"   Free: {free_users} | Pro: {pro_users} | Enterprise: {enterprise_users}")
    console.print(f"   Pro revenue: ${result['revenue']['pro']}/mo")
    console.print(f"   Enterprise revenue: ${result['revenue']['enterprise']}/mo")
    console.print(f"   [bold green]Total: ${result['revenue']['total']}/mo[/]")
    console.print(f"   Conversion: {result['conversion_rate']:.1f}%")


if __name__ == "__main__":
    main()