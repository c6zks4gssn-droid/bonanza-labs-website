"""Example: Basic firewall usage."""

from bonanza_x402 import Firewall, Policy

# Create a policy
policy = Policy(
    max_spend_usd=10.00,
    daily_budget_usd=50.00,
    trusted_vendors=["api.weather.com", "api.data.gov"],
    blocked_vendors=["malicious-site.com"],
    require_approval_above=5.00,
    allowed_networks=["base", "solana"],
    allowed_tokens=["usdc", "usdt"],
)

# Create the firewall
firewall = Firewall(policy=policy)

# Test 1: Small trusted payment — auto-approved
result = firewall.evaluate(
    amount=3.50,
    vendor="api.weather.com",
    network="base",
    token="usdc",
    description="Weather API call",
)
print(f"✅ Small payment: approved={result.approved}, risk={result.risk_score:.2f}, reason={result.reason}")

# Test 2: Large payment — needs approval
result = firewall.evaluate(
    amount=7.50,
    vendor="api.weather.com",
    network="base",
    token="usdc",
    description="Premium weather data",
)
print(f"⏳ Large payment: approved={result.approved}, requires_approval={result.requires_approval}, reason={result.reason}")

# Test 3: Unknown vendor — blocked
result = firewall.evaluate(
    amount=2.00,
    vendor="unknown-api.com",
    network="base",
    token="usdc",
)
print(f"❌ Unknown vendor: approved={result.approved}, reason={result.reason}")

# Test 4: Blocked vendor — always blocked
result = firewall.evaluate(
    amount=1.00,
    vendor="malicious-site.com",
    network="base",
    token="usdc",
)
print(f"🚫 Blocked vendor: approved={result.approved}, reason={result.reason}")

# Test 5: Budget exceeded
result = firewall.evaluate(
    amount=15.00,
    vendor="api.weather.com",
    network="base",
    token="usdc",
)
print(f"💸 Budget exceeded: approved={result.approved}, reason={result.reason}")

# Show audit log
print(f"\n📋 Audit Log ({len(firewall.audit_log)} entries):")
for entry in firewall.audit_log.query(limit=10):
    print(f"  {entry.decision:8} | ${entry.amount:>6.2f} | {entry.vendor:25} | risk={entry.risk_score:.2f}")

# Show stats
print(f"\n📊 Stats: {firewall.audit_log.stats()}")