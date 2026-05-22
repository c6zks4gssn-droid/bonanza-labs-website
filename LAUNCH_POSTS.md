# Bonanza Labs — Launch Post Drafts

## HackerNews Show HN Post

**Title:** Show HN: Bonanza – The spending firewall for AI agents

**Body:**
We built Bonanza because AI agents making payments without oversight is a ticking time bomb.

The problem: As AI agents get more autonomy (booking flights, buying API credits, executing trades), there's no standard way to say "this action needs human approval first." An agent with access to your Stripe key can spend unlimited money.

Our solution: A spending firewall that sits between your AI agent and any payment action:

- Define policies (auto-approve <$10, require approval >$100, deny >$1000)
- Risk scoring per request (amount, frequency, recipient)
- Human-in-the-loop approval via Telegram, Slack, or web dashboard
- Full audit trail of every spending decision

We published 5 PyPI packages:
- `bonanza-x402` — Spending firewall for HTTP 402 payment protocol (11 tests)
- `bonanza-approve` — Human-in-the-loop approval gateway (19 tests)
- `bonanza-guard` — Security guardrails: 28 injection attacks + 9 PII detection + toxicity (24 tests)
- `bonanza-observe` — Cost observability: sessions, spans, budget tracking (10 tests)
- `bonanza-mcp` — MCP server exposing 7 payment tools to any MCP-compatible agent

All packages are Apache-2.0, tested, and on PyPI. The website has a live dashboard demo.

We'd love feedback on: policy syntax, integration with existing agent frameworks (LangChain, CrewAI), and what approval channels you'd want.

---

## Reddit r/MachineLearning or r/LocalLLaMA Post

**Title:** Built a spending firewall for AI agents — because giving GPT your credit card unchecked is insane

**Body:**
We kept seeing people give AI agents full access to Stripe keys, AWS credentials, and payment endpoints with zero oversight. So we built Bonanza — a spending firewall.

Key features:
- Policy-based: auto-approve small stuff, block big stuff, flag everything in between
- Approval gateway: Telegram/Slack/web dashboard for human review
- Audit trail: every spending decision logged with risk score
- Guard rails: prompt injection detection (28 patterns), PII leak prevention, toxicity scoring

All 5 packages are open source on PyPI. Install: `pip install bonanza-x402 bonanza-approve bonanza-guard`

What approval flow do you use for agent spending? We're looking to add more integrations.

---

## Blog Post for bonanza-labs.com

**Title:** Why AI Agents Need a Spending Firewall

AI agents are getting financial autonomy. They're booking flights, buying API credits, provisioning servers, and executing trades. But here's the problem nobody talks about:

**There is no "are you sure?" for AI spending.**

When an agent decides to spend $500 on compute, there's no confirmation dialog. No "this seems unusual" alert. No audit trail. Just... the money is gone.

### The risks are real

- **Prompt injection** can trick agents into unauthorized purchases
- **Budget overruns** happen when agents retry failed purchases 100x
- **No accountability** — who approved what, when, and why?
- **Compliance** — GDPR, SOX, and internal policies require spending oversight

### Introducing Bonanza

Bonanza is the spending firewall for AI agents. It sits between your agent and any payment action, enforcing policies you define:

1. **Auto-approve** low-risk, low-value actions (<$10, known vendors)
2. **Require approval** for medium-risk actions (new vendor, unusual amount)
3. **Auto-deny** high-risk actions (exceeds budget, known scam patterns)

Every decision gets a risk score and is logged to an audit trail. For actions that need human review, we notify via Telegram, Slack, or a web dashboard where you can approve or deny with one click.

### Five packages, one mission

| Package | Purpose | Tests |
|---------|---------|-------|
| bonanza-x402 | HTTP 402 payment firewall | 11/11 |
| bonanza-approve | Human-in-the-loop gateway | 19/19 |
| bonanza-guard | Security guardrails | 24/24 |
| bonanza-observe | Cost observability | 10/10 |
| bonanza-mcp | MCP server for agent tools | — |

All Apache-2.0. All on PyPI. All tested.

### Get started

```bash
pip install bonanza-x402
```

Define your first policy and start protecting your agent's wallet.

The future of AI is autonomous. But autonomy without oversight is just chaos.

---

*X Post:*
Built a spending firewall for AI agents. Because giving GPT your Stripe key unchecked is… a choice. 5 PyPI packages, all tested, all open source. 🔥

bonanza-labs.com

#AISafety #AgentPayments #OpenSource