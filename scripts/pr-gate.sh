#!/usr/bin/env bash
# Eén controle voor elke wijziging aan deze site — voor mens én AI-agent.
#
# Gebruik:
#   bash scripts/pr-gate.sh                 # volledige controle (installeren + typecheck + build)
#   bash scripts/pr-gate.sh --snel          # alleen typecheck + build (node_modules moet bestaan)
#   bash scripts/pr-gate.sh --smoke <url>   # plus de rooktest tegen een preview-URL
#
# Waarom dit bestaat: een bouwronde hoort precies één meetlat te hebben. Zonder dit
# bestand gokt elke agent (GPT, Hermes, mens) wat "klaar" betekent, en betaal je
# herwerk bij de duurste partij. Deze controle is dezelfde als in CI.

set -euo pipefail

SNEL=0
SMOKE_URL=""

while [ $# -gt 0 ]; do
  case "$1" in
    --snel) SNEL=1; shift ;;
    --smoke) SMOKE_URL="${2:-}"; shift 2 ;;
    *) echo "Onbekende optie: $1" >&2; exit 2 ;;
  esac
done

cd "$(dirname "$0")/.."
echo "── PR-gate: $(pwd)"

# pnpm beschikbaar maken zonder globale installatie
if ! command -v pnpm >/dev/null 2>&1; then
  if command -v corepack >/dev/null 2>&1; then
    corepack enable >/dev/null 2>&1 || true
    corepack prepare pnpm@10 --activate >/dev/null 2>&1 || true
  fi
fi
if ! command -v pnpm >/dev/null 2>&1; then
  echo "FOUT: pnpm niet gevonden. Installeer met: corepack enable && corepack prepare pnpm@10 --activate" >&2
  exit 1
fi

if [ "$SNEL" -eq 0 ]; then
  echo "── 1/3 afhankelijkheden (bevroren lockfile)"
  pnpm install --frozen-lockfile
else
  echo "── 1/3 afhankelijkheden overgeslagen (--snel)"
fi

echo "── 2/3 types"
pnpm exec tsc --noEmit

echo "── 3/3 productiebuild"
pnpm build

if [ -n "$SMOKE_URL" ]; then
  echo "── rooktest tegen $SMOKE_URL"
  SITE_URL="$SMOKE_URL" pnpm test:smoke
fi

echo
echo "GESLAAGD — installatie, types en build zijn in orde."
