"""Stablecoin payment handler — USDC/USDT via Stripe Crypto + direct on-chain."""

from __future__ import annotations
import os
from enum import Enum
from typing import Optional
from pydantic import BaseModel


class CryptoNetwork(str, Enum):
    SOLANA = "solana"
    ETHEREUM = "ethereum"
    BASE = "base"
    BSC = "bsc"
    POLYGON = "polygon"


class StablecoinType(str, Enum):
    USDC = "usdc"
    USDT = "usdt"
    USD1 = "usd1"


class CryptoPaymentRequest(BaseModel):
    """Request to create a stablecoin payment."""
    amount_usd: float
    coin: StablecoinType = StablecoinType.USDC
    network: CryptoNetwork = CryptoNetwork.SOLANA
    description: str = ""
    metadata: dict = {}


class CryptoPaymentResult(BaseModel):
    """Result of a stablecoin payment creation."""
    session_id: str = ""
    deposit_address: str = ""
    amount_usd: float
    coin: StablecoinType
    network: CryptoNetwork
    qr_code_url: str = ""
    checkout_url: str = ""
    expires_at: str = ""


# Known token addresses per network
TOKEN_ADDRESSES = {
    (StablecoinType.USDC, CryptoNetwork.SOLANA): "EPjFWdd5AufqSSqeM2qN1xzyBapZU1mP5Rr9EBpEgJqW",
    (StablecoinType.USDC, CryptoNetwork.BASE): "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    (StablecoinType.USDC, CryptoNetwork.ETHEREUM): "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    (StablecoinType.USDC, CryptoNetwork.BSC): "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    (StablecoinType.USDT, CryptoNetwork.SOLANA): "Es9v8Fr2zT7w4s9eHvyJ7fK7q2mXeB3qmZ9N5dR3fW5J",
    (StablecoinType.USDT, CryptoNetwork.ETHEREUM): "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    (StablecoinType.USDT, CryptoNetwork.BASE): "0x50c49a256A5F7C6e5eE38774aF1BD3a4a0B4c5E6",  # USDbC (bridged USDT on Base)
    (StablecoinType.USD1, CryptoNetwork.BSC): "0x8020.bedrock",  # Placeholder
    (StablecoinType.USD1, CryptoNetwork.BASE): "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  # USDC proxy on Base
}


class StablecoinHandler:
    """Handle stablecoin payments via Stripe Crypto and direct on-chain."""

    def __init__(self, stripe_client=None):
        self.stripe = stripe_client

    def create_payment(self, request: CryptoPaymentRequest) -> CryptoPaymentResult:
        """Create a stablecoin payment.

        Tries Stripe Crypto first, falls back to direct deposit address.
        """
        # Try Stripe Crypto checkout
        if self.stripe and self.stripe.config.secret_key:
            try:
                result = self.stripe.create_crypto_payment(
                    amount_usd=request.amount_usd,
                    networks=[request.network.value],
                    description=request.description,
                    metadata=request.metadata,
                )
                return CryptoPaymentResult(
                    session_id=result.get("session_id", ""),
                    checkout_url=result.get("url", ""),
                    amount_usd=request.amount_usd,
                    coin=request.coin,
                    network=request.network,
                )
            except Exception as e:
                print(f"Stripe crypto failed: {e}, falling back to direct deposit")

        # Fallback: direct deposit address (for self-hosted)
        return CryptoPaymentResult(
            deposit_address=self.get_deposit_address(request.network),
            amount_usd=request.amount_usd,
            coin=request.coin,
            network=request.network,
        )

    def get_supported_networks(self) -> dict:
        """List all supported networks with their features."""
        return {
            CryptoNetwork.SOLANA: {"name": "Solana", "fees": "$0.01", "speed": "~1s", "coins": ["USDC", "USDT"]},
            CryptoNetwork.BASE: {"name": "Base", "fees": "$0.01", "speed": "~2s", "coins": ["USDC", "USDbC", "USD1"]},
            CryptoNetwork.ETHEREUM: {"name": "Ethereum", "fees": "$1-5", "speed": "~15s", "coins": ["USDC", "USDT"]},
            CryptoNetwork.BSC: {"name": "BSC", "fees": "$0.05", "speed": "~3s", "coins": ["USDC", "USD1"]},
            CryptoNetwork.POLYGON: {"name": "Polygon", "fees": "$0.01", "speed": "~2s", "coins": ["USDC"]},
        }

    def get_deposit_address(self, network: CryptoNetwork) -> str:
        """Get deposit address from env vars per network."""
        env_map = {
            CryptoNetwork.SOLANA: "BONANZA_SOLANA_ADDRESS",
            CryptoNetwork.ETHEREUM: "BONANZA_ETH_ADDRESS",
            CryptoNetwork.BASE: "BONANZA_BASE_ADDRESS",
            CryptoNetwork.BSC: "BONANZA_BSC_ADDRESS",
            CryptoNetwork.POLYGON: "BONANZA_POLYGON_ADDRESS",
        }
        return os.getenv(env_map.get(network, ""), "not_configured")

    def get_token_address(self, coin: StablecoinType, network: CryptoNetwork) -> str:
        """Get the token contract address for a coin on a network."""
        return TOKEN_ADDRESSES.get((coin, network), "unknown")