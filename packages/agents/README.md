# bonanza labs agents 

🤖 AI agent orchestration framework

Part of [Bonanza Labs](https://github.com/c6zks4gssn-droid) — open source AI tools for builders.

## Install

```bash
pip install bonanza-agents
```

## Quick Start

```bash
bonanza-agents --help
```

## Features

- Open source (Apache 2.0)
- CLI + REST API
- Built for AI agents
- Agent Wallet budget controls
- Spending Firewall for policy decisions before money moves
- Stripe Link CLI integration for user-approved agent purchases
- Machine Payments Protocol (MPP) helper for HTTP 402 payments

## Agent Wallet + Stripe Link CLI

Bonanza Agent Wallet sits above Stripe's Link CLI:

- agents request spend
- Bonanza checks local budget limits
- Stripe Link handles user approval and one-time-use credentials
- no card details are stored by Bonanza

```bash
# Check Link auth
bonanza-agents wallet status

# Start Link login/approval flow
bonanza-agents wallet login --client-name "Bonanza Agent Wallet"

# List Link payment methods
bonanza-agents wallet payment-methods

# Create a test spend request
bonanza-agents wallet spend \
  --agent-id agent_demo \
  --payment-method-id csmrpd_xxx \
  --merchant-name "Stripe Press" \
  --merchant-url "https://press.stripe.com" \
  --context "Purchasing a small product through Bonanza Agent Wallet. The user initiated this test and Bonanza enforces budget controls before Stripe Link approval." \
  --amount 3500 \
  --test

# Spending Firewall dry-run: allow / deny / require approval
bonanza-agents wallet firewall-check \
  --agent-id agent_demo \
  --merchant-name "OpenAI" \
  --merchant-url "https://openai.com" \
  --amount 900 \
  --allow-vendor openai.com

# Region-safe fallback: manual approval request, no Link required
bonanza-agents wallet request \
  --agent-id agent_demo \
  --merchant-name "Bonanza Agent Wallet Demo" \
  --merchant-url "https://bonanza-labs.com" \
  --context "Demo purchase request from an AI agent. Bonanza checks the budget first, then a human approves before Stripe Checkout test mode is created." \
  --amount 900 \
  --budget 25 \
  --firewall \
  --allow-vendor bonanza-labs.com \
  --approval-threshold 500

# Review firewall audit log
bonanza-agents wallet firewall-audit

# Approve manually
bonanza-agents wallet approve lsrq_xxx

# Create Stripe Checkout session in test mode only
STRIPE_SECRET_KEY=sk_test_xxx bonanza-agents wallet checkout-test lsrq_xxx

# Pay an MPP endpoint with an approved shared_payment_token spend request
bonanza-agents wallet mpp-pay https://example.com/api/paid-resource \
  --spend-request-id lsrq_xxx \
  --method POST \
  --data '{"amount":100}'
```

## Documentation

Full docs at [bonanza-labs.tiiny.site](https://bonanza-labs.tiiny.site)

## License

Apache License 2.0
