"""Bonanza MCP Server — AI agent payment firewall via the Model Context Protocol."""

from __future__ import annotations

import json
import sys
import argparse
from typing import Optional

from mcp.server import Server
from mcp.types import Tool, TextContent

from .firewall import Firewall, Policy, FirewallResult

# Create the MCP server
app = Server("bonanza-mcp")

# Global state
_firewall: Optional[Firewall] = None
_policy: Optional[Policy] = None


def create_firewall(
    max_budget: float = float("inf"),
    daily_budget: float = float("inf"),
    require_approval_above: float = 0.0,
    trusted_vendors: Optional[list[str]] = None,
    blocked_vendors: Optional[list[str]] = None,
    allowed_networks: Optional[list[str]] = None,
    allowed_tokens: Optional[list[str]] = None,
) -> Firewall:
    """Create a Firewall instance with the given configuration."""
    global _firewall, _policy

    _policy = Policy(
        max_spend_usd=max_budget,
        daily_budget_usd=daily_budget,
        require_approval_above=require_approval_above,
        trusted_vendors=trusted_vendors or [],
        blocked_vendors=blocked_vendors or [],
        allowed_networks=allowed_networks or ["*"],
        allowed_tokens=allowed_tokens or ["*"],
    )

    _firewall = Firewall(policy=_policy)
    return _firewall


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available MCP tools."""
    return [
        Tool(
            name="check_budget",
            description="Check current spending and remaining budget for the AI agent session.",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="evaluate_payment",
            description="Evaluate a payment request against the firewall policy. Returns approval status, risk score, and reason.",
            inputSchema={
                "type": "object",
                "properties": {
                    "amount": {
                        "type": "number",
                        "description": "Payment amount in USD",
                    },
                    "vendor": {
                        "type": "string",
                        "description": "Vendor domain (e.g., api.weather.com)",
                    },
                    "network": {
                        "type": "string",
                        "description": "Blockchain network (e.g., base, solana)",
                        "default": "base",
                    },
                    "token": {
                        "type": "string",
                        "description": "Payment token (e.g., usdc, usdt)",
                        "default": "usdc",
                    },
                    "description": {
                        "type": "string",
                        "description": "Human-readable description of the payment",
                    },
                },
                "required": ["amount", "vendor"],
            },
        ),
        Tool(
            name="spending_history",
            description="View recent spending history with optional filters.",
            inputSchema={
                "type": "object",
                "properties": {
                    "vendor": {
                        "type": "string",
                        "description": "Filter by vendor domain",
                    },
                    "decision": {
                        "type": "string",
                        "description": "Filter by decision (approved, blocked, pending_approval)",
                        "enum": ["approved", "blocked", "pending_approval"],
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of entries to return",
                        "default": 10,
                    },
                },
            },
        ),
        Tool(
            name="set_budget",
            description="Update the budget for the current session.",
            inputSchema={
                "type": "object",
                "properties": {
                    "max_budget_usd": {
                        "type": "number",
                        "description": "Maximum total spend in USD",
                    },
                    "require_approval_above": {
                        "type": "number",
                        "description": "Amount above which human approval is required",
                    },
                },
                "required": ["max_budget_usd"],
            },
        ),
        Tool(
            name="add_vendor",
            description="Add a vendor to the trusted list.",
            inputSchema={
                "type": "object",
                "properties": {
                    "vendor": {
                        "type": "string",
                        "description": "Vendor domain to trust (e.g., api.weather.com)",
                    },
                },
                "required": ["vendor"],
            },
        ),
        Tool(
            name="remove_vendor",
            description="Remove a vendor from the trusted list.",
            inputSchema={
                "type": "object",
                "properties": {
                    "vendor": {
                        "type": "string",
                        "description": "Vendor domain to remove",
                    },
                },
                "required": ["vendor"],
            },
        ),
        Tool(
            name="risk_assessment",
            description="Assess risk level for a vendor and amount.",
            inputSchema={
                "type": "object",
                "properties": {
                    "amount": {
                        "type": "number",
                        "description": "Payment amount in USD",
                    },
                    "vendor": {
                        "type": "string",
                        "description": "Vendor domain",
                    },
                },
                "required": ["amount", "vendor"],
            },
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls."""
    global _firewall, _policy

    if _firewall is None:
        create_firewall()  # Use defaults

    if name == "check_budget":
        result = _firewall.audit_log.stats()
        return [TextContent(type="text", text=json.dumps(result, indent=2))]

    elif name == "evaluate_payment":
        result: FirewallResult = _firewall.evaluate(
            amount=arguments.get("amount", 0),
            vendor=arguments.get("vendor", ""),
            network=arguments.get("network", "base"),
            token=arguments.get("token", "usdc"),
            description=arguments.get("description", ""),
        )
        response = {
            "approved": result.approved,
            "reason": result.reason,
            "risk_score": result.risk_score,
            "risk_level": result.risk_level.value,
            "requires_approval": result.requires_approval,
            "transaction_id": result.transaction_id,
        }
        return [TextContent(type="text", text=json.dumps(response, indent=2))]

    elif name == "spending_history":
        entries = _firewall.audit_log.query(
            vendor=arguments.get("vendor"),
            decision=arguments.get("decision"),
            limit=arguments.get("limit", 10),
        )
        return [TextContent(
            type="text",
            text=json.dumps([e.to_dict() for e in entries], indent=2),
        )]

    elif name == "set_budget":
        if "max_budget_usd" in arguments:
            _policy.max_spend_usd = arguments["max_budget_usd"]
        if "require_approval_above" in arguments:
            _policy.require_approval_above = arguments["require_approval_above"]
        return [TextContent(
            type="text",
            text=json.dumps({
                "max_budget_usd": _policy.max_spend_usd,
                "require_approval_above": _policy.require_approval_above,
                "daily_budget_usd": _policy.daily_budget_usd,
            }, indent=2),
        )]

    elif name == "add_vendor":
        vendor = arguments.get("vendor", "")
        if vendor and vendor not in _policy.trusted_vendors:
            _policy.trusted_vendors.append(vendor)
        return [TextContent(
            type="text",
            text=f"✅ Added {vendor} to trusted vendors. Total: {len(_policy.trusted_vendors)}",
        )]

    elif name == "remove_vendor":
        vendor = arguments.get("vendor", "")
        if vendor in _policy.trusted_vendors:
            _policy.trusted_vendors.remove(vendor)
        return [TextContent(
            type="text",
            text=f"✅ Removed {vendor} from trusted vendors. Total: {len(_policy.trusted_vendors)}",
        )]

    elif name == "risk_assessment":
        from .firewall import Firewall as F
        risk_score = F._default_risk_scorer(
            arguments.get("amount", 0),
            arguments.get("vendor", ""),
            arguments.get("network", "base"),
            arguments.get("token", "usdc"),
        )
        risk_level = F._score_to_level(risk_score)
        return [TextContent(
            type="text",
            text=json.dumps({
                "risk_score": risk_score,
                "risk_level": risk_level.value,
                "vendor": arguments.get("vendor", ""),
                "amount": arguments.get("amount", 0),
            }, indent=2),
        )]

    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]


def main():
    """Run the MCP server."""
    parser = argparse.ArgumentParser(description="Bonanza MCP Server — AI agent payment firewall")
    parser.add_argument("--max-budget", type=float, default=float("inf"), help="Maximum spend per session (USD)")
    parser.add_argument("--daily-budget", type=float, default=float("inf"), help="Maximum daily spend (USD)")
    parser.add_argument("--require-approval-above", type=float, default=0, help="Require approval above this amount (USD)")
    parser.add_argument("--trusted-vendors", type=str, default="", help="Comma-separated trusted vendor domains")
    args = parser.parse_args()

    trusted = [v.strip() for v in args.trusted_vendors.split(",") if v.strip()] if args.trusted_vendors else []

    create_firewall(
        max_budget=args.max_budget,
        daily_budget=args.daily_budget,
        require_approval_above=args.require_approval_above,
        trusted_vendors=trusted or None,
    )

    from mcp.server.stdio import stdio_server

    async def run():
        async with stdio_server() as (read_stream, write_stream):
            await app.run(read_stream, write_stream, app.create_initialization_options())

    import asyncio
    asyncio.run(run())


if __name__ == "__main__":
    main()