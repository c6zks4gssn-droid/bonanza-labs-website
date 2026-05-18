"""💰 Wallet command — AI agent payment management."""
import json
from pathlib import Path

WALLET_DIR = Path.home() / ".openclaw/workspace/agent-wallet"
CONFIG_FILE = WALLET_DIR / "wallet.json"


def handle_action(action, chain="solana", budget=50):
    """Handle wallet actions."""
    if action == "create":
        return _create_wallet(chain, budget)
    elif action == "balance":
        return _get_balance()
    elif action == "spend":
        return "Spend tracking: coming soon"
    elif action == "analytics":
        return _get_analytics()
    return f"Unknown action: {action}"


def _create_wallet(chain, budget):
    """Create a new agent wallet."""
    WALLET_DIR.mkdir(parents=True, exist_ok=True)
    config = {
        "chain": chain,
        "budget_usd": budget,
        "spent_usd": 0,
        "auto_approve_under": 5.0,
        "human_approval_above": 5.0,
        "transactions": [],
    }
    CONFIG_FILE.write_text(json.dumps(config, indent=2))
    return f"✅ Wallet created on {chain} | Budget: ${budget}/mo | Auto-approve: under $5"


def _get_balance():
    """Get wallet balance."""
    if not CONFIG_FILE.exists():
        return "❌ No wallet found. Run: bonanza wallet create"
    config = json.loads(CONFIG_FILE.read_text())
    remaining = config["budget_usd"] - config["spent_usd"]
    return f"💰 Chain: {config['chain']} | Budget: ${config['budget_usd']} | Spent: ${config['spent_usd']} | Remaining: ${remaining:.2f}"


def _get_analytics():
    """Get spending analytics."""
    if not CONFIG_FILE.exists():
        return "❌ No wallet found. Run: bonanza wallet create"
    config = json.loads(CONFIG_FILE.read_text())
    txs = config.get("transactions", [])
    return f"📊 {len(txs)} transactions | Total spent: ${config['spent_usd']} | Budget: ${config['budget_usd']}"