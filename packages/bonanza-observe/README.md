# 📊 Bonanza Observe

> **AI agent cost observability — track spending, latency, and token usage across all your agent sessions**

[![PyPI](https://img.shields.io/badge/pypi-bonanza--observe-blue)](https://pypi.org/project/bonanza-observe/)
[![Python](https://img.shields.io/badge/python-3.10%2B-green)](https://pypi.org/project/bonanza-observe/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

Stop guessing how much your AI agents cost. Bonanza Observe gives you real-time cost tracking, token usage analytics, and latency monitoring for every LLM call.

## Why?

AI agents make dozens of LLM calls per task. Without observability:
- **You don't know what you're spending** until the bill arrives
- **You can't optimize** what you can't measure
- **You can't budget** without tracking

Bonanza Observe is the missing `open()` for AI agent economics.

## Installation

```bash
pip install bonanza-observe
```

## Quick Start

```python
from bonanza_observe import Tracker

# Create a tracker with a budget
tracker = Tracker(name="my-agent", budget_usd=10.00)

# Start tracking
session = tracker.start_session("research-task")

# Track LLM calls
span = tracker.start_span("web-search")
tracker.record_cost(
    provider="openai",
    model="gpt-4o",
    input_tokens=1500,
    output_tokens=800,
    latency_ms=1200,
)
tracker.finish_span()

# Check your budget
print(tracker.check_budget())
# {
#   "total_usd": 0.01175,
#   "budget_usd": 10.00,
#   "remaining_usd": 9.98825,
#   "percentage": 0.12,
#   "over_budget": False,
#   "alert": False
# }

# Get a full summary
print(tracker.summary())
# {
#   "total_cost_usd": 0.01175,
#   "total_tokens": 2300,
#   "by_model": {"gpt-4o": {"cost": 0.01175, "calls": 1}},
#   "by_provider": {"openai": {"cost": 0.01175, "calls": 1}},
#   ...
# }
```

## Features

### 💰 Cost Tracking

- Per-model, per-provider cost breakdown
- Auto-calculates cost from token counts (supports GPT-4o, Claude 3.5, Gemini, Llama, and more)
- Manual cost override for custom pricing
- Budget alerts at configurable thresholds (default 80%)

### 📊 Token Usage

- Input/output/total token tracking per call
- Aggregate stats across sessions
- Per-model token breakdown

### ⏱️ Latency Monitoring

- Per-call latency tracking
- Average latency across sessions
- Nested span timing

### 📁 Session Management

- Group calls into sessions and spans
- Nested spans for complex agent workflows
- Tags for filtering and grouping

### 📤 Export

```python
from bonanza_observe import Tracker, JsonExporter, CsvExporter

tracker = Tracker(name="my-agent")
# ... track calls ...

# Export as JSON
json_str = JsonExporter.export(tracker)
JsonExporter.save(tracker, "costs.json")

# Export as CSV
csv_str = CsvExporter.export(tracker)
CsvExporter.save(tracker, "costs.csv")
```

## Supported Models (Pricing)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| GPT-4o | $2.50 | $10.00 |
| GPT-4o Mini | $0.15 | $0.60 |
| GPT-4 Turbo | $10.00 | $30.00 |
| Claude 3.5 Sonnet | $3.00 | $15.00 |
| Claude 3 Haiku | $0.25 | $1.25 |
| Claude 3 Opus | $15.00 | $75.00 |
| Gemini 1.5 Pro | $1.25 | $5.00 |
| Gemini 1.5 Flash | $0.075 | $0.30 |
| Llama 3.1 70B | $0.60 | $0.60 |
| Llama 3.1 8B | $0.05 | $0.05 |

## Comparison

| Feature | Bonanza Observe | Revenium | Helicone | LangSmith |
|---------|----------------|----------|----------|-----------|
| Cost tracking | ✅ | ✅ | ✅ | ✅ |
| Token tracking | ✅ | ✅ | ✅ | ✅ |
| Latency monitoring | ✅ | ✅ | ✅ | ✅ |
| Budget alerts | ✅ | ✅ | ❌ | ✅ |
| Session/span grouping | ✅ | ❌ | ❌ | ✅ |
| JSON/CSV export | ✅ | ✅ | ✅ | ✅ |
| Nested spans | ✅ | ❌ | ❌ | ❌ |
| Auto cost calculation | ✅ | ✅ | ✅ | ❌ |
| Zero dependencies | ✅ | ❌ | ❌ | ❌ |
| Self-hosted | ✅ | ✅ | ❌ | ❌ |
| Python-native | ✅ | ❌ | ✅ | ✅ |

## Requirements

- Python 3.10+

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.

## Links

- **Website:** [bonanza-labs.com](https://bonanza-labs.com)
- **x402 Adapter:** [pypi.org/project/bonanza-x402](https://pypi.org/project/bonanza-x402/)
- **MCP Server:** [pypi.org/project/bonanza-mcp](https://pypi.org/project/bonanza-mcp/)
- **Guard:** [pypi.org/project/bonanza-guard](https://pypi.org/project/bonanza-guard/)
- **GitHub:** [github.com/c6zks4gssn-droid/bonanza-labs-website](https://github.com/c6zks4gssn-droid/bonanza-labs-website)

---

Built by [Bonanza Labs](https://bonanza-labs.com) 📊