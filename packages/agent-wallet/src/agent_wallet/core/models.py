"""Core models for Agent Wallet."""

from __future__ import annotations
from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from uuid import uuid4

from pydantic import BaseModel, Field


class TransactionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SETTLED = "settled"
    FAILED = "failed"


class ApprovalType(str, Enum):
    AUTO = "auto"
    HUMAN = "human"


class ChainType(str, Enum):
    SOLANA = "solana"
    BSC = "bsc"
    BASE = "base"


class Policy(BaseModel):
    """Spending policy for an agent wallet."""
    id: str = Field(default_factory=lambda: uuid4().hex[:12])
    name: str = "default"
    auto_approve_under: float = 5.0  # USD
    human_approval_above: float = 5.0  # USD
    daily_limit: float = 100.0  # USD
    monthly_limit: float = 500.0  # USD
    allowed_chains: list[ChainType] = [ChainType.SOLANA, ChainType.BSC]
    allowed_recipients: list[str] = Field(default_factory=list)  # empty = all
    blocked_recipients: list[str] = Field(default_factory=list)
    cooldown_seconds: int = 60  # min time between txns to same recipient
    max_transactions_per_day: int = 50
    active: bool = True


class Wallet(BaseModel):
    """An AI agent's wallet."""
    id: str = Field(default_factory=lambda: uuid4().hex[:16])
    agent_name: str
    chain: ChainType = ChainType.SOLANA
    address: str = ""
    policy: Policy = Field(default_factory=Policy)
    balance_usd: float = 0.0
    spent_today_usd: float = 0.0
    spent_month_usd: float = 0.0
    transactions: list[Transaction] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    active: bool = True


class Transaction(BaseModel):
    """A payment transaction."""
    id: str = Field(default_factory=lambda: uuid4().hex[:16])
    wallet_id: str = ""
    amount_usd: float
    recipient: str = ""
    description: str = ""
    chain: ChainType = ChainType.SOLANA
    status: TransactionStatus = TransactionStatus.PENDING
    approval_type: ApprovalType = ApprovalType.AUTO
    tx_hash: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    settled_at: Optional[datetime] = None
    error: str = ""


class ApprovalRequest(BaseModel):
    """A request for human approval of a transaction."""
    id: str = Field(default_factory=lambda: uuid4().hex[:16])
    transaction_id: str
    wallet_id: str
    amount_usd: float
    recipient: str
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    approved: Optional[bool] = None
    resolved_at: Optional[datetime] = None