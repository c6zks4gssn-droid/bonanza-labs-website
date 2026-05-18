"""
Bonanza Labs — Multi-Chain Wallet Manager
Supports: Solana, Base, BSC
"""

from __future__ import annotations
import json
import os
import hashlib
import secrets
from pathlib import Path
from enum import Enum
from typing import Optional
from pydantic import BaseModel


class ChainNetwork(str, Enum):
    SOLANA = "solana"
    BASE = "base"
    BSC = "bsc"


class WalletInfo(BaseModel):
    network: ChainNetwork
    address: str
    coin: str  # USDC, USD1, SOL, BNB
    balance: float = 0.0
    gas_balance: float = 0.0  # SOL/BNB/ETH for fees


class PaymentPolicy(BaseModel):
    """Policy for auto-approving payments."""
    max_per_transaction: float = 10.0  # Max USD per tx
    daily_limit: float = 100.0  # Max USD per day
    auto_approve_below: float = 1.0  # Auto-approve under $1
    require_approval_above: float = 5.0  # Manual approval above $5
    allowed_contracts: list[str] = []  # Token contracts allowed
    blocked_addresses: list[str] = []


class MultiChainWallet:
    """Manage wallets across Solana, Base, and BSC."""

    WALLET_DIR = Path(os.path.expanduser("~/.openclaw/workspace/bonanza-wallets"))

    def __init__(self, wallet_dir: Optional[str] = None):
        self.wallet_dir = Path(wallet_dir) if wallet_dir else self.WALLET_DIR
        self.wallet_dir.mkdir(parents=True, exist_ok=True)

    def generate_solana_wallet(self) -> dict:
        """Generate a new Solana wallet (keypair)."""
        # In production: use solana-py or solders for proper keypair generation
        # This creates a placeholder that works with solana CLI
        seed = secrets.token_bytes(32)
        # Solana addresses are base58 encoded public keys
        # For now, generate a deterministic address from seed
        address = self._derive_address(seed, "solana")
        
        wallet_data = {
            "network": "solana",
            "address": address,
            "coin": "USDC",
            "token_address": "EPjFWdd5AufqSSqeM2qN1xzyBapZU1mP5Rr9EBpEgJqW",
            "gas_coin": "SOL",
            "created_at": self._timestamp(),
        }
        
        path = self.wallet_dir / "solana_wallet.json"
        self._save_wallet(path, wallet_data, seed)
        return wallet_data

    def generate_evm_wallet(self, network: ChainNetwork) -> dict:
        """Generate a new EVM wallet (Base, BSC, Ethereum)."""
        seed = secrets.token_bytes(32)
        address = self._derive_address(seed, network.value)
        
        token_map = {
            ChainNetwork.BASE: {
                "coin": "USDC",
                "token_address": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                "gas_coin": "ETH",
            },
            ChainNetwork.BSC: {
                "coin": "USD1",
                "token_address": "0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d",
                "gas_coin": "BNB",
            },
        }
        
        token_info = token_map.get(network, token_map[ChainNetwork.BASE])
        
        wallet_data = {
            "network": network.value,
            "address": address,
            "coin": token_info["coin"],
            "token_address": token_info["token_address"],
            "gas_coin": token_info["gas_coin"],
            "created_at": self._timestamp(),
        }
        
        path = self.wallet_dir / f"{network.value}_wallet.json"
        self._save_wallet(path, wallet_data, seed)
        return wallet_data

    def load_wallet(self, network: ChainNetwork) -> Optional[dict]:
        """Load an existing wallet."""
        path = self.wallet_dir / f"{network.value}_wallet.json"
        if path.exists():
            with open(path) as f:
                data = json.load(f)
            return {k: v for k, v in data.items() if k != "encrypted_seed"}
        return None

    def load_all_wallets(self) -> dict[str, dict]:
        """Load all wallets."""
        result = {}
        for network in ChainNetwork:
            wallet = self.load_wallet(network)
            if wallet:
                result[network.value] = wallet
        return result

    def get_funding_instructions(self, network: ChainNetwork) -> dict:
        """Get funding instructions for a wallet."""
        wallet = self.load_wallet(network)
        if not wallet:
            return {"error": f"No wallet for {network.value}. Run generate first."}
        
        instructions = {
            "solana": {
                "network": "solana",
                "address": wallet["address"],
                "coin": "USDC",
                "token_address": wallet["token_address"],
                "gas": "Send 0.05 SOL for transaction fees",
                "explorer": f"https://solscan.io/address/{wallet['address']}",
                "faucet": "https://faucet.solana.com (devnet only)",
            },
            "base": {
                "network": "base",
                "address": wallet["address"],
                "coin": "USDC",
                "token_address": wallet["token_address"],
                "gas": "Send 0.001 ETH for transaction fees",
                "explorer": f"https://basescan.org/address/{wallet['address']}",
                "bridge": "https://bridge.base.org",
            },
            "bsc": {
                "network": "bsc",
                "address": wallet["address"],
                "coin": "USD1",
                "token_address": wallet["token_address"],
                "gas": "Send 0.01 BNB for transaction fees",
                "explorer": f"https://bscscan.com/address/{wallet['address']}",
            },
        }
        
        return instructions.get(network.value, {})

    def create_withdrawal(self, from_network: ChainNetwork, to_address: str, amount_usd: float, coin: str = None) -> dict:
        """Create a withdrawal from agent wallet to external wallet.
        
        For large incoming payments, sweep funds to a cold wallet.
        """
        wallet = self.load_wallet(from_network)
        if not wallet:
            return {"error": f"No wallet for {from_network.value}"}

        coin = coin or wallet["coin"]

        withdrawal = {
            "from_address": wallet["address"],
            "to_address": to_address,
            "amount_usd": amount_usd,
            "coin": coin,
            "network": from_network.value,
            "token_address": wallet.get("token_address", ""),
            "gas_coin": wallet.get("gas_coin", "SOL" if from_network == ChainNetwork.SOLANA else "ETH"),
            "status": "pending",
            "requires_gas": from_network != ChainNetwork.SOLANA,  # EVM needs gas
        }

        # Save withdrawal record
        withdrawals_dir = self.wallet_dir / "withdrawals"
        withdrawals_dir.mkdir(exist_ok=True)
        from datetime import datetime, timezone
        withdrawal_id = f"wd_{int(datetime.now(timezone.utc).timestamp())}"
        withdrawal["id"] = withdrawal_id
        withdrawal["created_at"] = datetime.now(timezone.utc).isoformat()

        with open(withdrawals_dir / f"{withdrawal_id}.json", 'w') as f:
            json.dump(withdrawal, f, indent=2)

        return withdrawal

    def sweep_to_cold_wallet(self, cold_wallet_address: str, min_amount: float = 50.0) -> list[dict]:
        """Sweep all balances above min_amount to a cold wallet.
        
        Use this for security: keep only operational funds in hot wallets,
        sweep large amounts to cold storage.
        """
        results = []
        for network in ChainNetwork:
            wallet = self.load_wallet(network)
            if not wallet:
                continue

            balance = wallet.get("balance", 0.0)
            if balance >= min_amount:
                result = self.create_withdrawal(
                    from_network=network,
                    to_address=cold_wallet_address,
                    amount_usd=balance,
                )
                results.append(result)

        return results

    def set_cold_wallet(self, address: str) -> dict:
        """Set the cold wallet address for automatic sweeps."""
        config = {"cold_wallet_address": address}
        with open(self.wallet_dir / "cold_wallet.json", 'w') as f:
            json.dump(config, f, indent=2)
        return {"cold_wallet": address, "status": "configured"}

    def get_cold_wallet(self) -> Optional[str]:
        """Get the configured cold wallet address."""
        path = self.wallet_dir / "cold_wallet.json"
        if path.exists():
            with open(path) as f:
                return json.load(f).get("cold_wallet_address")
        return None

    def check_policy(self, amount_usd: float, policy: PaymentPolicy) -> dict:
        """Check if a payment is allowed by policy."""
        if amount_usd > policy.max_per_transaction:
            return {"allowed": False, "reason": f"Exceeds max per transaction (${policy.max_per_transaction})"}
        if amount_usd >= policy.require_approval_above:
            return {"allowed": True, "requires_approval": True, "reason": f"Above auto-approve threshold (${policy.require_approval_above})"}
        if amount_usd <= policy.auto_approve_below:
            return {"allowed": True, "auto_approved": True, "reason": "Below auto-approve threshold"}
        return {"allowed": True, "requires_approval": True}

    def _derive_address(self, seed: bytes, network: str) -> str:
        """Derive a wallet address from seed (placeholder - use proper SDKs in production)."""
        # In production: use nacl (Solana) or eth-account (EVM) for real key derivation
        # This is a deterministic placeholder for development
        h = hashlib.sha256(seed + network.encode()).hexdigest()
        if network == "solana":
            # Solana: base58 of 32-byte public key
            import base58
            return base58.b58encode(bytes.fromhex(h[:64])).decode()
        else:
            # EVM: 0x + 40 hex chars
            return f"0x{h[:40]}"

    def _save_wallet(self, path: Path, data: dict, seed: bytes) -> None:
        """Save wallet with encrypted seed."""
        encrypted_seed = seed.hex()  # In production: encrypt with user password
        data["encrypted_seed"] = encrypted_seed
        with open(path, 'w') as f:
            json.dump(data, f, indent=2)
        # Remove seed from returned data
        del data["encrypted_seed"]

    def _timestamp(self) -> str:
        from datetime import datetime, timezone
        return datetime.now(timezone.utc).isoformat()


