<img src="https://raw.githubusercontent.com/c6zks4gssn-droid/bonanza-labs-website/main/public/bonanza-labs-logo-256.png" alt="Bonanza Labs" width="128" />

# 🔨 Bonanza App Forge

**Visual idea → working app in minutes.**

Combines image generation (GPT Image 2 / DALL-E) with AI coding (Claude / Ollama) to turn any visual concept into a deployable web app.

## How it works

```
1. You describe what you want
2. We generate a visual mockup
3. AI reads the mockup and writes the code
4. You get a working app ready to deploy
```

## Install

```bash
pip install bonanza-app-forge
```

## Usage

```bash
# Generate an app from a visual idea
bonanza-forge "SaaS dashboard with donut chart and sidebar"

# With options
bonanza-forge "Landing page for AI startup" --style modern --framework nextjs --deploy tiiny

# Skip image generation, go straight to code from a sketch
bonanza-forge --from-image mockup.png

# Use local Ollama instead of cloud APIs
bonanza-forge "Portfolio site" --local
```

## Architecture

```
Prompt → Mockup Generator → Code Generator → Build → Deploy
         (GPT Image 2)      (Claude/Ollama)   (Next.js)  (tiiny/Vercel)
```

### Mockup Generator
- GPT Image 2 / DALL-E 3 for cloud
- Stable Diffusion (local) via Ollama

### Code Generator
- Claude 3.5 Sonnet (cloud, best quality)
- Ollama Gemma 4 / Qwen 3.5 (local, private)
- Reads the mockup image and generates matching Next.js + Tailwind code

### Templates
- Landing page
- SaaS dashboard
- E-commerce
- Portfolio
- Blog
- Documentation

### Deploy
- tiiny.host (instant, free)
- Vercel (production)
- Local preview

## Configuration

```bash
# Set API keys (one-time)
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-...

# Or use Ollama locally (no API keys needed)
bonanza-forge config --local true
```

## Examples

```bash
# AI startup landing page
bonanza-forge "Minimal landing page for an AI coding assistant with pricing table"

# E-commerce store
bonanza-forge "Online store for handmade jewelry with cart and checkout"

# Data dashboard
bonanza-forge "Analytics dashboard with charts, filters, and export buttons"

# From your own mockup
bonanza-forge --from-image my-design.png
```

## License

MIT © Bonanza Labs