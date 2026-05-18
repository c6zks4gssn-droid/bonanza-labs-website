"""Webhook handler for Stripe events."""

from __future__ import annotations
import json
from typing import Callable, Optional
from pydantic import BaseModel


class WebhookEvent(BaseModel):
    """Parsed webhook event."""
    id: str
    type: str
    data: dict = {}


# Event type constants
EVENT_CHECKOUT_COMPLETED = "checkout.session.completed"
EVENT_SUBSCRIPTION_CREATED = "customer.subscription.created"
EVENT_SUBSCRIPTION_UPDATED = "customer.subscription.updated"
EVENT_SUBSCRIPTION_DELETED = "customer.subscription.deleted"
EVENT_PAYMENT_SUCCEEDED = "invoice.payment_succeeded"
EVENT_PAYMENT_FAILED = "invoice.payment_failed"


class WebhookHandler:
    """Handle Stripe webhook events."""

    def __init__(self):
        self._handlers: dict[str, list[Callable]] = {}

    def on(self, event_type: str, handler: Callable):
        """Register a handler for an event type."""
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)

    def handle(self, event: WebhookEvent) -> list:
        """Process a webhook event, calling all registered handlers."""
        results = []
        handlers = self._handlers.get(event.type, [])
        for handler in handlers:
            try:
                result = handler(event)
                results.append({"handler": handler.__name__, "result": result, "ok": True})
            except Exception as e:
                results.append({"handler": handler.__name__, "error": str(e), "ok": False})
        return results

    @property
    def registered_events(self) -> list[str]:
        return list(self._handlers.keys())


# Global handler instance
webhook_handler = WebhookHandler()


# Default handlers
def on_checkout_completed(event: WebhookEvent):
    """Handle completed checkout — activate subscription."""
    session = event.data
    customer_email = session.get("customer_email", "")
    metadata = session.get("metadata", {})
    plan = metadata.get("plan", "free")
    product = metadata.get("product", "unknown")
    print(f"✅ Checkout completed: {customer_email} → {product} ({plan})")
    return {"email": customer_email, "plan": plan, "product": product}


def on_subscription_deleted(event: WebhookEvent):
    """Handle subscription cancellation — downgrade to free."""
    sub = event.data
    print(f"⚠️ Subscription cancelled: {sub.get('id', 'unknown')}")
    return {"action": "downgrade", "plan": "free"}


def on_payment_failed(event: WebhookEvent):
    """Handle failed payment — notify customer."""
    print(f"❌ Payment failed for subscription")
    return {"action": "notify"}


# Register defaults
webhook_handler.on(EVENT_CHECKOUT_COMPLETED, on_checkout_completed)
webhook_handler.on(EVENT_SUBSCRIPTION_DELETED, on_subscription_deleted)
webhook_handler.on(EVENT_PAYMENT_FAILED, on_payment_failed)