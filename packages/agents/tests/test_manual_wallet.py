from pathlib import Path

from bonanza_agents.wallet.manual import ManualApprovalStore
from bonanza_agents.wallet.models import Wallet
from bonanza_agents.wallet.stripe_checkout import StripeCheckoutClient, StripeCheckoutError


def test_manual_approval_flow(tmp_path: Path):
    store = ManualApprovalStore(path=tmp_path / "approvals.json")
    wallet = Wallet(agent_id="agent_test", budget_limit_usd=10)
    req = store.create_request(
        wallet=wallet,
        agent_id="agent_test",
        merchant_name="Demo",
        merchant_url="https://example.com",
        context="Test request",
        amount_cents=900,
    )
    assert req.status == "pending_approval"
    approved = store.approve(req.id)
    assert approved["status"] == "approved"
    denied = store.deny(req.id)
    assert denied["status"] == "denied"


def test_manual_budget_guard(tmp_path: Path):
    store = ManualApprovalStore(path=tmp_path / "approvals.json")
    wallet = Wallet(agent_id="agent_test", budget_limit_usd=1)
    try:
        store.create_request(
            wallet=wallet,
            agent_id="agent_test",
            merchant_name="Demo",
            merchant_url="https://example.com",
            context="Too expensive",
            amount_cents=200,
        )
    except Exception as exc:
        assert "exceeds" in str(exc)
    else:
        raise AssertionError("Expected budget guard to fail")


def test_stripe_client_refuses_live_key():
    client = StripeCheckoutClient(secret_key="sk_live_fake")
    try:
        client.create_session(merchant_name="Demo", amount_cents=100)
    except StripeCheckoutError as exc:
        assert "Refusing to use a live Stripe key" in str(exc)
    else:
        raise AssertionError("Expected live key refusal")
