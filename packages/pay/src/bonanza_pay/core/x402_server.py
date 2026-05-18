"""x402 payment middleware for Bonanza Labs services.

Makes Bonanza Labs APIs x402-compatible for Agentic.Market listing.
AI agents can discover and pay for our services via HTTP 402 protocol.
"""

from __future__ import annotations
from fastapi import FastAPI, Request, Response
from x402 import (
    x402ResourceServerSync,
    RoutesConfig,
    Price,
    AssetAmount,
    ResourceConfig,
    PaywallConfig,
    X402_VERSION,
)

# ─── Service pricing (per API call) ───

BONANZA_X402_ROUTES = {
    # Search API — $0.001 per search (sub-cent micropayment)
    "GET /api/search": ResourceConfig(
        scheme="exact",
        pay_to="",  # Set your Base wallet address
        price=AssetAmount(amount="1000", asset="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
        network="base",
        description="Web search and content extraction — returns up to 10 results",
    ),
    # Extract API — $0.005 per extraction
    "GET /api/extract": ResourceConfig(
        scheme="exact",
        pay_to="",
        price=AssetAmount(amount="5000", asset="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
        network="base",
        description="Extract text content from any URL — up to 5000 chars",
    ),
    # Video generation — $0.10 per video
    "POST /api/video": ResourceConfig(
        scheme="exact",
        pay_to="",
        price=AssetAmount(amount="100000", asset="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
        network="base",
        description="Generate AI video — script + voiceover + animation, MP4 output",
    ),
    # Fork Doctor — $0.01 per repo check
    "GET /api/doctor": ResourceConfig(
        scheme="exact",
        pay_to="",
        price=AssetAmount(amount="10000", asset="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
        network="base",
        description="13-point repo health check — CI/CD, security, SBOM, Dev Container",
    ),
    # Agent Wallet — $0.02 per wallet operation
    "POST /api/wallet": ResourceConfig(
        scheme="exact",
        pay_to="",
        price=AssetAmount(amount="20000", asset="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
        network="base",
        description="Agent wallet operations — create, pay, approve, settle",
    ),
    # Analytics — $0.005 per query
    "GET /api/analytics": ResourceConfig(
        scheme="exact",
        pay_to="",
        price=AssetAmount(amount="5000", asset="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
        network="base",
        description="Privacy-first analytics — page views, unique visitors, AI insights",
    ),
}

# USDC on Base: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
# USDC on Solana: EPjFWdd5AufqSSqeM2qN1xzyBapZU1mP5Rr9EBpEgJqW


class BonanzaX402Server:
    """x402-enabled Bonanza Labs API server."""

    def __init__(self, receiver_address: str = "", facilitator_url: str = "https://x402.org/facilitator"):
        self.receiver_address = receiver_address  # Your Base wallet address
        self.facilitator_url = facilitator_url
        self.routes = BONANZA_X402_ROUTES

    def create_app(self) -> FastAPI:
        """Create a FastAPI app with x402 payment middleware."""
        app = FastAPI(title="Bonanza Labs x402 API", version="0.1.0")

        # Health check (free)
        @app.get("/")
        def root():
            return {
                "name": "Bonanza Labs x402 API",
                "version": "0.1.0",
                "x402_version": X402_VERSION,
                "services": list(BONANZA_X402_ROUTES.keys()),
                "network": "base",
                "asset": "USDC",
            }

        # Service discovery (Agentic.Market compatible)
        @app.get("/.well-known/x402")
        def x402_discovery():
            # Build discovery from route configs
            services = []
            for path, config in BONANZA_X402_ROUTES.items():
                try:
                    desc = getattr(config, 'description', path)
                    price_amount = getattr(config.price, 'amount', config.price)
                    amount_str = str(getattr(price_amount, 'amount', '0'))
                    net = getattr(price_amount, 'network', 'base')
                    services.append({
                        "path": path,
                        "description": desc if isinstance(desc, str) else path,
                        "price_usdc": f"${int(amount_str) / 1_000_000:.4f}",
                        "network": net,
                    })
                except Exception:
                    services.append({"path": path, "description": path, "price_usdc": "unknown", "network": "base"})
            return {
                "services": services,
                "receiver": self.receiver_address or "not_configured",
                "x402_version": X402_VERSION,
            }

        # Free tier endpoints (no x402 required)
        @app.get("/api/plans")
        def plans():
            return {
                "free": {"search": "10/day", "video": "1/day", "doctor": "3/day"},
                "pro": {"search": "unlimited", "video": "50/day", "doctor": "unlimited"},
            }

        return app

    def get_marketplace_listing(self) -> dict:
        """Generate Agentic.Market listing metadata."""
        return {
            "name": "Bonanza Labs",
            "description": "Open source AI tools — search, video generation, repo health, agent payments, analytics",
            "website": "https://bonanza-labs.tiiny.site",
            "github": "https://github.com/c6zks4gssn-droid",
            "x402_enabled": True,
            "networks": ["base", "solana"],
            "asset": "USDC",
            "services": [
                {
                    "name": "Bonanza Search",
                    "endpoint": "GET /api/search",
                    "price": "$0.001/call",
                    "description": "Web search + content extraction for AI agents",
                },
                {
                    "name": "FrameForge Video",
                    "endpoint": "POST /api/video",
                    "price": "$0.10/call",
                    "description": "AI video generation — script → voiceover → MP4",
                },
                {
                    "name": "Fork Doctor",
                    "endpoint": "GET /api/doctor",
                    "price": "$0.01/call",
                    "description": "13-point repo health check",
                },
                {
                    "name": "Agent Wallet",
                    "endpoint": "POST /api/wallet",
                    "price": "$0.02/call",
                    "description": "Policy-based agent payments",
                },
                {
                    "name": "Bonanza Analytics",
                    "endpoint": "GET /api/analytics",
                    "price": "$0.005/call",
                    "description": "Privacy-first analytics with AI insights",
                },
            ],
        }


if __name__ == "__main__":
    server = BonanzaX402Server()
    app = server.create_app()

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)