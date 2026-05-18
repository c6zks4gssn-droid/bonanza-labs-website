"""Agent Wallet data models — budgets, spend requests, payment methods."""

from __future__ import annotations
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class SpendRequestStatus(str, Enum):
    """Lifecycle states for a spend request."""
    CREATED = "created"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    DENIED = "denied"
    EXPIRED = "expired"
    CONSUMED = "consumed"


class PaymentMethodType(str, Enum):
    CARD = "card"
    BANK_ACCOUNT = "bank_account"
    STABLECOIN = "stablecoin"


class CredentialType(str, Enum):
    VIRTUAL_CARD = "virtual_card"
    SHARED_PAYMENT_TOKEN = "shared_payment_token"


class PaymentMethod(BaseModel):
    """A payment method in the agent's wallet."""
    id: str
    type: PaymentMethodType
    brand: str = ""  # e.g. "visa", "mastercard"
    last4: str = ""
    expiry_month: int = 0
    expiry_year: int = 0
    is_default: bool = False


class SpendRequest(BaseModel):
    """A request from an agent to spend money — mirrors Stripe Link CLI spend requests."""
    id: str = Field(default_factory=lambda: f"lsrq_{datetime.now().strftime('%Y%m%d%H%M%S%f')}")
    agent_id: str = ""
    payment_method_id: str = ""
    merchant_name: str = ""
    merchant_url: str = ""
    context: str = ""  # Min 100 chars for Link CLI
    amount_cents: int = 0
    currency: str = "USD"
    line_items: list[dict] = []
    totals: list[dict] = []
    credential_type: CredentialType = CredentialType.VIRTUAL_CARD
    status: SpendRequestStatus = SpendRequestStatus.CREATED
    card: Optional[dict] = None  # Populated after approval
    shared_payment_token: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    approved_at: str = ""
    expires_at: str = ""
    metadata: dict = {}


class Wallet(BaseModel):
    """An agent wallet with budget controls and payment methods."""
    id: str = Field(default_factory=lambda: f"wallet_{datetime.now().strftime('%Y%m%d%H%M%S%f')}")
    agent_id: str = ""
    name: str = "Default Wallet"
    budget_limit_usd: float = 100.0
    spent_usd: float = 0.0
    currency: str = "USD"
    payment_methods: list[PaymentMethod] = []
    spend_requests: list[SpendRequest] = []
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    metadata: dict = {}

    @property
    def remaining_budget_usd(self) -> float:
        return max(0, self.budget_limit_usd - self.spent_usd)

    @property
    def is_within_budget(self) -> bool:
        return self.spent_usd < self.budget_limit_usd

    def can_spend(self, amount_usd: float) -> bool:
        """Check if agent can spend this amount within budget."""
        return (self.spent_usd + amount_usd) <= self.budget_limit_usd

    def record_spend(self, amount_usd: float) -> bool:
        """Record a spend if within budget."""
        if not self.can_spend(amount_usd):
            return False
        self.spent_usd += amount_usd
        return True