# 🧨 Bonanza Labs ✦ Agent Wallet

**The missing payment layer for AI agents.**

[![PyPI](https://img.shields.io/badge/version-0.1.0-blue)](https://pypi.org/project/agent-wallet/) [![License](https://img.shields.io/badge/license-Apache%202.0-green)](LICENSE) [![Python](https://img.shields.io/badge/python-3.10%2B-blue)](https://python.org)

## The Problem
AI agents can browse, code, and create — but they can't pay for anything.
Every API call, every SaaS subscription, every micro-transaction requires a human.

## The Solution
Agent Wallet gives AI agents:
- 💳 A wallet with budget limits
- 🔒 Policy-based approval (auto-approve under $X, human approval above)
- 📊 Spending tracking & analytics
- ⚡ Instant settlements (USDC/USD1 on BSC, Solana)
- 🖥️ REST API + CLI + Dashboard

## Quick Start

```bash
pip install agent-wallet

# Create a wallet
agent-wallet create --name MyAgent --chain solana --budget 100

# Propose a payment
agent-wallet pay <wallet-id> 3.50 --recipient alice --description "API call"

# Check balance
agent-wallet balance <wallet-id>

# View analytics
agent-wallet analytics <wallet-id>
```

## Policy Engine

Auto-approve small payments, require human approval for large ones:

```yaml
# policy.yaml
name: default
auto_approve_under: 5.0
human_approval_above: 5.0
daily_limit: 100.0
monthly_limit: 500.0
allowed_chains: [solana, bsc]
blocked_recipients: []
cooldown_seconds: 60
max_transactions_per_day: 50
```

## REST API

```bash
pip install agent-wallet[dashboard]
uvicorn agent_wallet.api.server:app --port 8000
```

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/wallets` | POST | Create wallet |
| `/wallets` | GET | List wallets |
| `/wallets/{id}` | GET | Get wallet |
| `/wallets/{id}/pay` | POST | Propose payment |
| `/wallets/{id}/transactions/{tid}/approve` | POST | Approve/reject |
| `/wallets/{id}/analytics` | GET | Spending analytics |

## Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   CLI / API  │───▶│ Policy Engine │───▶│  Settlement  │
│   (FastAPI)  │    │  (YAML rules) │    │ (Solana/BSC)│
└─────────────┘    └──────────────┘    └─────────────┘
                          │
                    ┌─────┴─────┐
                    │  Approval  │
                    │   Queue    │
                    └───────────┘
```

## Revenue Model
- **Free:** 1 agent, $50/mo limit
- **Pro:** $29/mo — 10 agents, $5K/mo, analytics
- **Enterprise:** $199/mo — unlimited, custom policies, SSO

## License
Apache 2.0 — © Bonanza Labs
