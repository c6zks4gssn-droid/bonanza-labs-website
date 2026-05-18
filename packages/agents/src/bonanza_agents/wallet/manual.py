"""Manual approval fallback for regions where Stripe Link agents are unavailable.

Flow:
1. Agent creates a spend request.
2. Bonanza validates local budget.
3. Human approves manually.
4. Optional Stripe Checkout test link is created.

No live payment is created unless the caller explicitly provides a live Stripe key.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .models import SpendRequest, SpendRequestStatus, Wallet


class ManualApprovalError(RuntimeError):
    """Raised when a manual approval request cannot be processed."""


@dataclass
class ManualApprovalStore:
    """Tiny JSON-file store for local approval demos."""

    path: Path = Path.home() / ".openclaw" / "workspace" / "bonanza-labs-agents" / ".wallet-approvals.json"

    def _read(self) -> dict[str, Any]:
        if not self.path.exists():
            return {"requests": []}
        return json.loads(self.path.read_text())

    def _write(self, data: dict[str, Any]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(data, indent=2, sort_keys=True))

    def create_request(
        self,
        *,
        wallet: Wallet,
        agent_id: str,
        merchant_name: str,
        merchant_url: str,
        context: str,
        amount_cents: int,
        currency: str = "USD",
    ) -> SpendRequest:
        amount_usd = amount_cents / 100
        if not wallet.can_spend(amount_usd):
            raise ManualApprovalError(
                f"Spend ${amount_usd:.2f} exceeds remaining wallet budget "
                f"${wallet.remaining_budget_usd:.2f}."
            )

        req = SpendRequest(
            agent_id=agent_id,
            merchant_name=merchant_name,
            merchant_url=merchant_url,
            context=context,
            amount_cents=amount_cents,
            currency=currency.upper(),
            status=SpendRequestStatus.PENDING_APPROVAL,
            metadata={"approval_mode": "manual", "budget_limit_usd": wallet.budget_limit_usd},
        )
        data = self._read()
        data.setdefault("requests", []).append(req.model_dump(mode="json"))
        self._write(data)
        return req

    def list_requests(self) -> list[dict[str, Any]]:
        return self._read().get("requests", [])

    def get_request(self, request_id: str) -> dict[str, Any]:
        for req in self.list_requests():
            if req.get("id") == request_id:
                return req
        raise ManualApprovalError(f"Approval request not found: {request_id}")

    def set_status(self, request_id: str, status: SpendRequestStatus) -> dict[str, Any]:
        data = self._read()
        for req in data.get("requests", []):
            if req.get("id") == request_id:
                req["status"] = status.value
                self._write(data)
                return req
        raise ManualApprovalError(f"Approval request not found: {request_id}")

    def approve(self, request_id: str) -> dict[str, Any]:
        return self.set_status(request_id, SpendRequestStatus.APPROVED)

    def deny(self, request_id: str) -> dict[str, Any]:
        return self.set_status(request_id, SpendRequestStatus.DENIED)
