"""Policy engine — evaluates transactions against wallet policies."""

from __future__ import annotations
from datetime import datetime, timezone, timedelta
from typing import Optional

from agent_wallet.core.models import (
    Wallet, Transaction, TransactionStatus, ApprovalType, ApprovalRequest, Policy,
)


class PolicyResult:
    """Result of a policy check."""

    def __init__(self, allowed: bool, approval_type: ApprovalType, reason: str,
                 request: Optional[ApprovalRequest] = None):
        self.allowed = allowed
        self.approval_type = approval_type
        self.reason = reason
        self.request = request


class PolicyEngine:
    """Evaluates transactions against wallet policies."""

    def __init__(self):
        self._pending_requests: dict[str, ApprovalRequest] = {}

    def evaluate(self, wallet: Wallet, txn: Transaction) -> PolicyResult:
        """Check if a transaction is allowed under the wallet's policy."""
        policy = wallet.policy

        if not policy.active:
            return PolicyResult(False, ApprovalType.HUMAN, "Policy is inactive")

        if not wallet.active:
            return PolicyResult(False, ApprovalType.HUMAN, "Wallet is inactive")

        # Check chain
        if txn.chain not in policy.allowed_chains:
            return PolicyResult(False, ApprovalType.HUMAN, f"Chain {txn.chain.value} not allowed")

        # Check blocked recipients
        if policy.blocked_recipients and txn.recipient in policy.blocked_recipients:
            return PolicyResult(False, ApprovalType.HUMAN, f"Recipient {txn.recipient} is blocked")

        # Check allowed recipients (empty = all allowed)
        if policy.allowed_recipients and txn.recipient not in policy.allowed_recipients:
            return PolicyResult(False, ApprovalType.HUMAN, f"Recipient {txn.recipient} not in allowlist")

        # Check daily limit
        if wallet.spent_today_usd + txn.amount_usd > policy.daily_limit:
            return PolicyResult(
                False, ApprovalType.HUMAN,
                f"Would exceed daily limit (${wallet.spent_today_usd:.2f}/${policy.daily_limit:.2f})"
            )

        # Check monthly limit
        if wallet.spent_month_usd + txn.amount_usd > policy.monthly_limit:
            return PolicyResult(
                False, ApprovalType.HUMAN,
                f"Would exceed monthly limit (${wallet.spent_month_usd:.2f}/${policy.monthly_limit:.2f})"
            )

        # Check max transactions per day
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        txns_today = sum(1 for t in wallet.transactions
                        if t.created_at.replace(tzinfo=timezone.utc) >= today
                        and t.status in (TransactionStatus.APPROVED, TransactionStatus.SETTLED))
        if txns_today >= policy.max_transactions_per_day:
            return PolicyResult(False, ApprovalType.HUMAN, f"Max daily transactions reached ({txns_today})")

        # Check cooldown
        if policy.cooldown_seconds > 0:
            recent = [t for t in wallet.transactions
                      if t.recipient == txn.recipient
                      and t.status in (TransactionStatus.APPROVED, TransactionStatus.SETTLED)]
            if recent:
                last = max(recent, key=lambda t: t.created_at)
                elapsed = (datetime.now(timezone.utc) - last.created_at.replace(tzinfo=timezone.utc)).total_seconds()
                if elapsed < policy.cooldown_seconds:
                    remaining = int(policy.cooldown_seconds - elapsed)
                    return PolicyResult(False, ApprovalType.HUMAN,
                                       f"Cooldown: {remaining}s remaining for {txn.recipient}")

        # Determine auto vs human approval
        if txn.amount_usd <= policy.auto_approve_under:
            return PolicyResult(True, ApprovalType.AUTO, "Auto-approved (under threshold)")

        if txn.amount_usd > policy.human_approval_above:
            request = ApprovalRequest(
                transaction_id=txn.id,
                wallet_id=wallet.id,
                amount_usd=txn.amount_usd,
                recipient=txn.recipient,
                description=txn.description,
            )
            self._pending_requests[request.id] = request
            return PolicyResult(True, ApprovalType.HUMAN,
                               f"Requires human approval (${txn.amount_usd:.2f} > ${policy.human_approval_above:.2f})",
                               request=request)

        # Between auto_approve_under and human_approval_above — auto approve
        return PolicyResult(True, ApprovalType.AUTO, "Auto-approved")

    def approve_request(self, request_id: str, approved: bool) -> Optional[ApprovalRequest]:
        """Resolve a pending approval request."""
        request = self._pending_requests.get(request_id)
        if not request:
            return None
        request.approved = approved
        request.resolved_at = datetime.now(timezone.utc)
        del self._pending_requests[request_id]
        return request

    @property
    def pending_requests(self) -> dict[str, ApprovalRequest]:
        return dict(self._pending_requests)