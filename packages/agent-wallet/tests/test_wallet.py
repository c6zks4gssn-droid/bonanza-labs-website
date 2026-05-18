"""Tests for Agent Wallet."""

import pytest
from agent_wallet.core.models import Wallet, Transaction, Policy, ChainType
from agent_wallet.core.policy_engine import PolicyEngine
from agent_wallet.core.wallet_manager import WalletManager


@pytest.fixture
def policy():
    return Policy(
        auto_approve_under=5.0,
        human_approval_above=5.0,
        daily_limit=100.0,
        monthly_limit=500.0,
    )


@pytest.fixture
def wallet(policy):
    return Wallet(agent_name="test-agent", chain=ChainType.SOLANA, policy=policy)


@pytest.fixture
def engine():
    return PolicyEngine()


class TestPolicyEngine:
    def test_auto_approve_small(self, engine, wallet):
        txn = Transaction(amount_usd=3.0, recipient="alice")
        result = engine.evaluate(wallet, txn)
        assert result.allowed
        assert result.approval_type.value == "auto"

    def test_human_approve_large(self, engine, wallet):
        txn = Transaction(amount_usd=50.0, recipient="alice")
        result = engine.evaluate(wallet, txn)
        assert result.allowed
        assert result.approval_type.value == "human"

    def test_reject_over_daily_limit(self, engine, wallet):
        wallet.spent_today_usd = 99.0
        txn = Transaction(amount_usd=5.0, recipient="alice")
        result = engine.evaluate(wallet, txn)
        assert not result.allowed

    def test_reject_over_monthly_limit(self, engine, wallet):
        wallet.spent_month_usd = 499.0
        txn = Transaction(amount_usd=5.0, recipient="alice")
        result = engine.evaluate(wallet, txn)
        assert not result.allowed

    def test_blocked_recipient(self, engine, wallet):
        wallet.policy.blocked_recipients = ["bad-actor"]
        txn = Transaction(amount_usd=1.0, recipient="bad-actor")
        result = engine.evaluate(wallet, txn)
        assert not result.allowed


class TestWalletManager:
    def test_create_wallet(self, tmp_path):
        mgr = WalletManager(wallet_dir=tmp_path)
        wallet = mgr.create_wallet("test-agent", ChainType.SOLANA)
        assert wallet.agent_name == "test-agent"
        assert mgr.load_wallet(wallet.id) is not None

    def test_list_wallets(self, tmp_path):
        mgr = WalletManager(wallet_dir=tmp_path)
        mgr.create_wallet("agent-1", ChainType.SOLANA)
        mgr.create_wallet("agent-2", ChainType.BSC)
        assert len(mgr.list_wallets()) == 2

    def test_propose_auto_approved(self, tmp_path):
        mgr = WalletManager(wallet_dir=tmp_path)
        wallet = mgr.create_wallet("test-agent", ChainType.SOLANA)
        txn, result = mgr.propose_transaction(wallet.id, 3.0, "alice", "test payment")
        assert txn.status.value == "approved"
        assert result.approval_type.value == "auto"

    def test_propose_needs_approval(self, tmp_path):
        mgr = WalletManager(wallet_dir=tmp_path)
        wallet = mgr.create_wallet("test-agent", ChainType.SOLANA)
        txn, result = mgr.propose_transaction(wallet.id, 50.0, "alice", "large payment")
        assert txn.status.value == "pending"
        assert result.approval_type.value == "human"

    def test_analytics(self, tmp_path):
        mgr = WalletManager(wallet_dir=tmp_path)
        wallet = mgr.create_wallet("test-agent", ChainType.SOLANA)
        data = mgr.get_analytics(wallet.id)
        assert data["agent_name"] == "test-agent"
        assert data["total_transactions"] == 0