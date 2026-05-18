"""Stripe Link CLI adapter for Bonanza Agent Wallet.

This wraps `@stripe/link-cli` without storing payment credentials in Bonanza.
Live payment credential approval remains inside Stripe Link.
"""

from __future__ import annotations

import json
import shutil
import subprocess
from dataclasses import dataclass
from typing import Any


class LinkCLIError(RuntimeError):
    """Raised when Link CLI fails."""


@dataclass
class LinkCLIClient:
    """Thin wrapper around Stripe's Link CLI.

    By default this uses `npx @stripe/link-cli` so users do not need a global install.
    Set command=("link-cli",) if installed globally.
    """

    command: tuple[str, ...] = ("npx", "-y", "@stripe/link-cli")
    timeout_seconds: int = 120

    def available(self) -> bool:
        """Return True if the configured runner is available."""
        return shutil.which(self.command[0]) is not None

    def run(self, *args: str, include_json: bool = True) -> dict[str, Any]:
        """Run link-cli and parse JSON output when requested."""
        cmd = [*self.command, *args]
        if include_json and "--format" not in args:
            cmd.extend(["--format", "json"])

        proc = subprocess.run(
            cmd,
            text=True,
            capture_output=True,
            timeout=self.timeout_seconds,
            check=False,
        )
        if proc.returncode != 0:
            message = proc.stderr.strip() or proc.stdout.strip() or "Link CLI command failed"
            raise LinkCLIError(message)

        output = proc.stdout.strip()
        if not include_json:
            return {"ok": True, "output": output}
        if not output:
            return {"ok": True}
        try:
            parsed = json.loads(output)
        except json.JSONDecodeError as exc:
            raise LinkCLIError(f"Expected JSON from Link CLI, got: {output[:500]}") from exc
        # Some Link CLI commands return a one-item JSONL-style array. Normalize it for callers.
        if isinstance(parsed, list) and len(parsed) == 1 and isinstance(parsed[0], dict):
            return parsed[0]
        return parsed

    def auth_status(self) -> dict[str, Any]:
        return self.run("auth", "status")

    def login(self, client_name: str = "Bonanza Agent Wallet") -> dict[str, Any]:
        return self.run("auth", "login", "--client-name", client_name)

    def list_payment_methods(self) -> dict[str, Any]:
        return self.run("payment-methods", "list")

    def create_spend_request(
        self,
        *,
        payment_method_id: str,
        merchant_name: str,
        merchant_url: str,
        context: str,
        amount_cents: int,
        currency: str = "USD",
        line_items: list[str] | None = None,
        totals: list[str] | None = None,
        credential_type: str = "virtual_card",
        request_approval: bool = True,
        test: bool = False,
    ) -> dict[str, Any]:
        if len(context) < 100:
            raise ValueError("Link CLI requires context to be at least 100 characters.")
        if amount_cents > 50_000:
            raise ValueError("Link CLI spend requests are capped at 50000 cents.")

        args = [
            "spend-request",
            "create",
            "--payment-method-id",
            payment_method_id,
            "--merchant-name",
            merchant_name,
            "--merchant-url",
            merchant_url,
            "--context",
            context,
            "--amount",
            str(amount_cents),
            "--currency",
            currency.upper(),
            "--credential-type",
            credential_type,
        ]
        for item in line_items or []:
            args.extend(["--line-item", item])
        for total in totals or []:
            args.extend(["--total", total])
        if request_approval:
            args.append("--request-approval")
        if test:
            args.append("--test")
        return self.run(*args)

    def retrieve_spend_request(
        self,
        spend_request_id: str,
        *,
        include_card: bool = False,
        interval_seconds: int | None = None,
        max_attempts: int | None = None,
    ) -> dict[str, Any]:
        args = ["spend-request", "retrieve", spend_request_id]
        if include_card:
            args.extend(["--include", "card"])
        if interval_seconds is not None:
            args.extend(["--interval", str(interval_seconds)])
        if max_attempts is not None:
            args.extend(["--max-attempts", str(max_attempts)])
        return self.run(*args)
