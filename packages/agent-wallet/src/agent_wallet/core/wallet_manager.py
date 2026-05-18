"""Wallet manager — create, load, save, and operate on wallets."""

from __future__ import annotations
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from agent_wallet.core.models import (
    Wallet, Transaction, TransactionStatus, ApprovalType, ChainType, Policy,
)
from agent_wallet.core.policy_engine import PolicyEngine, PolicyResult


WALLET_DIR = Path.home() / ".agent-wallet"


class WalletManager:
    """Manages agent wallets and transactions."""

    def __init__(self, wallet_dir: Optional[Path] = None):
        self.wallet_dir = wallet_dir or WALLET_DIR
        self.wallet_dir.mkdir(parents=True, exist_ok=True)
        self.policy_engine = PolicyEngine()

    def create_wallet(
        self,
        agent_name: str,
        chain: ChainType = ChainType.SOLANA,
        address: str = "",
        policy: Optional[Policy] = None,
    ) -> Wallet:
        """Create a new agent wallet."""
        wallet = Wallet(
            agent_name=agent_name,
            chain=chain,
            address=address,
            policy=policy or Policy(),
        )
        self._save(wallet)
        return wallet

    def load_wallet(self, wallet_id: str) -> Optional[Wallet]:
        """Load a wallet by ID."""
        path = self.wallet_dir / f"{wallet_id}.json"
        if not path.exists():
            return None
        return Wallet.model_validate_json(path.read_text())

    def list_wallets(self) -> list[Wallet]:
        """List all wallets."""
        wallets = []
        for path in self.wallet_dir.glob("*.json"):
            try:
                wallets.append(Wallet.model_validate_json(path.read_text()))
            except Exception:
                pass
        return wallets

    def propose_transaction(
        self,
        wallet_id: str,
        amount_usd: float,
        recipient: str,
        description: str = "",
        chain: Optional[ChainType] = None,
    ) -> tuple[Transaction, PolicyResult]:
        """Propose a transaction and evaluate it against policy."""
        wallet = self.load_wallet(wallet_id)
        if not wallet:
            raise ValueError(f"Wallet {wallet_id} not found")

        txn = Transaction(
            wallet_id=wallet_id,
            amount_usd=amount_usd,
            recipient=recipient,
            description=description,
            chain=chain or wallet.chain,
        )

        result = self.policy_engine.evaluate(wallet, txn)

        if not result.allowed:
            txn.status = TransactionStatus.REJECTED
            txn.error = result.reason
        elif result.approval_type == ApprovalType.AUTO:
            txn.status = TransactionStatus.APPROVED
            txn.approval_type = ApprovalType.AUTO
            self._apply_spend(wallet, amount_usd)
        else:
            txn.status = TransactionStatus.PENDING
            txn.approval_type = ApprovalType.HUMAN

        wallet.transactions.append(txn)
        self._save(wallet)
        return txn, result

    def approve_transaction(self, wallet_id: str, transaction_id: str, approved: bool) -> Optional[Transaction]:
        """Approve or reject a pending transaction."""
        wallet = self.load_wallet(wallet_id)
        if not wallet:
            return None

        for txn in wallet.transactions:
            if txn.id == transaction_id:
                if txn.status != TransactionStatus.PENDING:
                    return txn
                if approved:
                    txn.status = TransactionStatus.APPROVED
                    self._apply_spend(wallet, txn.amount_usd)
                else:
                    txn.status = TransactionStatus.REJECTED
                    txn.error = "Rejected by human"
                self._save(wallet)
                return txn
        return None

    def settle_transaction(self, wallet_id: str, transaction_id: str, tx_hash: str) -> Optional[Transaction]:
        """Mark a transaction as settled on-chain."""
        wallet = self.load_wallet(wallet_id)
        if not wallet:
            return None

        for txn in wallet.transactions:
            if txn.id == transaction_id:
                txn.status = TransactionStatus.SETTLED
                txn.tx_hash = tx_hash
                txn.settled_at = datetime.now(timezone.utc)
                self._save(wallet)
                return txn
        return None

    def get_analytics(self, wallet_id: str) -> dict:
        """Get spending analytics for a wallet."""
        wallet = self.load_wallet(wallet_id)
        if not wallet:
            return {"error": f"Wallet {wallet_id} not found"}

        txns = wallet.transactions
        settled = [t for t in txns if t.status == TransactionStatus.SETTLED]
        by_recipient = {}
        for t in settled:
            by_recipient[t.recipient] = by_recipient.get(t.recipient, 0) + t.amount_usd

        return {
            "wallet_id": wallet_id,
            "agent_name": wallet.agent_name,
            "chain": wallet.chain.value,
            "balance_usd": wallet.balance_usd,
            "spent_today_usd": wallet.spent_today_usd,
            "spent_month_usd": wallet.spent_month_usd,
            "total_transactions": len(txns),
            "settled_transactions": len(settled),
            "pending_transactions": sum(1 for t in txns if t.status == TransactionStatus.PENDING),
            "rejected_transactions": sum(1 for t in txns if t.status == TransactionStatus.REJECTED),
            "top_recipients": sorted(by_recipient.items(), key=lambda x: x[1], reverse=True)[:5],
            "daily_limit": wallet.policy.daily_limit,
            "monthly_limit": wallet.policy.monthly_limit,
        }

    def _apply_spend(self, wallet: Wallet, amount: float):
        """Track spending."""
        wallet.spent_today_usd += amount
        wallet.spent_month_usd += amount

    def _save(self, wallet: Wallet):
        """Save wallet to disk."""
        path = self.wallet_dir / f"{wallet.id}.json"
        path.write_text(wallet.model_dump_json(indent=2))