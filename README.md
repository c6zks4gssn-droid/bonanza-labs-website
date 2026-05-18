# 🧨 Bonanza Labs — AI Tools for the Autonomous Economy

Open source AI tools for builders. Spending firewall, tender analysis, repo health, and more.

[![Live](https://img.shields.io/badge/live-bonanza--labs.com-emerald?style=flat-square)](https://bonanza-labs.com)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

## 🚀 Products

| Product | Description | Status |
|---------|-------------|--------|
| **Agent Wallet** | Spending firewall for AI agents — policy checks, risk scoring, approval queue, audit log, Stripe checkout | ✅ Live v1.0 |
| **TenderAI** | AI-powered tender/offerte analysis and generation for the NL/BE market | 🧪 Beta |
| **Fork Doctor** | GitHub repo health checker — 13 automated infrastructure checks | ✅ v0.3.0 |
| **FrameForge** | AI video generator — script to voiceover to MP4 | 🧪 Beta |
| **GasVrij** | Energy transition lead gen for Groningen | ✅ Live |
| **Intel** | AI-powered competitive intelligence | ✅ Live |

## 📦 Monorepo Structure

```
bonanza-labs-website/
├── src/                    # Next.js website (bonanza-labs.com)
├── packages/
│   ├── agent-wallet/       # 💰 Spending firewall for AI agents
│   ├── agents/             # 🤖 Agent CLI (pip install bonanza-agents)
│   ├── cli/                # 🧨 Unified CLI (pip install bonanza-labs)
│   ├── fork-doctor/        # 🩺 Repo health checker
│   ├── frameforge/         # 🎬 AI video generator
│   ├── pay/                # 💳 Stripe + Stablecoin payments
│   ├── analytics/          # 📊 Bonanza analytics
│   ├── webhooks/           # 🔗 Webhook handlers
│   ├── search/             # 🔍 Search utilities
│   ├── auth/               # 🔐 Authentication
│   └── app-forge/          # 🏗️ App scaffolding
└── README.md
```

## 🛠️ Quick Start

```bash
# Install the unified CLI
pip install bonanza-labs

# Or install individual tools
pip install fork-doctor
pip install bonanza-labs[video]
pip install bonanza-agents
```

## 🌐 Live Sites

- **Main:** [bonanza-labs.com](https://bonanza-labs.com)
- **Firewall Demo:** [bonanza-labs.com/firewall](https://bonanza-labs.com/firewall)
- **GasVrij:** [bonanza-labs.com/gasvrij](https://bonanza-labs.com/gasvrij)
- **TenderAI:** [bonanza-labs.com/tenderai](https://bonanza-labs.com/tenderai)

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

Apache License 2.0 — see [LICENSE](LICENSE) for details.

---

Built by [Bonanza Labs](https://bonanza-labs.com) 🧨