# CLI interface
def main():
    import sys
    wallet = MultiChainWallet()
    
    if len(sys.argv) < 2:
        print("Usage: bonanza-wallet [generate|list|fund|policy] [network]")
        return
    
    cmd = sys.argv[1]
    
    if cmd == "generate":
        network = sys.argv[2] if len(sys.argv) > 2 else "all"
        if network == "all":
            for n in ChainNetwork:
                result = wallet.generate_evm_wallet(n) if n != ChainNetwork.SOLANA else wallet.generate_solana_wallet()
                print(f"✅ {n.value}: {result['address']}")
        elif network == "solana":
            result = wallet.generate_solana_wallet()
            print(f"✅ Solana: {result['address']}")
        else:
            result = wallet.generate_evm_wallet(ChainNetwork(network))
            print(f"✅ {network}: {result['address']}")
    
    elif cmd == "list":
        wallets = wallet.load_all_wallets()
        if not wallets:
            print("No wallets. Run: bonanza-wallet generate all")
        for net, data in wallets.items():
            print(f"  {net}: {data['address']} ({data['coin']})")
    
    elif cmd == "fund":
        network = sys.argv[2] if len(sys.argv) > 2 else "all"
        if network == "all":
            for n in ChainNetwork:
                instructions = wallet.get_funding_instructions(n)
                if instructions:
                    print(f"\n💰 {n.value.upper()}")
                    print(f"  Address: {instructions.get('address')}")
                    print(f"  Gas: {instructions.get('gas')}")
                    print(f"  Explorer: {instructions.get('explorer')}")
        else:
            instructions = wallet.get_funding_instructions(ChainNetwork(network))
            print(json.dumps(instructions, indent=2))
    
    elif cmd == "policy":
        policy = PaymentPolicy()
        amount = float(sys.argv[2]) if len(sys.argv) > 2 else 0.50
        result = wallet.check_policy(amount, policy)
        print(json.dumps(result, indent=2))

    elif cmd == "withdraw":
        # bonanza-wallet withdraw <network> <to_address> <amount>
        network = sys.argv[2] if len(sys.argv) > 2 else "solana"
        to_address = sys.argv[3] if len(sys.argv) > 3 else ""
        amount = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
        if not to_address:
            print("Usage: bonanza-wallet withdraw <network> <to_address> <amount>")
            return
        result = wallet.create_withdrawal(ChainNetwork(network), to_address, amount)
        print(json.dumps(result, indent=2))

    elif cmd == "sweep":
        # bonanza-wallet sweep <cold_wallet_address> [min_amount]
        cold_address = sys.argv[2] if len(sys.argv) > 2 else ""
        min_amount = float(sys.argv[3]) if len(sys.argv) > 3 else 50.0
        if not cold_address:
            # Check if cold wallet is configured
            cold_address = wallet.get_cold_wallet() or ""
        if not cold_address:
            print("Usage: bonanza-wallet sweep <cold_wallet_address> [min_amount]")
            print("  Or configure: bonanza-wallet set-cold <address>")
            return
        results = wallet.sweep_to_cold_wallet(cold_address, min_amount)
        for r in results:
            status = "✅" if r.get("id") else "❌"
            print(f"  {status} {r.get('network')}: {r.get('amount_usd')} {r.get('coin')} → {r.get('to_address', '')[:20]}...")

    elif cmd == "set-cold":
        address = sys.argv[2] if len(sys.argv) > 2 else ""
        if not address:
            print("Usage: bonanza-wallet set-cold <address>")
            return
        result = wallet.set_cold_wallet(address)
        print(json.dumps(result, indent=2))

    else:
        print("""
Bonanza Multi-Chain Wallet

Commands:
  generate [solana|base|bsc|all]  Generate wallets
  list                             List all wallets
  fund [solana|base|bsc|all]      Show funding instructions
  policy [amount]                  Check payment policy
  withdraw <net> <addr> <amt>     Withdraw to external wallet
  sweep <addr> [min_amount]        Sweep large balances to cold wallet
  set-cold <address>               Configure cold wallet address

Networks: solana, base, bsc""")


if __name__ == "__main__":
    main()