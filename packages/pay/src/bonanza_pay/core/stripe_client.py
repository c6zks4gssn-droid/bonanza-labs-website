"""Stripe client — wraps Stripe Python SDK for checkout, subscriptions, webhooks."""

from __future__ import annotations
import os
from typing import Optional
from pydantic import BaseModel

# Stripe will be imported at runtime to avoid import error without API key


class StripeConfig(BaseModel):
    """Stripe configuration."""
    secret_key: str = ""
    publishable_key: str = ""
    webhook_secret: str = ""
    api_version: str = "2024-12-18.acacia"


class StripeClient:
    """Wrapper around Stripe Python SDK."""

    def __init__(self, config: Optional[StripeConfig] = None):
        self.config = config or StripeConfig(
            secret_key=os.getenv("STRIPE_SECRET_KEY", ""),
            publishable_key=os.getenv("STRIPE_PUBLISHABLE_KEY", ""),
            webhook_secret=os.getenv("STRIPE_WEBHOOK_SECRET", ""),
        )
        self._stripe = None

    def _get_stripe(self):
        """Lazily import and configure stripe."""
        if self._stripe is None:
            import stripe
            stripe.api_key = self.config.secret_key
            stripe.api_version = self.config.api_version
            self._stripe = stripe
        return self._stripe

    # ─── Checkout ───

    def create_checkout_session(
        self,
        price_id: str,
        success_url: str,
        cancel_url: str,
        customer_email: Optional[str] = None,
        mode: str = "subscription",  # or "payment" for one-time
        metadata: dict = None,
    ) -> dict:
        """Create a Stripe Checkout Session."""
        stripe = self._get_stripe()
        params = {
            "mode": mode,
            "line_items": [{"price": price_id, "quantity": 1}],
            "success_url": success_url,
            "cancel_url": cancel_url,
        }
        if customer_email:
            params["customer_email"] = customer_email
        if metadata:
            params["metadata"] = metadata

        session = stripe.checkout.Session.create(**params)
        return {
            "session_id": session.id,
            "url": session.url,
            "mode": session.mode,
        }

    def create_payment_link(
        self,
        price_id: str,
        label: str = "Subscribe",
    ) -> dict:
        """Create a Stripe Payment Link (shareable URL)."""
        stripe = self._get_stripe()
        link = stripe.PaymentLink.create(
            line_items=[{"price": price_id, "quantity": 1}],
        )
        return {"id": link.id, "url": link.url}

    # ─── Products & Prices ───

    def create_product(self, name: str, description: str = "", metadata: dict = None) -> dict:
        """Create a Stripe product."""
        stripe = self._get_stripe()
        params = {"name": name}
        if description:
            params["description"] = description
        if metadata:
            params["metadata"] = metadata
        product = stripe.Product.create(**params)
        return {"id": product.id, "name": product.name}

    def create_price(
        self,
        product_id: str,
        amount_usd: float,
        recurring: bool = True,
        nickname: str = "",
    ) -> dict:
        """Create a Stripe price for a product."""
        stripe = self._get_stripe()
        params = {
            "product": product_id,
            "unit_amount": int(amount_usd * 100),  # cents
            "currency": "usd",
        }
        if recurring:
            params["recurring"] = {"interval": "month"}
        if nickname:
            params["nickname"] = nickname

        price = stripe.Price.create(**params)
        return {"id": price.id, "product": product_id, "amount": amount_usd}

    # ─── Subscriptions ───

    def list_subscriptions(self, customer_id: str = None, status: str = "active") -> list[dict]:
        """List subscriptions."""
        stripe = self._get_stripe()
        params = {"status": status}
        if customer_id:
            params["customer"] = customer_id
        subs = stripe.Subscription.list(**params)
        return [{"id": s.id, "status": s.status, "plan": s.plan.id if s.plan else None} for s in subs.auto_paging_iter()]

    def cancel_subscription(self, subscription_id: str) -> dict:
        """Cancel a subscription."""
        stripe = self._get_stripe()
        sub = stripe.Subscription.delete(subscription_id)
        return {"id": sub.id, "status": sub.status}

    # ─── Stablecoin (Stripe Crypto) ───

    def create_crypto_payment(
        self,
        amount_usd: float,
        networks: list[str] = None,
        description: str = "",
        metadata: dict = None,
    ) -> dict:
        """Create a crypto payment session (USDC/USDT via Stripe Crypto).

        Networks: solana, ethereum, base, polygon
        """
        stripe = self._get_stripe()
        # Use Stripe's crypto payment method
        params = {
            "amount": int(amount_usd * 100),
            "currency": "usd",
            "payment_method_types": ["crypto"],
            "mode": "payment",
            "success_url": "https://bonanza-labs.io/success",
            "cancel_url": "https://bonanza-labs.io/cancel",
        }
        if metadata:
            params["metadata"] = metadata

        session = stripe.checkout.Session.create(**params)
        return {
            "session_id": session.id,
            "url": session.url,
            "amount_usd": amount_usd,
        }

    # ─── Webhooks ───

    def verify_webhook(self, payload: bytes, sig_header: str) -> dict:
        """Verify and parse a Stripe webhook event."""
        stripe = self._get_stripe()
        event = stripe.Webhook.construct_event(
            payload, sig_header, self.config.webhook_secret
        )
        return {"id": event.id, "type": event.type, "data": event.data}