<img src="https://raw.githubusercontent.com/c6zks4gssn-droid/bonanza-labs-website/main/public/bonanza-labs-logo-256.png" alt="Bonanza Labs" width="128" />

# 🧨 Bonanza Labs CLI

One command for all Bonanza Labs AI tools.

## Install

```bash
pip install bonanza-labs
```

## Usage

```bash
# Generate a video
bonanza video "AI Agents Are the Future" --style viral --format 9:16

# Check repo health
bonanza doctor openclaw/openclaw

# Agent wallet
bonanza wallet create --chain solana --budget 100
bonanza wallet balance
bonanza wallet analytics
```

## Commands

| Command | Description |
|---------|-------------|
| `bonanza video` | Generate videos from topics (FrameForge) |
| `bonanza doctor` | Check repository health (Fork Doctor) |
| `bonanza wallet` | Manage AI agent payments (Agent Wallet) |

## Optional Dependencies

```bash
pip install bonanza-labs[video]    # Edge-TTS for voiceover
pip install bonanza-labs[doctor]   # PyYAML + GitPython
pip install bonanza-labs[wallet]   # Solana + Web3
```

## License

Apache 2.0 — © Bonanza Labs