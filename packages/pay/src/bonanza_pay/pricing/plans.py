"""Pricing plans for Bonanza Labs products."""

from __future__ import annotations
from enum import Enum
from typing import Optional
from pydantic import BaseModel


class PlanName(str, Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class ProductName(str, Enum):
    FRAMEFORGE = "frameforge"
    FORK_DOCTOR = "fork_doctor"
    AGENT_WALLET = "agent_wallet"


class Plan(BaseModel):
    """A subscription plan."""
    name: PlanName
    product: ProductName
    price_usd: float
    monthly: bool = True
    stripe_price_id: str = ""  # Set after Stripe creation
    features: list[str] = []
    limits: dict = {}


# ─── Agent Wallet Plans ───

AGENT_WALLET_PLANS = {
    PlanName.FREE: Plan(
        name=PlanName.FREE,
        product=ProductName.AGENT_WALLET,
        price_usd=0,
        features=["1 agent", "$50/mo wallet limit", "Basic analytics", "Solana only"],
        limits={"agents": 1, "wallet_limit_usd": 50, "chains": ["solana"]},
    ),
    PlanName.PRO: Plan(
        name=PlanName.PRO,
        product=ProductName.AGENT_WALLET,
        price_usd=29,
        features=["10 agents", "$5K/mo wallet limit", "Full analytics", "All chains", "Policy editor", "API access"],
        limits={"agents": 10, "wallet_limit_usd": 5000, "chains": ["solana", "bsc", "base"]},
    ),
    PlanName.ENTERPRISE: Plan(
        name=PlanName.ENTERPRISE,
        product=ProductName.AGENT_WALLET,
        price_usd=199,
        features=["Unlimited agents", "Unlimited wallet", "Custom policies", "SSO", "Priority support", "SLA"],
        limits={"agents": -1, "wallet_limit_usd": -1, "chains": ["solana", "bsc", "base", "ethereum"]},
    ),
}

# ─── FrameForge Plans ───

FRAMEFORGE_PLANS = {
    PlanName.FREE: Plan(
        name=PlanName.FREE,
        product=ProductName.FRAMEFORGE,
        price_usd=0,
        features=["5 videos/mo", "720p", "2 styles", "Edge-TTS voices"],
        limits={"videos_per_month": 5, "max_resolution": "720p", "styles": 2},
    ),
    PlanName.PRO: Plan(
        name=PlanName.PRO,
        product=ProductName.FRAMEFORGE,
        price_usd=29,
        features=["50 videos/mo", "1080p", "All styles", "Voice cloning", "Batch render", "No watermark"],
        limits={"videos_per_month": 50, "max_resolution": "1080p", "styles": 4},
    ),
    PlanName.ENTERPRISE: Plan(
        name=PlanName.ENTERPRISE,
        product=ProductName.FRAMEFORGE,
        price_usd=199,
        features=["Unlimited videos", "4K", "All styles", "Voice cloning", "API access", "Custom templates"],
        limits={"videos_per_month": -1, "max_resolution": "4K", "styles": 4},
    ),
}

# ─── Fork Doctor Plans ───

FORK_DOCTOR_PLANS = {
    PlanName.FREE: Plan(
        name=PlanName.FREE,
        product=ProductName.FORK_DOCTOR,
        price_usd=0,
        features=["5 checks/day", "JSON output", "Public repos only"],
        limits={"checks_per_day": 5, "private_repos": False},
    ),
    PlanName.PRO: Plan(
        name=PlanName.PRO,
        product=ProductName.FORK_DOCTOR,
        price_usd=9,
        features=["Unlimited checks", "All formats", "Private repos", "CI/CD integration", "Auto-fix"],
        limits={"checks_per_day": -1, "private_repos": True},
    ),
}

ALL_PLANS = {
    ProductName.AGENT_WALLET: AGENT_WALLET_PLANS,
    ProductName.FRAMEFORGE: FRAMEFORGE_PLANS,
    ProductName.FORK_DOCTOR: FORK_DOCTOR_PLANS,
}


def get_plan(product: ProductName, plan: PlanName) -> Optional[Plan]:
    """Get a specific plan."""
    plans = ALL_PLANS.get(product, {})
    return plans.get(plan)


def list_plans(product: ProductName) -> list[Plan]:
    """List all plans for a product."""
    return list(ALL_PLANS.get(product, {}).values())