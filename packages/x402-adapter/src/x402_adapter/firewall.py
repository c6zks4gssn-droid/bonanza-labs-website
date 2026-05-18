"""Firewall — the core evaluation engine for the Bonanza x402 adapter."""

from __future__ import annotations

import hashlib
import time
import uuid
from dataclasses import dataclass, field
from typing import Optional, Callable

from .policy import Policy, RiskLevel
from .audit import AuditEntry, AuditLog


@dataclass
class FirewallResult:
    """Result of a firewall evaluation."""
    approved: bool
    reason: str
    risk_score: float  # 0-1, higher = riskier
    risk_level: RiskLevel = RiskLevel.LOW
    requires_approval: bool = False
    approval_url: Optional[str] = None
    transaction_id: str = ""
    metadata: dict = field(default_factory=dict)


class Firewall:
    """Spending firewall for x402 payment requests.

    Evaluates every payment against policy rules before money moves.

    Example:
        >>> from bonanza_x402 import Firewall, Policy
        >>> firewall = Firewall(Policy(max_spend_usd=10.00, trusted_vendors=["api.weather.com"]))
        >>> result = firewall.evaluate(amount=3.50, vendor="api.weather.com", network="base")
        >>> result.approved
        True
    """

    def __init__(
        self,
        policy: Policy,
        audit_log: Optional[AuditLog] = None,
        stripe_config: Optional[dict] = None,
        risk_scorer: Optional[Callable] = None,
    ):
        self.policy = policy
        self.audit_log = audit_log or AuditLog()
        self.stripe_config = stripe_config
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
        """Evaluate a payment request against the firewall policy.

        Args:
            amount: Payment amount in USD
            vendor: Vendor domain (e.g., "api.weather.com")
            network: Blockchain network (e.g., "base", "solana")
            token: Payment token (e.g., "usdc", "usdt")
            description: Human-readable description
            metadata: Additional context

        Returns:
            FirewallResult with approval status and details
        """
        transaction_id = str(uuid.uuid4())
        reasons = []
        approved = True
        risk_score = self._risk_scorer(amount, vendor, network, token)
        risk_level = self._score_to_level(risk_score)

        # Check 1: Session budget
        if self._session_spend + amount > self.policy.max_spend_usd:
            approved = False
            reasons.append(
                f"Session budget exceeded: ${self._session_spend:.2f} + ${amount:.2f} > ${self.policy.max_spend_usd:.2f}"
            )

        # Check 2: Daily budget
        if self._daily_spend + amount > self.policy.daily_budget_usd:
            approved = False
            reasons.append(
                f"Daily budget exceeded: ${self._daily_spend:.2f} + ${amount:.2f} > ${self.policy.daily_budget_usd:.2f}"
            )

        # Check 3: Per-transaction limit
        if amount > self.policy.per_transaction_limit_usd:
            approved = False
            reasons.append(
                f"Transaction limit exceeded: ${amount:.2f} > ${self.policy.per_transaction_limit_usd:.2f}"
            )

        # Check 4: Network allowed
        if not self.policy.is_network_allowed(network):
            approved = False
            reasons.append(f"Network not allowed: {network}")

        # Check 5: Token allowed
        if not self.policy.is_token_allowed(token):
            approved = False
            reasons.append(f"Token not allowed: {token}")

        # Check 6: Vendor blocked
        if not self.policy.is_vendor_trusted(vendor):
            approved = False
            reasons.append(f"Vendor not trusted: {vendor}")

        # Check 7: Risk threshold
        if risk_score > self.policy.risk_threshold:
            approved = False
            reasons.append(f"Risk score too high: {risk_score:.2f} > {self.policy.risk_threshold:.2f}")

        # Check 8: Rate limiting
        now = time.time()
        self._transaction_times = [t for t in self._transaction_times if now - t < 60]
        if len(self._transaction_times) >= self.policy.max_transactions_per_minute:
            approved = False
            reasons.append(f"Rate limit exceeded: {len(self._transaction_times)} transactions in last minute")

        # Determine if human approval needed
        requires_approval = self.policy.requires_human_approval(amount) and approved

        # If blocked, override approval
        if not approved:
            requires_approval = False

        # Build result
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

        # Log to audit trail
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

    def x402_hook(self) -> Callable:
        """Return a callable that can be used as a pre_payment_hook in x402.

        Example:
            client = x402.Client()
            firewall = Firewall(Policy(max_spend_usd=10.00))
            response = client.get(url, pre_payment_hook=firewall.x402_hook())
        """
        def hook(payment_request: dict) -> dict:
            amount = payment_request.get("amount", 0)
            vendor = payment_request.get("vendor", "")
            network = payment_request.get("network", "base")
            token = payment_request.get("token", "usdc")

            result = self.evaluate(
                amount=amount,
                vendor=vendor,
                network=network,
                token=token,
                description=payment_request.get("description", ""),
            )

            if result.approved:
                return {"proceed": True, "transaction_id": result.transaction_id}
            elif result.requires_approval:
                return {"proceed": False, "approval_url": result.approval_url}
            else:
                return {"proceed": False, "reason": result.reason}

        return hook

    @staticmethod
    def _default_risk_scorer(amount: float, vendor: str, network: str, token: str) -> float:
        """Default risk scoring: higher amounts = higher risk."""
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
        """Convert numeric risk score to RiskLevel enum."""
        if score < 0.2:
            return RiskLevel.LOW
        elif score < 0.4:
            return RiskLevel.MEDIUM
        elif score < 0.7:
            return RiskLevel.HIGH
        else:
            return RiskLevel.CRITICAL