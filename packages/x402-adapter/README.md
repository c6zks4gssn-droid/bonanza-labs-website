# 💸 Bonanza x402 Adapter

> **Spending firewall meets the HTTP 402 payment protocol**

[![PyPI](https://img.shields.io/badge/pypi-bonanza--x402-blue)](https://pypi.org/project/bonanza-x402/)
[![Python](https://img.shields.io/badge/python-3.10%2B-green)](https://pypi.org/project/bonanza-x402/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![x402](https://img.shields.io/badge/x402-compatible-orange)](https://github.com/x402-foundation/x402)

Bonanza x402 brings **policy-based spending controls** to the [x402 payment protocol](https://github.com/x402-foundation/x402). Every payment request goes through a firewall that checks budgets, risk scores, vendor allowlists, and approval queues — before money moves.

## Why?

AI agents are starting to spend real money via the x402 protocol. But x402 alone doesn't answer:

- **"Is this payment within budget?"**
- **"Is this vendor trusted?"**
- **"Should a human approve this?"**
- **"What's the risk level of this transaction?"**

Bonanza x402 adds these guardrails. Think of it as **ulimit for agent payments** — but with Stripe checkout, crypto wallets, and approval flows.

## Quick Start

```bash
pip install bonanza-x402
```

### Basic: Wrap any x402 payment with a budget

```python
from bonanza_x402 import Firewall, Policy

# Define your spending policy
policy = Policy(
    max_spend_usd=10.00,          # Hard limit per session
    daily_budget_usd=50.00,       # Daily cap
    allowed_networks=["base"],     # Only Base chain
    allowed_tokens=["usdc"],      # Only USDC
    require_approval_above=5.00,  # Human approval above $5
    trusted_vendors=["api.weather.com", "api.data.gov"],
)

# Create the firewall
firewall = Firewall(policy=policy)

# Check before paying
result = firewall.evaluate(
    amount=3.50,
    vendor="api.weather.com",
    network="base",
    token="usdc",
    description="Weather API call"
)

if result.approved:
    print(f"✅ Payment approved: {result.reason}")
else:
    print(f"❌ Payment blocked: {result.reason}")
    if result.requires_approval:
        print(f"⏳ Awaiting human approval: {result.approval_url}")
```

### With x402 Protocol Integration

```python
import x402
from bonanza_x402 import Firewall, Policy

# Set up x402 client
client = x402.Client()

# Set up Bonanza firewall
firewall = Firewall(Policy(
    max_spend_usd=25.00,
    trusted_vendors=["api.premium-data.com"],
    require_approval_above=10.00,
))

# Wrap x402 calls with firewall
response = client.get(
    "https://api.premium-data.com/v1/analysis",
    payment_config=x402.PaymentConfig(
        max_amount=5.00,
        network="base",
    ),
    # Bonanza intercepts before payment is sent
    pre_payment_hook=firewall.x402_hook(),
)
```

### Stripe Checkout Fallback

For payments that need human approval, Bonanza creates a Stripe Checkout session:

```python
from bonanza_x402 import Firewall, Policy, StripeConfig

firewall = Firewall(
    policy=Policy(
        max_spend_usd=100.00,
        require_approval_above=25.00,
    ),
    stripe=StripeConfig(
        api_key="sk_live_...",
        success_url="https://your-app.com/success",
        cancel_url="https://your-app.com/cancel",
    ),
)

result = firewall.evaluate(amount=50.00, vendor="api.expensive-ai.com")
# result.approved = False
# result.checkout_url = "https://checkout.stripe.com/pay/cs_live_..."
```

## Policy Rules

| Rule | Type | Default | Description |
|------|------|---------|-------------|
| `max_spend_usd` | float | ∞ | Hard limit per session |
| `daily_budget_usd` | float | ∞ | Daily spending cap |
| `per_transaction_limit_usd` | float | ∞ | Max single transaction |
| `allowed_networks` | list | ["*"] | Allowed blockchain networks |
| `allowed_tokens` | list | ["*"] | Allowed payment tokens |
| `trusted_vendors` | list | [] | Auto-approved vendor domains |
| `blocked_vendors` | list | [] | Always-blocked vendor domains |
| `require_approval_above` | float | 0 | Threshold for human approval |
| `risk_threshold` | float | 1.0 | 0-1 scale, block above this |

## Firewall Result

```python
@dataclass
class FirewallResult:
    approved: bool           # Whether the payment is allowed
    reason: str              # Human-readable explanation
    risk_score: float        # 0-1 risk assessment
    requires_approval: bool  # Whether human approval is needed
    approval_url: str | None # Stripe checkout URL if approval needed
    transaction_id: str      # Unique ID for audit trail
    metadata: dict           # Additional context
```

## Audit Trail

Every evaluation is logged:

```python
# Get audit log
entries = firewall.audit_log()

for entry in entries:
    print(f"{entry.timestamp} | {entry.amount} | {entry.vendor} | {entry.decision} | {entry.reason}")
```

## CLI

```bash
# Evaluate a payment
bonanza-x402 evaluate --amount 5.00 --vendor api.weather.com --network base

# Check policy status
bonanza-x402 policy show

# View audit log
bonanza-x402 audit log

# Create a test checkout
bonanza-x402 checkout --amount 10.00 --stripe-key sk_test_...
```

## Architecture

```
┌─────────────┐     ┌──────────────────────┐     ┌─────────────┐
│  AI Agent   │────▶│  Bonanza Firewall    │────▶│  x402 Proto  │
│             │     │                      │     │  (Payment)   │
└─────────────┘     │  ┌──────────────┐   │     └─────────────┘
                    │  │ Policy Check  │   │
                    │  ├──────────────┤   │     ┌─────────────┐
                    │  │ Risk Score    │───┼────▶│  Stripe      │
                    │  ├──────────────┤   │     │  (Approval)  │
                    │  │ Vendor List   │   │     └─────────────┘
                    │  ├──────────────┤   │
                    │  │ Budget Check  │   │     ┌─────────────┐
                    │  └──────────────┘   │────▶│  Audit Log   │
                    └──────────────────────┘     └─────────────┘
```

## Comparison

| Feature | x402 alone | AgentBudget | Bonanza x402 |
|---------|-----------|-------------|---------------|
| Budget limits | ❌ | ✅ | ✅ |
| Vendor allowlist | ❌ | ❌ | ✅ |
| Risk scoring | ❌ | ❌ | ✅ |
| Human approval queue | ❌ | ❌ | ✅ |
| Stripe checkout | ❌ | ❌ | ✅ |
| Crypto (USDC/SOL) | ✅ | ❌ | ✅ |
| x402 native | ✅ | ❌ | ✅ |
| Audit trail | ❌ | ✅ | ✅ |

## Requirements

- Python 3.10+
- `x402>=2.0` (optional, for protocol integration)
- `stripe>=5.0` (optional, for checkout fallback)
- `solana>=0.30` (optional, for Solana payments)

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.

## Links

- **Website:** [bonanza-labs.com](https://bonanza-labs.com)
- **Live Demo:** [bonanza-labs.com/firewall](https://bonanza-labs.com/firewall)
- **x402 Protocol:** [github.com/x402-foundation/x402](https://github.com/x402-foundation/x402)
- **Agent Wallet:** [github.com/c6zks4gssn-droid/bonanza-labs-website](https://github.com/c6zks4gssn-droid/bonanza-labs-website)

---

Built by [Bonanza Labs](https://bonanza-labs.com) 🧨