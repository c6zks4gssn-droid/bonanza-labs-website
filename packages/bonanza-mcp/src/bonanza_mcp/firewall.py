"""Firewall and Policy for Bonanza MCP — shared with bonanza-x402."""

from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional, Callable


class RiskLevel(Enum):
    """Risk levels for payment evaluation."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class Policy:
    """Spending policy for the firewall."""
    max_spend_usd: float = float("inf")
    daily_budget_usd: float = float("inf")
    per_transaction_limit_usd: float = float("inf")
    allowed_networks: list[str] = field(default_factory=lambda: ["*"])
    allowed_tokens: list[str] = field(default_factory=lambda: ["*"])
    trusted_vendors: list[str] = field(default_factory=list)
    blocked_vendors: list[str] = field(default_factory=list)
    require_approval_above: float = 0.0
    risk_threshold: float = 1.0
    max_transactions_per_minute: int = 60
    max_transactions_per_day: int = 1000
    name: str = "default"
    description: str = ""

    def is_vendor_trusted(self, vendor: str) -> bool:
        if self.blocked_vendors and vendor in self.blocked_vendors:
            return False
        if self.trusted_vendors and vendor in self.trusted_vendors:
            return True
        return len(self.trusted_vendors) == 0

    def is_network_allowed(self, network: str) -> bool:
        return "*" in self.allowed_networks or network in self.allowed_networks

    def is_token_allowed(self, token: str) -> bool:
        return "*" in self.allowed_tokens or token.lower() in [t.lower() for t in self.allowed_tokens]

    def requires_human_approval(self, amount: float) -> bool:
        return amount > self.require_approval_above


@dataclass
class FirewallResult:
    """Result of a firewall evaluation."""
    approved: bool
    reason: str
    risk_score: float
    risk_level: RiskLevel = RiskLevel.LOW
    requires_approval: bool = False
    approval_url: Optional[str] = None
    transaction_id: str = ""
    metadata: dict = field(default_factory=dict)


@dataclass
class AuditEntry:
    """A single audit trail entry."""
    transaction_id: str
    amount: float
    vendor: str
    network: str
    token: str
    decision: str
    reason: str
    risk_score: float
    risk_level: RiskLevel
    timestamp: str = field(default_factory=lambda: __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat())

    def to_dict(self) -> dict:
        from dataclasses import asdict
        d = asdict(self)
        d["risk_level"] = self.risk_level.value
        return d


class AuditLog:
    """In-memory audit log."""

    def __init__(self, path: Optional[str] = None):
        self.entries: list[AuditEntry] = []
        self._path = path

    def append(self, entry: AuditEntry) -> None:
        self.entries.append(entry)

    def query(
        self,
        vendor: Optional[str] = None,
        decision: Optional[str] = None,
        min_amount: Optional[float] = None,
        max_amount: Optional[float] = None,
        limit: int = 100,
    ) -> list[AuditEntry]:
        results = self.entries
        if vendor:
            results = [e for e in results if e.vendor == vendor]
        if decision:
            results = [e for e in results if e.decision == decision]
        if min_amount is not None:
            results = [e for e in results if e.amount >= min_amount]
        if max_amount is not None:
            results = [e for e in results if e.amount <= max_amount]
        return results[-limit:]

    def stats(self) -> dict:
        if not self.entries:
            return {"total": 0, "remaining_budget": _policy.max_spend_usd if _policy else 0}
        approved = [e for e in self.entries if e.decision == "approved"]
        blocked = [e for e in self.entries if e.decision == "blocked"]
        pending = [e for e in self.entries if e.decision == "pending_approval"]
        total_spend = sum(e.amount for e in approved)
        return {
            "total_transactions": len(self.entries),
            "approved": len(approved),
            "blocked": len(blocked),
            "pending_approval": len(pending),
            "total_spend_usd": round(total_spend, 2),
            "remaining_budget_usd": round((_policy.max_spend_usd - total_spend) if _policy else 0, 2),
            "avg_risk_score": round(sum(e.risk_score for e in self.entries) / len(self.entries), 2),
        }


class Firewall:
    """Spending firewall for AI agent payments."""

    def __init__(
        self,
        policy: Policy,
        audit_log: Optional[AuditLog] = None,
        risk_scorer: Optional[Callable] = None,
    ):
        self.policy = policy
        self.audit_log = audit_log or AuditLog()
        self._risk_scorer = risk_scorer or self._default_risk_scorer
        self._session_spend: float = 0.0
        self._daily_spend: float = 0.0
        self._transaction_times: list[float] = []

    def evaluate(
        self,
        amount: float,
        vendor: str,
        network: str = "base",
        token: str = "usdc",
        description: str = "",
        metadata: Optional[dict] = None,
    ) -> FirewallResult:
        transaction_id = str(uuid.uuid4())
        reasons = []
        approved = True
        risk_score = self._risk_scorer(amount, vendor, network, token)
        risk_level = self._score_to_level(risk_score)

        if self._session_spend + amount > self.policy.max_spend_usd:
            approved = False
            reasons.append(f"Session budget exceeded: ${self._session_spend:.2f} + ${amount:.2f} > ${self.policy.max_spend_usd:.2f}")

        if self._daily_spend + amount > self.policy.daily_budget_usd:
            approved = False
            reasons.append(f"Daily budget exceeded: ${self._daily_spend:.2f} + ${amount:.2f} > ${self.policy.daily_budget_usd:.2f}")

        if amount > self.policy.per_transaction_limit_usd:
            approved = False
            reasons.append(f"Transaction limit exceeded: ${amount:.2f} > ${self.policy.per_transaction_limit_usd:.2f}")

        if not self.policy.is_network_allowed(network):
            approved = False
            reasons.append(f"Network not allowed: {network}")

        if not self.policy.is_token_allowed(token):
            approved = False
            reasons.append(f"Token not allowed: {token}")

        if not self.policy.is_vendor_trusted(vendor):
            approved = False
            reasons.append(f"Vendor not trusted: {vendor}")

        if risk_score > self.policy.risk_threshold:
            approved = False
            reasons.append(f"Risk score too high: {risk_score:.2f} > {self.policy.risk_threshold:.2f}")

        now = time.time()
        self._transaction_times = [t for t in self._transaction_times if now - t < 60]
        if len(self._transaction_times) >= self.policy.max_transactions_per_minute:
            approved = False
            reasons.append(f"Rate limit exceeded: {len(self._transaction_times)} transactions in last minute")

        requires_approval = self.policy.requires_human_approval(amount) and approved
        if not approved:
            requires_approval = False

        reason = "; ".join(reasons) if reasons else "All checks passed"

        if approved and not requires_approval:
            self._session_spend += amount
            self._daily_spend += amount
            self._transaction_times.append(now)

        result = FirewallResult(
            approved=approved and not requires_approval,
            reason=reason,
            risk_score=risk_score,
            risk_level=risk_level,
            requires_approval=requires_approval,
            transaction_id=transaction_id,
            metadata=metadata or {},
        )

        self.audit_log.append(AuditEntry(
            transaction_id=transaction_id,
            amount=amount,
            vendor=vendor,
            network=network,
            token=token,
            decision="approved" if result.approved else ("pending_approval" if requires_approval else "blocked"),
            reason=reason,
            risk_score=risk_score,
            risk_level=risk_level,
        ))

        return result

    @staticmethod
    def _default_risk_scorer(amount: float, vendor: str, network: str, token: str) -> float:
        if amount < 1.0:
            return 0.1
        elif amount < 5.0:
            return 0.2
        elif amount < 25.0:
            return 0.4
        elif amount < 100.0:
            return 0.6
        else:
            return 0.8

    @staticmethod
    def _score_to_level(score: float) -> RiskLevel:
        if score < 0.2:
            return RiskLevel.LOW
        elif score < 0.4:
            return RiskLevel.MEDIUM
        elif score < 0.7:
            return RiskLevel.HIGH
        else:
            return RiskLevel.CRITICAL


# Module-level reference for stats
_policy: Optional[Policy] = None