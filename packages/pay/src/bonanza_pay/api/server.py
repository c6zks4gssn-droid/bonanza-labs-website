"""FastAPI server for Bonanza Labs Pay."""

from __future__ import annotations
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel as APIModel

from bonanza_pay.core.stripe_client import StripeClient, StripeConfig
from bonanza_pay.core.crypto import (
    StablecoinHandler, CryptoPaymentRequest, CryptoNetwork, StablecoinType
)
from bonanza_pay.core.webhooks import WebhookEvent, webhook_handler
from bonanza_pay.pricing.plans import ProductName, PlanName, get_plan, list_plans
from bonanza_pay.pricing.calculator import compare_plans, estimate_revenue

app = FastAPI(title="Bonanza Labs Pay API", version="0.1.0")
stripe = StripeClient()
crypto = StablecoinHandler(stripe)


# ─── Routes ───

@app.get("/")
def root():
    return {"name": "Bonanza Labs Pay", "version": "0.1.0", "docs": "/docs"}


# Plans
@app.get("/plans/{product}")
def get_plans(product: ProductName):
    return compare_plans(product)


@app.get("/plans/{product}/{plan}")
def get_plan_detail(product: ProductName, plan: PlanName):
    p = get_plan(product, plan)
    if not p:
        raise HTTPException(404, "Plan not found")
    return p.model_dump()


# Revenue estimation
@app.get("/revenue/{product}")
def revenue_estimate(
    product: ProductName,
    free_users: int = 100,
    pro_users: int = 10,
    enterprise_users: int = 1,
):
    return estimate_revenue(product, free_users, pro_users, enterprise_users)


# Checkout
class CheckoutRequest(APIModel):
    price_id: str
    success_url: str = "https://bonanza-labs.io/success"
    cancel_url: str = "https://bonanza-labs.io/cancel"
    customer_email: str = ""
    mode: str = "subscription"


@app.post("/checkout")
def create_checkout(req: CheckoutRequest):
    if not stripe.config.secret_key:
        raise HTTPException(400, "Stripe not configured. Set STRIPE_SECRET_KEY.")
    try:
        return stripe.create_checkout_session(
            price_id=req.price_id,
            success_url=req.success_url,
            cancel_url=req.cancel_url,
            customer_email=req.customer_email or None,
            mode=req.mode,
        )
    except Exception as e:
        raise HTTPException(500, str(e))


# Crypto payment
@app.post("/crypto/pay")
def create_crypto_payment(req: CryptoPaymentRequest):
    result = crypto.create_payment(req)
    return result.model_dump()


@app.get("/crypto/address/{coin}/{network}")
def get_deposit_address(coin: StablecoinType, network: CryptoNetwork):
    return {
        "token_address": crypto.get_token_address(coin, network),
        "deposit_address": crypto._get_deposit_address(network),
    }


# Webhook
@app.post("/webhook")
async def handle_webhook(request: Request):
    body = await request.body()
    sig = request.headers.get("stripe-signature", "")

    if not stripe.config.secret_key or not stripe.config.webhook_secret:
        raise HTTPException(400, "Webhooks not configured")

    try:
        event_data = stripe.verify_webhook(body, sig)
        event = WebhookEvent(id=event_data["id"], type=event_data["type"], data=event_data.get("data", {}))
        results = webhook_handler.handle(event)
        return {"event_id": event.id, "type": event.type, "results": results}
    except Exception as e:
        raise HTTPException(400, f"Webhook verification failed: {e}")