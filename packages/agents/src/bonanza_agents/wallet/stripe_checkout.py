"""Stripe Checkout fallback for Bonanza Agent Wallet demos.

Uses Stripe Checkout test mode by default. The caller must provide a Stripe secret key
through STRIPE_SECRET_KEY or --stripe-key-path. Never print the key.
"""

from __future__ import annotations

import json
import os
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any


class StripeCheckoutError(RuntimeError):
    """Raised when Stripe Checkout session creation fails."""


@dataclass
class StripeCheckoutClient:
    """Minimal Stripe Checkout API client using stdlib only."""

    secret_key: str | None = None
    api_base: str = "https://api.stripe.com/v1"

    @classmethod
    def from_env_or_file(cls, key_path: str | None = None) -> "StripeCheckoutClient":
        key = os.environ.get("STRIPE_SECRET_KEY")
        if not key and key_path:
            p = Path(key_path).expanduser()
            if p.exists():
                key = p.read_text().strip()
        if not key:
            default = Path.home() / ".openclaw" / "secrets" / "stripe-secret-key"
            if default.exists():
                key = default.read_text().strip()
        if not key:
            raise StripeCheckoutError("No Stripe secret key found. Use test key via STRIPE_SECRET_KEY or --stripe-key-path.")
        return cls(secret_key=key)

    def is_test_key(self) -> bool:
        return bool(self.secret_key and self.secret_key.startswith("sk_test_"))

    def create_session(
        self,
        *,
        merchant_name: str,
        amount_cents: int,
        currency: str = "usd",
        success_url: str = "https://bonanza-labs.com/success",
        cancel_url: str = "https://bonanza-labs.com/cancel",
        metadata: dict[str, str] | None = None,
        allow_live: bool = False,
    ) -> dict[str, Any]:
        if not self.secret_key:
            raise StripeCheckoutError("Stripe secret key missing.")
        if not allow_live and not self.is_test_key():
            raise StripeCheckoutError("Refusing to use a live Stripe key. Provide sk_test_* or pass allow_live=True explicitly.")

        payload: dict[str, str] = {
            "mode": "payment",
            "success_url": success_url,
            "cancel_url": cancel_url,
            "line_items[0][quantity]": "1",
            "line_items[0][price_data][currency]": currency.lower(),
            "line_items[0][price_data][unit_amount]": str(amount_cents),
            "line_items[0][price_data][product_data][name]": merchant_name,
        }
        for key, value in (metadata or {}).items():
            payload[f"metadata[{key}]"] = str(value)

        body = urllib.parse.urlencode(payload).encode()
        req = urllib.request.Request(
            f"{self.api_base}/checkout/sessions",
            data=body,
            headers={
                "Authorization": f"Bearer {self.secret_key}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                return json.loads(response.read().decode())
        except Exception as exc:
            raise StripeCheckoutError(f"Stripe Checkout session failed: {exc}") from exc
