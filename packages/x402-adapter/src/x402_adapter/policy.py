"""Policy definition for the Bonanza x402 spending firewall."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class RiskLevel(Enum):
    """Risk levels for payment evaluation."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class Policy:
    """Spending policy for the firewall.

    Every payment request is evaluated against these rules.
    The firewall returns approved=True only if ALL checks pass.

    Example:
        >>> policy = Policy(
        ...     max_spend_usd=10.00,
        ...     daily_budget_usd=50.00,
        ...     trusted_vendors=["api.weather.com"],
        ...     require_approval_above=5.00,
        ... )
    """
    # Budget limits
    max_spend_usd: float = float("inf")
    daily_budget_usd: float = float("inf")
    per_transaction_limit_usd: float = float("inf")

    # Network/token restrictions
    allowed_networks: list[str] = field(default_factory=lambda: ["*"])
    allowed_tokens: list[str] = field(default_factory=lambda: ["*"])

    # Vendor controls
    trusted_vendors: list[str] = field(default_factory=list)
    blocked_vendors: list[str] = field(default_factory=list)

    # Approval thresholds
    require_approval_above: float = 0.0
    risk_threshold: float = 1.0  # 0-1 scale, block above this

    # Rate limiting
    max_transactions_per_minute: int = 60
    max_transactions_per_day: int = 1000

    # Metadata
    name: str = "default"
    description: str = ""

    def is_vendor_trusted(self, vendor: str) -> bool:
        """Check if a vendor is in the trusted list."""
        if self.blocked_vendors and vendor in self.blocked_vendors:
            return False
        if self.trusted_vendors and vendor in self.trusted_vendors:
            return True
        return len(self.trusted_vendors) == 0  # Allow all if no list specified

    def is_network_allowed(self, network: str) -> bool:
        """Check if a network is allowed."""
        return "*" in self.allowed_networks or network in self.allowed_networks

    def is_token_allowed(self, token: str) -> bool:
        """Check if a token is allowed."""
        return "*" in self.allowed_tokens or token.lower() in [t.lower() for t in self.allowed_tokens]

    def requires_human_approval(self, amount: float) -> bool:
        """Check if the amount requires human approval."""
        return amount > self.require_approval_above