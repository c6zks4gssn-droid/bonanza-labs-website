"""Spending Firewall for AI agent payments.

The firewall sits before any payment rail. It evaluates structured spend
intent and returns one deterministic decision: allow, deny, or require approval.
Every decision can be written to an audit log before money moves.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from pydantic import BaseModel, Field

from .models import SpendRequest


class FirewallDecision(str, Enum):
    """Possible firewall outcomes."""

    ALLOW = "allow"
    DENY = "deny"
    REQUIRE_APPROVAL = "require_approval"


class RiskLevel(str, Enum):
    """Human-friendly risk levels."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class SpendingPolicy(BaseModel):
    """Rules that define what an agent may spend before payment execution."""

    id: str = "policy_default"
    agent_id: str = "agent_demo"
    max_per_tx_cents: int = 2_500
    daily_limit_cents: int = 10_000
    monthly_limit_cents: int = 100_000
    approval_threshold_cents: int = 1_000
    allowed_vendors: list[str] = Field(default_factory=list)
    blocked_vendors: list[str] = Field(default_factory=list)
    allowed_categories: list[str] = Field(default_factory=list)
    require_approval_for_unknown_vendor: bool = True
    currency: str = "USD"


class FirewallEvaluation(BaseModel):
    """Result of evaluating one spend request against one policy."""

    id: str = Field(default_factory=lambda: f"fw_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S%f')}")
    request_id: str = ""
    agent_id: str = ""
    merchant_name: str = ""
    merchant_url: str = ""
    vendor_key: str = ""
    amount_cents: int = 0
    currency: str = "USD"
    policy_id: str = ""
    decision: FirewallDecision = FirewallDecision.REQUIRE_APPROVAL
    risk_level: RiskLevel = RiskLevel.MEDIUM
    risk_score: int = 50
    reasons: list[str] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def approval_message(self) -> str:
        """Render a compact Telegram-friendly approval prompt."""

        amount = self.amount_cents / 100
        reasons = "\n".join(f"- {reason}" for reason in self.reasons) or "- No extra risk flags"
        return (
            "🛡️ Bonanza Spending Firewall\n"
            f"Agent: {self.agent_id}\n"
            f"Merchant: {self.merchant_name}\n"
            f"Amount: {self.currency} {amount:.2f}\n"
            f"Decision: {self.decision.value}\n"
            f"Risk: {self.risk_level.value} ({self.risk_score}/100)\n"
            f"Reasons:\n{reasons}\n\n"
            f"Approve: bonanza-agents wallet approve {self.request_id}\n"
            f"Deny: bonanza-agents wallet deny {self.request_id}"
        )


class SpendingFirewall:
    """Deterministic policy engine for agent spend requests."""

    def __init__(self, policy: SpendingPolicy):
        self.policy = policy

    @staticmethod
    def vendor_key(merchant_name: str, merchant_url: str) -> str:
        """Normalize merchant identity for allow/block matching."""

        host = urlparse(merchant_url).netloc.lower().removeprefix("www.")
        if host:
            return host
        return merchant_name.strip().lower()

    @staticmethod
    def _matches_vendor(vendor_key: str, merchant_name: str, patterns: list[str]) -> bool:
        haystack = f"{vendor_key} {merchant_name}".lower()
        return any(pattern.lower().strip() and pattern.lower().strip() in haystack for pattern in patterns)

    def evaluate(
        self,
        request: SpendRequest,
        *,
        spent_today_cents: int = 0,
        spent_month_cents: int = 0,
        category: str = "",
    ) -> FirewallEvaluation:
        """Evaluate a spend request and return a decision with risk reasons."""

        policy = self.policy
        reasons: list[str] = []
        risk_score = 0
        hard_denied = False
        needs_approval = False
        vendor = self.vendor_key(request.merchant_name, request.merchant_url)

        if request.currency.upper() != policy.currency.upper():
            hard_denied = True
            risk_score += 40
            reasons.append(f"Currency {request.currency.upper()} is not allowed by policy {policy.currency.upper()}.")

        if request.agent_id and request.agent_id != policy.agent_id:
            hard_denied = True
            risk_score += 40
            reasons.append(f"Agent {request.agent_id} does not match policy agent {policy.agent_id}.")

        if self._matches_vendor(vendor, request.merchant_name, policy.blocked_vendors):
            hard_denied = True
            risk_score += 50
            reasons.append("Merchant is on the blocked vendor list.")

        if request.amount_cents > policy.max_per_tx_cents:
            hard_denied = True
            risk_score += 35
            reasons.append(
                f"Amount exceeds per-transaction limit ({request.amount_cents} > {policy.max_per_tx_cents} cents)."
            )

        if spent_today_cents + request.amount_cents > policy.daily_limit_cents:
            hard_denied = True
            risk_score += 35
            reasons.append("Spend would exceed daily policy limit.")

        if spent_month_cents + request.amount_cents > policy.monthly_limit_cents:
            hard_denied = True
            risk_score += 35
            reasons.append("Spend would exceed monthly policy limit.")

        known_vendor = bool(policy.allowed_vendors) and self._matches_vendor(
            vendor, request.merchant_name, policy.allowed_vendors
        )
        if policy.allowed_vendors and not known_vendor:
            if policy.require_approval_for_unknown_vendor:
                needs_approval = True
                risk_score += 20
                reasons.append("Merchant is not on the allowlist; human approval required.")
            else:
                hard_denied = True
                risk_score += 35
                reasons.append("Merchant is not on the allowlist.")

        if request.amount_cents >= policy.approval_threshold_cents:
            needs_approval = True
            risk_score += 15
            reasons.append("Amount meets or exceeds approval threshold.")

        if category and policy.allowed_categories and category not in policy.allowed_categories:
            needs_approval = True
            risk_score += 15
            reasons.append(f"Category '{category}' is not pre-approved.")

        if request.amount_cents <= max(100, policy.approval_threshold_cents // 5):
            risk_score -= 10
            reasons.append("Small amount lowers risk.")

        risk_score = max(0, min(100, risk_score))
        risk_level = RiskLevel.LOW if risk_score < 30 else RiskLevel.MEDIUM if risk_score < 70 else RiskLevel.HIGH
        decision = (
            FirewallDecision.DENY
            if hard_denied
            else FirewallDecision.REQUIRE_APPROVAL
            if needs_approval
            else FirewallDecision.ALLOW
        )

        if not reasons:
            reasons.append("Request matches policy and stays under limits.")

        return FirewallEvaluation(
            request_id=request.id,
            agent_id=request.agent_id,
            merchant_name=request.merchant_name,
            merchant_url=request.merchant_url,
            vendor_key=vendor,
            amount_cents=request.amount_cents,
            currency=request.currency.upper(),
            policy_id=policy.id,
            decision=decision,
            risk_level=risk_level,
            risk_score=risk_score,
            reasons=reasons,
        )


@dataclass
class FirewallAuditStore:
    """JSON audit log for local MVP demos."""

    path: Path = Path.home() / ".openclaw" / "workspace" / "bonanza-labs-agents" / ".firewall-audit.json"

    def _read(self) -> dict[str, Any]:
        if not self.path.exists():
            return {"events": []}
        return json.loads(self.path.read_text())

    def _write(self, data: dict[str, Any]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(data, indent=2, sort_keys=True))

    def append(self, evaluation: FirewallEvaluation) -> FirewallEvaluation:
        data = self._read()
        data.setdefault("events", []).append(evaluation.model_dump(mode="json"))
        self._write(data)
        return evaluation

    def list_events(self) -> list[dict[str, Any]]:
        return self._read().get("events", [])
