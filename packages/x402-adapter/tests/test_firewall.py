"""Tests for the Bonanza x402 Firewall."""

import pytest
from bonanza_x402 import Firewall, Policy, RiskLevel


class TestPolicy:
    """Test policy configuration."""

    def test_default_policy_allows_all(self):
        policy = Policy()
        assert policy.is_vendor_trusted("any-vendor.com")
        assert policy.is_network_allowed("any-network")
        assert policy.is_token_allowed("usdc")

    def test_vendor_trusted(self):
        policy = Policy(trusted_vendors=["api.weather.com"])
        assert policy.is_vendor_trusted("api.weather.com")
        assert not policy.is_vendor_trusted("api.unknown.com")

    def test_vendor_blocked(self):
        policy = Policy(blocked_vendors=["malicious.com"])
        assert not policy.is_vendor_trusted("malicious.com")
        assert policy.is_vendor_trusted("safe.com")

    def test_network_allowed(self):
        policy = Policy(allowed_networks=["base", "solana"])
        assert policy.is_network_allowed("base")
        assert not policy.is_network_allowed("ethereum")

    def test_requires_approval(self):
        policy = Policy(require_approval_above=5.00)
        assert not policy.requires_human_approval(3.00)
        assert policy.requires_human_approval(10.00)


class TestFirewall:
    """Test firewall evaluation."""

    def setup_method(self):
        self.policy = Policy(
            max_spend_usd=10.00,
            daily_budget_usd=50.00,
            trusted_vendors=["api.weather.com", "api.data.gov"],
            require_approval_above=5.00,
        )
        self.firewall = Firewall(policy=self.policy)

    def test_approved_payment(self):
        result = self.firewall.evaluate(
            amount=3.50,
            vendor="api.weather.com",
            network="base",
            token="usdc",
        )
        assert result.approved is True
        assert result.risk_level == RiskLevel.LOW

    def test_blocked_untrusted_vendor(self):
        result = self.firewall.evaluate(
            amount=3.50,
            vendor="malicious.com",
            network="base",
            token="usdc",
        )
        assert result.approved is False
        assert "not trusted" in result.reason

    def test_blocked_budget_exceeded(self):
        result = self.firewall.evaluate(
            amount=15.00,
            vendor="api.weather.com",
            network="base",
            token="usdc",
        )
        assert result.approved is False
        assert "budget exceeded" in result.reason

    def test_requires_approval(self):
        result = self.firewall.evaluate(
            amount=7.50,
            vendor="api.weather.com",
            network="base",
            token="usdc",
        )
        assert result.requires_approval is True
        assert result.approved is False  # Pending approval

    def test_blocked_network(self):
        policy = Policy(allowed_networks=["base"])
        firewall = Firewall(policy=policy)
        result = firewall.evaluate(
            amount=1.00,
            vendor="api.weather.com",
            network="ethereum",
            token="usdc",
        )
        assert result.approved is False
        assert "not allowed" in result.reason

    def test_audit_trail(self):
        self.firewall.evaluate(amount=3.50, vendor="api.weather.com", network="base")
        assert len(self.firewall.audit_log) == 1

    def test_risk_scoring(self):
        result = self.firewall.evaluate(
            amount=50.00,
            vendor="unknown.com",
            network="base",
            token="usdc",
        )
        assert result.risk_score > 0.5

    def test_x402_hook(self):
        hook = self.firewall.x402_hook()
        response = hook({
            "amount": 3.50,
            "vendor": "api.weather.com",
            "network": "base",
            "token": "usdc",
        })
        assert response["proceed"] is True

    def test_session_tracking(self):
        self.firewall.evaluate(amount=3.00, vendor="api.weather.com", network="base")
        self.firewall.evaluate(amount=4.00, vendor="api.weather.com", network="base")
        result = self.firewall.evaluate(amount=5.00, vendor="api.weather.com", network="base")
        # 3+4+5 = 12 > 10 budget
        assert result.approved is False