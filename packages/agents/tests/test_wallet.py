from bonanza_agents.wallet.models import Wallet
from bonanza_agents.wallet.link_cli import LinkCLIClient


def test_wallet_budget_controls():
    wallet = Wallet(budget_limit_usd=25, spent_usd=10)
    assert wallet.remaining_budget_usd == 15
    assert wallet.can_spend(15)
    assert not wallet.can_spend(16)
    assert wallet.record_spend(5)
    assert wallet.spent_usd == 15


def test_link_cli_context_guard(monkeypatch):
    client = LinkCLIClient(command=("echo",))
    try:
        client.create_spend_request(
            payment_method_id="pm_123",
            merchant_name="Demo",
            merchant_url="https://example.com",
            context="too short",
            amount_cents=100,
        )
    except ValueError as exc:
        assert "at least 100" in str(exc)
    else:
        raise AssertionError("Expected short context to fail")


def test_link_cli_amount_guard():
    client = LinkCLIClient(command=("echo",))
    try:
        client.create_spend_request(
            payment_method_id="pm_123",
            merchant_name="Demo",
            merchant_url="https://example.com",
            context="x" * 100,
            amount_cents=50_001,
        )
    except ValueError as exc:
        assert "50000" in str(exc)
    else:
        raise AssertionError("Expected amount cap to fail")
