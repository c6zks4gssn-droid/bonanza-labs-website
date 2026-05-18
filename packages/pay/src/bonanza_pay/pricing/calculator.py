"""Pricing calculator for Bonanza Labs products."""

from __future__ import annotations
from bonanza_pay.pricing.plans import (
    PlanName, ProductName, get_plan, list_plans, ALL_PLANS
)


def calculate_monthly_cost(product: ProductName, plan: PlanName, quantity: int = 1) -> float:
    """Calculate monthly cost for a plan."""
    p = get_plan(product, plan)
    if not p:
        return 0.0
    return p.price_usd * quantity


def calculate_annual_cost(product: ProductName, plan: PlanName, quantity: int = 1) -> float:
    """Calculate annual cost (with 2 months free for annual)."""
    monthly = calculate_monthly_cost(product, plan, quantity)
    return monthly * 10  # 12 months - 2 free


def compare_plans(product: ProductName) -> list[dict]:
    """Compare all plans for a product."""
    plans = list_plans(product)
    return [
        {
            "plan": p.name.value,
            "price_usd": p.price_usd,
            "annual_usd": p.price_usd * 10,
            "features": p.features,
        }
        for p in plans
    ]


def estimate_revenue(
    product: ProductName,
    free_users: int = 100,
    pro_users: int = 10,
    enterprise_users: int = 1,
) -> dict:
    """Estimate monthly revenue for a product."""
    free_plan = get_plan(product, PlanName.FREE)
    pro_plan = get_plan(product, PlanName.PRO)
    ent_plan = get_plan(product, PlanName.ENTERPRISE)

    pro_price = pro_plan.price_usd if pro_plan else 29
    ent_price = ent_plan.price_usd if ent_plan else 199

    pro_rev = pro_users * pro_price
    ent_rev = enterprise_users * ent_price
    total = pro_rev + ent_rev

    return {
        "product": product.value,
        "users": {"free": free_users, "pro": pro_users, "enterprise": enterprise_users},
        "revenue": {"pro": pro_rev, "enterprise": ent_rev, "total": total},
        "conversion_rate": (pro_users + enterprise_users) / (free_users + pro_users + enterprise_users) * 100 if (free_users + pro_users + enterprise_users) > 0 else 0,
    }