# Bonanza App Forge

**Visual idea → working app in minutes.**

## Install

```bash
pip install bonanza-app-forge
```

## Quick Start

```bash
# Set API keys
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-...

# Generate an app
bonanza-forge "SaaS dashboard with donut chart and sidebar"

# Use local Ollama
bonanza-forge "Portfolio site" --local

# From existing mockup
bonanza-forge --from-image mockup.png

# Generate + build + deploy
bonanza-forge "AI startup landing page" --deploy tiiny --domain my-app.tiiny.site
```

## Architecture

```
Prompt → GPT Image 2 (mockup) → Claude (code) → Next.js (build) → Deploy
```

## License

MIT © Bonanza Labs