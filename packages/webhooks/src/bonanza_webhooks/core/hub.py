"""Webhook hub — register, receive, and forward webhooks to AI agents."""

from __future__ import annotations
import hashlib
import hmac
import json
import uuid
from datetime import datetime
from typing import Callable, Optional
from pydantic import BaseModel, Field


class WebhookEndpoint(BaseModel):
    """A registered webhook endpoint."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    path: str  # e.g. "/webhooks/github"
    agent_id: str = ""  # Which agent to notify
    secret: str = ""  # For HMAC verification
    description: str = ""
    active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    call_count: int = 0
    last_called_at: str = ""


class WebhookEvent(BaseModel):
    """An incoming webhook event."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    endpoint_id: str
    source: str  # e.g. "github", "stripe"
    event_type: str = ""  # e.g. "push", "payment.succeeded"
    payload: dict = {}
    headers: dict = {}
    verified: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())


class WebhookRule(BaseModel):
    """A rule that triggers an agent action from a webhook."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    endpoint_id: str
    event_type: str = "*"  # Match all or specific type
    agent_id: str = ""
    action: str = ""  # What the agent should do
    condition: str = ""  # Python expression to evaluate
    enabled: bool = True


class WebhookHub:
    """Manage webhook endpoints, events, and rules."""

    def __init__(self):
        self._endpoints: dict[str, WebhookEndpoint] = {}
        self._events: list[WebhookEvent] = []
        self._rules: list[WebhookRule] = []
        self._handlers: dict[str, list[Callable]] = {}

    def register_endpoint(self, path: str, agent_id: str = "", secret: str = "", description: str = "") -> WebhookEndpoint:
        """Register a new webhook endpoint."""
        ep = WebhookEndpoint(path=path, agent_id=agent_id, secret=secret, description=description)
        self._endpoints[ep.id] = ep
        return ep

    def add_rule(self, endpoint_id: str, agent_id: str, action: str, event_type: str = "*", condition: str = "") -> WebhookRule:
        """Add a webhook → agent rule."""
        rule = WebhookRule(endpoint_id=endpoint_id, agent_id=agent_id, action=action, event_type=event_type, condition=condition)
        self._rules.append(rule)
        return rule

    def receive_webhook(self, path: str, payload: dict, headers: dict = {}, source: str = "") -> Optional[WebhookEvent]:
        """Process an incoming webhook."""
        # Find endpoint
        ep = None
        for e in self._endpoints.values():
            if e.path == path and e.active:
                ep = e
                break
        if not ep:
            return None

        # Verify HMAC if secret set
        verified = True
        if ep.secret:
            sig = headers.get("x-hub-signature-256", headers.get("x-signature", ""))
            if sig:
                expected = "sha256=" + hmac.new(ep.secret.encode(), json.dumps(payload).encode(), hashlib.sha256).hexdigest()
                verified = hmac.compare_digest(sig, expected)

        # Create event
        event = WebhookEvent(
            endpoint_id=ep.id,
            source=source,
            event_type=payload.get("action", payload.get("type", "")),
            payload=payload,
            headers=headers,
            verified=verified,
        )
        self._events.append(event)

        # Update endpoint stats
        ep.call_count += 1
        ep.last_called_at = event.created_at

        # Evaluate rules
        for rule in self._rules:
            if rule.endpoint_id == ep.id and rule.enabled:
                if rule.event_type == "*" or rule.event_type == event.event_type:
                    self._trigger_agent(rule, event)

        return event

    def _trigger_agent(self, rule: WebhookRule, event: WebhookEvent):
        """Trigger agent action from a webhook rule."""
        handlers = self._handlers.get(rule.agent_id, [])
        for handler in handlers:
            try:
                handler(rule, event)
            except Exception:
                pass

    def on_agent(self, agent_id: str, handler: Callable):
        """Register a handler for agent triggers."""
        if agent_id not in self._handlers:
            self._handlers[agent_id] = []
        self._handlers[agent_id].append(handler)

    def list_endpoints(self) -> list[WebhookEndpoint]:
        return list(self._endpoints.values())

    def list_events(self, limit: int = 50) -> list[WebhookEvent]:
        return self._events[-limit:]

    def list_rules(self) -> list[WebhookRule]:
        return self._rules