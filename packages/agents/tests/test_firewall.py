from pathlib import Path

from click.testing import CliRunner

from bonanza_agents.cli import main
from bonanza_agents.wallet.firewall import (
    FirewallAuditStore,
    FirewallDecision,
    RiskLevel,
    SpendingFirewall,
    SpendingPolicy,
)
from bonanza_agents.wallet.models import SpendRequest


def make_request(amount_cents=900, merchant_name="OpenAI", merchant_url="https://openai.com"):
    return SpendRequest(
        agent_id="agent_demo",
        merchant_name=merchant_name,
        merchant_url=merchant_url,
        context="Agent needs to buy API credits for a verified task.",
        amount_cents=amount_cents,
        currency="USD",
    )


def test_firewall_allows_known_small_vendor():
    policy = SpendingPolicy(
        agent_id="agent_demo",
        allowed_vendors=["openai.com"],
        approval_threshold_cents=1000,
        max_per_tx_cents=2500,
    )
    result = SpendingFirewall(policy).evaluate(make_request(amount_cents=500))
    assert result.decision == FirewallDecision.ALLOW
    assert result.risk_level == RiskLevel.LOW


def test_firewall_requires_approval_for_unknown_vendor():
    policy = SpendingPolicy(
        agent_id="agent_demo",
        allowed_vendors=["openai.com"],
        approval_threshold_cents=1000,
        max_per_tx_cents=2500,
    )
    result = SpendingFirewall(policy).evaluate(
        make_request(amount_cents=900, merchant_name="Unknown", merchant_url="https://unknown.example")
    )
    assert result.decision == FirewallDecision.REQUIRE_APPROVAL
    assert "allowlist" in " ".join(result.reasons)


def test_firewall_denies_blocked_vendor_and_large_amount():
    policy = SpendingPolicy(
        agent_id="agent_demo",
        blocked_vendors=["scam.example"],
        approval_threshold_cents=1000,
        max_per_tx_cents=2500,
    )
    result = SpendingFirewall(policy).evaluate(
        make_request(amount_cents=5000, merchant_name="Scam", merchant_url="https://scam.example")
    )
    assert result.decision == FirewallDecision.DENY
    assert result.risk_level == RiskLevel.HIGH


def test_firewall_audit_store(tmp_path: Path):
    store = FirewallAuditStore(path=tmp_path / "audit.json")
    result = SpendingFirewall(SpendingPolicy(agent_id="agent_demo")).evaluate(make_request())
    store.append(result)
    events = store.list_events()
    assert len(events) == 1
    assert events[0]["request_id"] == result.request_id


def test_firewall_cli_dry_run_no_audit():
    runner = CliRunner()
    result = runner.invoke(
        main,
        [
            "wallet",
            "firewall-check",
            "--merchant-name",
            "OpenAI",
            "--merchant-url",
            "https://openai.com",
            "--amount",
            "900",
            "--allow-vendor",
            "openai.com",
            "--no-audit",
        ],
    )
    assert result.exit_code == 0
    assert "Decision:" in result.output
