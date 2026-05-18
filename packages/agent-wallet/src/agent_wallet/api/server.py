"""FastAPI dashboard for Agent Wallet."""

from __future__ import annotations
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel as APIModel

from agent_wallet.core.models import ChainType
from agent_wallet.core.wallet_manager import WalletManager

app = FastAPI(title="Agent Wallet API", version="0.1.0")
mgr = WalletManager()


# Request models
class CreateWalletRequest(APIModel):
    agent_name: str
    chain: str = "solana"
    monthly_budget: float = 500.0
    auto_approve_under: float = 5.0


class PayRequest(APIModel):
    amount_usd: float
    recipient: str
    description: str = ""


class ApproveRequest(APIModel):
    approved: bool


# Routes
@app.get("/")
def root():
    return {"name": "Agent Wallet API", "version": "0.1.0", "docs": "/docs"}


@app.post("/wallets")
def create_wallet(req: CreateWalletRequest):
    from agent_wallet.core.models import Policy
    policy = Policy(
        monthly_limit=req.monthly_budget,
        daily_limit=req.monthly_budget / 30,
        auto_approve_under=req.auto_approve_under,
        human_approval_above=req.auto_approve_under,
    )
    wallet = mgr.create_wallet(req.agent_name, ChainType(req.chain), policy=policy)
    return wallet.model_dump()


@app.get("/wallets")
def list_wallets():
    return [w.model_dump() for w in mgr.list_wallets()]


@app.get("/wallets/{wallet_id}")
def get_wallet(wallet_id: str):
    wallet = mgr.load_wallet(wallet_id)
    if not wallet:
        raise HTTPException(404, "Wallet not found")
    return wallet.model_dump()


@app.post("/wallets/{wallet_id}/pay")
def propose_payment(wallet_id: str, req: PayRequest):
    try:
        txn, result = mgr.propose_transaction(
            wallet_id, req.amount_usd, req.recipient, req.description
        )
        return {
            "transaction": txn.model_dump(),
            "policy_result": {
                "allowed": result.allowed,
                "approval_type": result.approval_type.value,
                "reason": result.reason,
                "approval_request_id": result.request.id if result.request else None,
            },
        }
    except ValueError as e:
        raise HTTPException(404, str(e))


@app.post("/wallets/{wallet_id}/transactions/{txn_id}/approve")
def approve_transaction(wallet_id: str, txn_id: str, req: ApproveRequest):
    txn = mgr.approve_transaction(wallet_id, txn_id, req.approved)
    if not txn:
        raise HTTPException(404, "Transaction not found")
    return txn.model_dump()


@app.get("/wallets/{wallet_id}/analytics")
def get_analytics(wallet_id: str):
    data = mgr.get_analytics(wallet_id)
    if "error" in data:
        raise HTTPException(404, data["error"])
    return data