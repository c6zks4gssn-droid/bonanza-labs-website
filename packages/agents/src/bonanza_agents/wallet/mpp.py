"""Machine Payments Protocol helper for Bonanza Agent Wallet."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .link_cli import LinkCLIClient


@dataclass
class MPPClient:
    """Pay HTTP 402/Machine Payments Protocol endpoints via Stripe Link CLI."""

    link: LinkCLIClient | None = None

    def __post_init__(self) -> None:
        if self.link is None:
            self.link = LinkCLIClient()

    def pay(
        self,
        url: str,
        *,
        spend_request_id: str,
        method: str = "GET",
        data: str | None = None,
        headers: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        """Pay an MPP endpoint using an approved shared-payment-token spend request."""
        args = ["mpp", "pay", url, "--spend-request-id", spend_request_id, "--method", method.upper()]
        if data:
            args.extend(["--data", data])
        for key, value in (headers or {}).items():
            args.extend(["--header", f"{key}: {value}"])
        assert self.link is not None
        return self.link.run(*args)

    def decode_challenge(self, challenge: str) -> dict[str, Any]:
        """Decode a WWW-Authenticate MPP challenge."""
        assert self.link is not None
        return self.link.run("mpp", "decode", "--challenge", challenge)
