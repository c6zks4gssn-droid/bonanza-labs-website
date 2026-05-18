"""policies package — YAML-based policy loading."""

from __future__ import annotations
from pathlib import Path
from typing import Optional

import yaml

from agent_wallet.core.models import Policy, ChainType


def load_policy(path: Path) -> Policy:
    """Load a policy from a YAML file."""
    with open(path) as f:
        data = yaml.safe_load(f) or {}

    allowed_chains = [ChainType(c) for c in data.get("allowed_chains", ["solana", "bsc"])]

    return Policy(
        name=data.get("name", "loaded-policy"),
        auto_approve_under=float(data.get("auto_approve_under", 5.0)),
        human_approval_above=float(data.get("human_approval_above", 5.0)),
        daily_limit=float(data.get("daily_limit", 100.0)),
        monthly_limit=float(data.get("monthly_limit", 500.0)),
        allowed_chains=allowed_chains,
        allowed_recipients=data.get("allowed_recipients", []),
        blocked_recipients=data.get("blocked_recipients", []),
        cooldown_seconds=int(data.get("cooldown_seconds", 60)),
        max_transactions_per_day=int(data.get("max_transactions_per_day", 50)),
        active=data.get("active", True),
    )


def save_policy(policy: Policy, path: Path):
    """Save a policy to a YAML file."""
    data = {
        "name": policy.name,
        "auto_approve_under": policy.auto_approve_under,
        "human_approval_above": policy.human_approval_above,
        "daily_limit": policy.daily_limit,
        "monthly_limit": policy.monthly_limit,
        "allowed_chains": [c.value for c in policy.allowed_chains],
        "allowed_recipients": policy.allowed_recipients,
        "blocked_recipients": policy.blocked_recipients,
        "cooldown_seconds": policy.cooldown_seconds,
        "max_transactions_per_day": policy.max_transactions_per_day,
        "active": policy.active,
    }
    path.write_text(yaml.dump(data, default_flow_style=False, sort_keys=False))


# Default policy template
DEFAULT_POLICY_YAML = """
# Agent Wallet Policy
# Auto-approve transactions under $5, require human approval above $5
name: default
auto_approve_under: 5.0
human_approval_above: 5.0
daily_limit: 100.0
monthly_limit: 500.0
allowed_chains:
  - solana
  - bsc
allowed_recipients: []        # empty = all allowed
blocked_recipients: []        # block specific addresses
cooldown_seconds: 60          # min time between txns to same recipient
max_transactions_per_day: 50
active: true
"""