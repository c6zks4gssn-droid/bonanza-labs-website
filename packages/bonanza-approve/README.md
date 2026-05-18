# ✅ Bonanza Approve

> **Human-in-the-loop approval gateway for AI agents — queue sensitive actions, notify humans, collect decisions**

[![PyPI](https://img.shields.io/badge/pypi-bonanza--approve-blue)](https://pypi.org/project/bonanza-approve/)
[![Python](https://img.shields.io/badge/python-3.10%2B-green)](https://pypi.org/project/bonanza-approve/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

AI agents need guardrails. But not everything should be blocked — some actions just need human review. Bonanza Approve gives you a simple approval queue with Telegram, Slack, email, and webhook notifications.

## Why?

AI agents can do a lot, but some actions are too sensitive to automate:
- **Payments** over a threshold
- **File deletions** in production
- **API calls** to expensive services
- **Data exports** with PII

Bonanza Approve queues these actions and notifies a human for review.

## Installation

```bash
pip install bonanza-approve
```

With Telegram notifications:

```bash
pip install bonanza-approve[telegram]
```

## Quick Start

```python
from bonanza_approve import ApprovalGateway

# Create a gateway with auto-approve for low-risk, auto-reject for high-risk
gw = ApprovalGateway(
    name="my-agent",
    auto_approve_below=0.2,   # Auto-approve risk < 0.2
    auto_reject_above=0.8,    # Auto-reject risk > 0.8
)

# Request approval for a payment
request = gw.request_approval(
    action="payment",
    description="Pay $5.00 for weather API data",
    amount_usd=5.00,
    vendor="api.weather.com",
    risk_score=0.3,           # Between 0.2 and 0.8 → needs human review
)
# Output:
# 🔔 Approval Request: payment
#    ID: abc-123-def
#    Description: Pay $5.00 for weather API data
#    Amount: $5.00
#    Vendor: api.weather.com
#    Risk: low (0.30)
#    Status: pending

# Human approves via Telegram/Slack/webhook:
decision = gw.approve(request.request_id, decided_by="admin")
print(decision.status)  # ApprovalStatus.APPROVED

# Or rejects:
decision = gw.reject(request.request_id, decided_by="admin", reason="Too expensive")
```

## Features

### 🤖 Auto-Approval Rules

```python
gw = ApprovalGateway(
    auto_approve_below=0.2,  # Risk < 0.2 → auto-approve
    auto_reject_above=0.8,   # Risk > 0.8 → auto-reject
)
# Everything in between → queued for human review
```

### 🔔 Multi-Channel Notifications

```python
# Console (default)
gw = ApprovalGateway(notification_channel=NotificationChannel.CONSOLE)

# Custom handler (Telegram, Slack, email, etc.)
def send_to_telegram(request):
    bot.send_message(chat_id, f"🔔 Approval needed: {request.description}")

gw = ApprovalGateway(notification_handler=send_to_telegram)
```

### 📋 Full Approval Workflow

```python
# Request → Notify → Approve/Reject → Callback

# 1. Request
request = gw.request_approval(action="payment", description="Pay $5", amount_usd=5.00, risk_score=0.3)

# 2. Notify (automatic via notification_handler)

# 3. Approve or reject
decision = gw.approve(request.request_id, decided_by="admin", reason="Looks safe")
# OR
decision = gw.reject(request.request_id, decided_by="admin", reason="Over budget")

# 4. Get stats
print(gw.stats())
# {"total": 1, "pending": 0, "approved": 1, "rejected": 0, "total_approved_usd": 5.00}
```

### 💾 Persistent Storage

```python
# In-memory (default, for testing)
from bonanza_approve import MemoryStore
gw = ApprovalGateway(store=MemoryStore())

# File-based (for production)
from bonanza_approve import FileStore
gw = ApprovalGateway(store=FileStore("~/.bonanza/approvals"))
```

### 📊 Statistics

```python
stats = gw.stats()
# {
#   "total": 15,
#   "pending": 2,
#   "approved": 10,
#   "rejected": 3,
#   "total_approved_usd": 42.50,
#   "total_rejected_usd": 150.00,
#   "approval_rate": 76.9
# }
```

### 🎯 Event Callbacks

```python
# Register callbacks for events
gw.on("approve", lambda d: process_payment(d))
gw.on("reject", lambda d: cancel_payment(d))
gw.on("request", lambda r: send_notification(r))
```

## Comparison

| Feature | Bonanza Approve | AgentGate | Invariant | HumanLayer |
|---------|----------------|-----------|-----------|------------|
| Approval queue | ✅ | ✅ | ❌ | ✅ |
| Auto-approve/reject | ✅ | ❌ | ❌ | ✅ |
| Risk-based routing | ✅ | ❌ | ❌ | ❌ |
| Multi-channel notifications | ✅ | ❌ | ❌ | ✅ |
| Telegram integration | ✅ | ❌ | ❌ | ✅ |
| Slack integration | ✅ | ❌ | ❌ | ✅ |
| Custom callbacks | ✅ | ❌ | ❌ | ✅ |
| Statistics | ✅ | ❌ | ✅ | ❌ |
| Persistent storage | ✅ | ✅ | ✅ | ✅ |
| Zero dependencies | ✅ | ❌ | ❌ | ❌ |
| Python-native | ✅ | ❌ | ✅ | ❌ |

## API Reference

| Method | Description |
|--------|-------------|
| `request_approval()` | Submit a request for human approval |
| `approve()` | Approve a pending request |
| `reject()` | Reject a pending request |
| `cancel()` | Cancel a pending request |
| `get_request()` | Get a request by ID |
| `list_pending()` | List pending requests |
| `list_all()` | List all requests |
| `stats()` | Get approval statistics |
| `on()` | Register event callback |

## Requirements

- Python 3.10+

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.

## Links

- **Website:** [bonanza-labs.com](https://bonanza-labs.com)
- **x402 Adapter:** [pypi.org/project/bonanza-x402](https://pypi.org/project/bonanza-x402/)
- **MCP Server:** [pypi.org/project/bonanza-mcp](https://pypi.org/project/bonanza-mcp/)
- **Guard:** [pypi.org/project/bonanza-guard](https://pypi.org/project/bonanza-guard/)
- **Observe:** [pypi.org/project/bonanza-observe](https://pypi.org/project/bonanza-observe/)
- **GitHub:** [github.com/c6zks4gssn-droid/bonanza-labs-website](https://github.com/c6zks4gssn-droid/bonanza-labs-website)

---

Built by [Bonanza Labs](https://bonanza-labs.com) ✅