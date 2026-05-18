# 💳 Bonanza MCP

> **MCP server for AI agent payments — spending firewall, budget checks, and approval flows**

[![PyPI](https://img.shields.io/badge/pypi-bonanza--mcp-blue)](https://pypi.org/project/bonanza-mcp/)
[![Python](https://img.shields.io/badge/python-3.10%2B-green)](https://pypi.org/project/bonanza-mcp/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-compatible-purple)](https://modelcontextprotocol.io/)
[![x402](https://img.shields.io/badge/x402-compatible-orange)](https://github.com/x402-foundation/x402)

Use Bonanza's spending firewall directly from Claude, GPT, or any MCP-compatible AI agent. Check budgets, evaluate payments, approve spending, and audit transactions — all through natural language.

## Why?

AI agents are making payments, but they need guardrails. Bonanza MCP brings our [spending firewall](https://github.com/c6zks4gssn-droid/bonanza-labs-website/tree/main/packages/x402-adapter) to the [Model Context Protocol](https://modelcontextprotocol.io/) — the standard way AI models interact with tools.

Instead of writing custom code, your AI agent can simply call:

> "Check if I can pay $5.00 for weather data"
> "What's my remaining budget?"
> "Approve payment to api.premium-data.com"
> "Show my spending history"

## Installation

```bash
pip install bonanza-mcp
```

With x402 protocol support:

```bash
pip install bonanza-mcp[x402]
```

## Quick Start

### 1. Configure Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bonanza": {
      "command": "bonanza-mcp",
      "args": ["--max-budget", "10.00", "--require-approval-above", "5.00"]
    }
  }
}
```

### 2. Use in conversation

```
You: Check my budget
Claude: Your current spending is $2.50 out of $10.00 (25%). You have $7.50 remaining.

You: Can I pay $3.00 for API data from weather.com?
Claude: ✅ Payment approved: $3.00 to weather.com
   Reason: All checks passed
   Risk level: LOW (0.20)
   Remaining budget: $4.50

You: Pay $8.00 for premium AI analysis
Claude: ❌ Payment blocked: Session budget exceeded: $2.50 + $8.00 > $10.00

You: Pay $6.00 for verified data from api.trusted.com
Claude: ⏳ Requires human approval: $6.00 exceeds the approval threshold ($5.00)
   Approval URL: https://bonanza-labs.com/firewall/approve/abc-123
```

### 3. Use programmatically

```python
from bonanza_mcp import BonanzaMCPServer

server = BonanzaMCPServer(
    max_budget_usd=10.00,
    require_approval_above=5.00,
    trusted_vendors=["api.weather.com", "api.data.gov"],
    allowed_networks=["base", "solana"],
)

# Run as MCP server
server.run()
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `check_budget` | Show current spending and remaining budget |
| `evaluate_payment` | Evaluate a payment against firewall policy |
| `approve_payment` | Approve a pending payment |
| `reject_payment` | Reject a pending payment |
| `spending_history` | View recent spending with filters |
| `set_budget` | Update the budget for the current session |
| `add_vendor` | Add a vendor to the trusted list |
| `remove_vendor` | Remove a vendor from the trusted list |
| `risk_assessment` | Assess risk level for a vendor/amount |

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  AI Agent   │────▶│  Bonanza MCP     │────▶│  Firewall   │
│  (Claude/   │     │  Server           │     │  Engine     │
│   GPT/...)  │     │                  │     │             │
└─────────────┘     │  ┌────────────┐  │     │  ┌────────┐ │
                    │  │ Budget     │  │     │  │ Policy  │ │
                    │  │ Check      │──┼────▶│  │ Engine  │ │
                    │  ├────────────┤  │     │  └────────┘ │
                    │  │ Risk       │  │     │             │
                    │  │ Score      │  │     │  ┌────────┐ │
                    │  ├────────────┤  │     │  │ Audit   │ │
                    │  │ Vendor     │  │────▶│  │ Log     │ │
                    │  │ Allowlist  │  │     │  └────────┘ │
                    │  └────────────┘  │     └─────────────┘
                    └──────────────────┘
```

## Comparison

| Feature | bonanza-mcp | AgentBudget MCP | Lightning MCP |
|---------|-------------|-----------------|---------------|
| Budget limits | ✅ | ✅ | ❌ |
| Vendor allowlist | ✅ | ❌ | ❌ |
| Risk scoring | ✅ | ❌ | ❌ |
| Human approval queue | ✅ | ❌ | ❌ |
| Stripe checkout | ✅ | ❌ | ❌ |
| x402 integration | ✅ | ❌ | ❌ |
| Crypto (USDC/SOL) | ✅ | ❌ | ✅ |
| Audit trail | ✅ | ✅ | ❌ |
| MCP protocol | ✅ | ❌ | ✅ |

## Requirements

- Python 3.10+
- `mcp>=1.0.0`
- `pydantic>=2.0`
- `httpx>=0.24`

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.

## Links

- **Website:** [bonanza-labs.com](https://bonanza-labs.com)
- **Live Demo:** [bonanza-labs.com/firewall](https://bonanza-labs.com/firewall)
- **x402 Adapter:** [pypi.org/project/bonanza-x402](https://pypi.org/project/bonanza-x402/)
- **MCP Protocol:** [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- **GitHub:** [github.com/c6zks4gssn-droid/bonanza-labs-website](https://github.com/c6zks4gssn-droid/bonanza-labs-website)

---

Built by [Bonanza Labs](https://bonanza-labs.com) 🧨