#!/usr/bin/env python3
"""Register Bonanza Labs (Hermes) as ERC-8004 AI Agent on Ethereum."""

# ✏️ EDIT THESE
PRIVATE_KEY = ""  # Your ETH private key (needs ~0.005 ETH for gas)
AGENT_NAME  = "Bonanza Labs ✦ Hermes"
AGENT_DESC  = "Open source AI agent platform — search, video, payments, analytics. x402-compatible on Base."
RPC_URL     = "https://eth.llamarpc.com"

# ─── Don't edit below ──────────────────────────────────
import json, base64, sys

if not PRIVATE_KEY:
    print("❌ Set PRIVATE_KEY in this script first")
    print("   You need ~0.005 ETH on Ethereum mainnet for gas (~$1-5)")
    sys.exit(1)

try:
    from web3 import Web3
except ImportError:
    print("Installing web3...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "web3", "--break-system-packages"])
    from web3 import Web3

w3 = Web3(Web3.HTTPProvider(RPC_URL))
acct = w3.eth.account.from_key(PRIVATE_KEY)
REG = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"
ABI = [{"inputs":[{"name":"agentURI","type":"string"}],"name":"register",
        "outputs":[{"name":"agentId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]

reg = {
    "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
    "name": AGENT_NAME,
    "description": AGENT_DESC,
    "image": "",
    "active": True,
    "x402Support": True,
    "services": [
        {"name": "web", "endpoint": "https://bonanza-labs.tiiny.site"},
        {"name": "MCP", "endpoint": "https://bonanza-labs.tiiny.site/.well-known/x402", "version": "2025-06-18"},
        {"name": "x402", "endpoint": "https://bonanza-labs.tiiny.site/.well-known/x402"},
    ],
}

uri = "data:application/json;base64," + base64.b64encode(json.dumps(reg).encode()).decode()

contract = w3.eth.contract(address=REG, abi=ABI)
print(f"\n🤖 Registering '{AGENT_NAME}' from {acct.address}...")
bal = w3.eth.get_balance(acct.address)
print(f"Balance: {w3.from_wei(bal, 'ether'):.4f} ETH")
if bal < w3.to_wei(0.005, 'ether'):
    raise SystemExit("❌ Need ≥0.005 ETH for gas")

tx = contract.functions.register(uri).build_transaction({
    "from": acct.address,
    "nonce": w3.eth.get_transaction_count(acct.address),
    "gas": 600000,
    "maxFeePerGas": w3.eth.gas_price * 2,
    "maxPriorityFeePerGas": w3.to_wei(1, "gwei"),
})
signed = acct.sign_transaction(tx)
tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
print(f"TX: https://etherscan.io/tx/{tx_hash.hex()}\n⏳ Confirming...")
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
transfer = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
for log in receipt.logs:
    if log.topics[0].hex() == transfer[2:] and log.address.lower() == REG.lower():
        agent_id = int(log.topics[3].hex(), 16)
        print(f"\n✅ Registered! Agent #{agent_id}")
        print(f"https://etherscan.io/nft/{REG}/{agent_id}")
        break