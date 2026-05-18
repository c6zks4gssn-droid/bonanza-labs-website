"""Approval Gateway — Human-in-the-loop approval for AI agent actions."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, Callable


class ApprovalStatus(Enum):
    """Status of an approval request."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"
    CANCELLED = "cancelled"


class NotificationChannel(Enum):
    """Supported notification channels."""
    TELEGRAM = "telegram"
    SLACK = "slack"
    EMAIL = "email"
    WEBHOOK = "webhook"
    CONSOLE = "console"


@dataclass
class ApprovalRequest:
    """A request for human approval."""
    request_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    agent_id: str = ""
    action: str = ""               # e.g., "payment", "file_delete", "api_call"
    description: str = ""          # Human-readable description
    amount_usd: Optional[float] = None
    vendor: str = ""
    risk_score: float = 0.0
    risk_level: str = "low"
    status: ApprovalStatus = ApprovalStatus.PENDING
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    expires_at: Optional[str] = None
    decided_at: Optional[str] = None
    decided_by: str = ""
    reason: str = ""
    metadata: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "request_id": self.request_id,
            "agent_id": self.agent_id,
            "action": self.action,
            "description": self.description,
            "amount_usd": self.amount_usd,
            "vendor": self.vendor,
            "risk_score": self.risk_score,
            "risk_level": self.risk_level,
            "status": self.status.value,
            "created_at": self.created_at,
            "expires_at": self.expires_at,
            "decided_at": self.decided_at,
            "decided_by": self.decided_by,
            "reason": self.reason,
            "metadata": self.metadata,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "ApprovalRequest":
        data = data.copy()
        if "status" in data and isinstance(data["status"], str):
            data["status"] = ApprovalStatus(data["status"])
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


@dataclass
class ApprovalDecision:
    """Result of an approval decision."""
    request_id: str
    status: ApprovalStatus
    decided_by: str = ""
    reason: str = ""
    decided_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    metadata: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "request_id": self.request_id,
            "status": self.status.value,
            "decided_by": self.decided_by,
            "reason": self.reason,
            "decided_at": self.decided_at,
            "metadata": self.metadata,
        }


class ApprovalGateway:
    """Human-in-the-loop approval gateway for AI agents.

    Queue sensitive actions, notify humans, and collect decisions.

    Example:
        >>> from bonanza_approve import ApprovalGateway
        >>> gw = ApprovalGateway(name="my-agent")
        >>> request = gw.request_approval(
        ...     action="payment",
        ...     description="Pay $5.00 for weather API",
        ...     amount_usd=5.00,
        ...     vendor="api.weather.com",
        ...     risk_score=0.3,
        ... )
        >>> print(request.request_id)  # Send this to your notification system
        >>> # Later, when human responds:
        >>> decision = gw.approve(request.request_id, decided_by="admin")
        >>> print(decision.status)  # ApprovalStatus.APPROVED
    """

    def __init__(
        self,
        name: str = "default",
        auto_approve_below: float = 0.0,
        auto_reject_above: float = 1.0,
        expire_after_minutes: int = 60,
        notification_channel: NotificationChannel = NotificationChannel.CONSOLE,
        notification_handler: Optional[Callable] = None,
        store: Optional[object] = None,
    ):
        self.name = name
        self.auto_approve_below = auto_approve_below
        self.auto_reject_above = auto_reject_above
        self.expire_after_minutes = expire_after_minutes
        self.notification_channel = notification_channel
        self.notification_handler = notification_handler
        self._store = store or self._default_store()
        self._callbacks: dict[str, list[Callable]] = {}

    @staticmethod
    def _default_store():
        from .store import MemoryStore
        return MemoryStore()

    def request_approval(
        self,
        action: str,
        description: str = "",
        agent_id: str = "",
        amount_usd: Optional[float] = None,
        vendor: str = "",
        risk_score: float = 0.0,
        risk_level: str = "low",
        metadata: Optional[dict] = None,
    ) -> ApprovalRequest:
        """Submit a request for human approval.

        If risk_score is below auto_approve_below, the request is auto-approved.
        If risk_score is above auto_reject_above, the request is auto-rejected.
        Otherwise, the request is queued for human review.

        Args:
            action: The action type (e.g., "payment", "file_delete")
            description: Human-readable description
            agent_id: Agent identifier
            amount_usd: Dollar amount (for payments)
            vendor: Vendor/domain (for payments)
            risk_score: Risk score 0-1
            risk_level: Risk level (low/medium/high/critical)
            metadata: Additional metadata

        Returns:
            ApprovalRequest with status set appropriately
        """
        request = ApprovalRequest(
            agent_id=agent_id,
            action=action,
            description=description,
            amount_usd=amount_usd,
            vendor=vendor,
            risk_score=risk_score,
            risk_level=risk_level,
            metadata=metadata or {},
        )

        # Auto-approve low-risk
        if risk_score <= self.auto_approve_below and self.auto_approve_below > 0:
            request.status = ApprovalStatus.APPROVED
            request.decided_by = "auto"
            request.decided_at = datetime.now(timezone.utc).isoformat()
            request.reason = f"Auto-approved: risk score {risk_score} <= {self.auto_approve_below}"
        # Auto-reject high-risk
        elif risk_score >= self.auto_reject_above and self.auto_reject_above < 1.0:
            request.status = ApprovalStatus.REJECTED
            request.decided_by = "auto"
            request.decided_at = datetime.now(timezone.utc).isoformat()
            request.reason = f"Auto-rejected: risk score {risk_score} >= {self.auto_reject_above}"
        else:
            # Queue for human review
            request.status = ApprovalStatus.PENDING
            # Send notification
            self._notify(request)

        self._store.save(request)
        self._fire_callbacks("request", request)
        return request

    def approve(self, request_id: str, decided_by: str = "", reason: str = "") -> ApprovalDecision:
        """Approve a pending request.

        Args:
            request_id: The request ID to approve
            decided_by: Who approved it
            reason: Optional reason

        Returns:
            ApprovalDecision
        """
        request = self._store.get(request_id)
        if not request:
            raise ValueError(f"Request {request_id} not found")

        if request.status != ApprovalStatus.PENDING:
            raise ValueError(f"Request {request_id} is not pending (status: {request.status.value})")

        request.status = ApprovalStatus.APPROVED
        request.decided_by = decided_by
        request.decided_at = datetime.now(timezone.utc).isoformat()
        request.reason = reason or "Approved by human"

        self._store.save(request)

        decision = ApprovalDecision(
            request_id=request_id,
            status=ApprovalStatus.APPROVED,
            decided_by=decided_by,
            reason=request.reason,
        )
        self._fire_callbacks("approve", decision)
        return decision

    def reject(self, request_id: str, decided_by: str = "", reason: str = "") -> ApprovalDecision:
        """Reject a pending request.

        Args:
            request_id: The request ID to reject
            decided_by: Who rejected it
            reason: Optional reason

        Returns:
            ApprovalDecision
        """
        request = self._store.get(request_id)
        if not request:
            raise ValueError(f"Request {request_id} not found")

        if request.status != ApprovalStatus.PENDING:
            raise ValueError(f"Request {request_id} is not pending (status: {request.status.value})")

        request.status = ApprovalStatus.REJECTED
        request.decided_by = decided_by
        request.decided_at = datetime.now(timezone.utc).isoformat()
        request.reason = reason or "Rejected by human"

        self._store.save(request)

        decision = ApprovalDecision(
            request_id=request_id,
            status=ApprovalStatus.REJECTED,
            decided_by=decided_by,
            reason=request.reason,
        )
        self._fire_callbacks("reject", decision)
        return decision

    def cancel(self, request_id: str, reason: str = "") -> ApprovalDecision:
        """Cancel a pending request.

        Args:
            request_id: The request ID to cancel
            reason: Optional reason

        Returns:
            ApprovalDecision
        """
        request = self._store.get(request_id)
        if not request:
            raise ValueError(f"Request {request_id} not found")

        request.status = ApprovalStatus.CANCELLED
        request.decided_at = datetime.now(timezone.utc).isoformat()
        request.reason = reason or "Cancelled"

        self._store.save(request)

        decision = ApprovalDecision(
            request_id=request_id,
            status=ApprovalStatus.CANCELLED,
            reason=request.reason,
        )
        self._fire_callbacks("cancel", decision)
        return decision

    def get_request(self, request_id: str) -> Optional[ApprovalRequest]:
        """Get a request by ID."""
        return self._store.get(request_id)

    def list_pending(self, agent_id: Optional[str] = None) -> list[ApprovalRequest]:
        """List all pending requests, optionally filtered by agent."""
        requests = self._store.list_all()
        pending = [r for r in requests if r.status == ApprovalStatus.PENDING]
        if agent_id:
            pending = [r for r in pending if r.agent_id == agent_id]
        return pending

    def list_all(self, status: Optional[ApprovalStatus] = None) -> list[ApprovalRequest]:
        """List all requests, optionally filtered by status."""
        requests = self._store.list_all()
        if status:
            requests = [r for r in requests if r.status == status]
        return requests

    def stats(self) -> dict:
        """Get approval statistics."""
        requests = self._store.list_all()
        total = len(requests)
        pending = sum(1 for r in requests if r.status == ApprovalStatus.PENDING)
        approved = sum(1 for r in requests if r.status == ApprovalStatus.APPROVED)
        rejected = sum(1 for r in requests if r.status == ApprovalStatus.REJECTED)
        expired = sum(1 for r in requests if r.status == ApprovalStatus.EXPIRED)
        total_approved_usd = sum(r.amount_usd or 0 for r in requests if r.status == ApprovalStatus.APPROVED and r.amount_usd)
        total_rejected_usd = sum(r.amount_usd or 0 for r in requests if r.status == ApprovalStatus.REJECTED and r.amount_usd)
        return {
            "total": total,
            "pending": pending,
            "approved": approved,
            "rejected": rejected,
            "expired": expired,
            "total_approved_usd": round(total_approved_usd, 2),
            "total_rejected_usd": round(total_rejected_usd, 2),
            "approval_rate": round(approved / total * 100, 1) if total > 0 else 0,
        }

    def on(self, event: str, callback: Callable) -> None:
        """Register a callback for an event (request, approve, reject, cancel)."""
        if event not in self._callbacks:
            self._callbacks[event] = []
        self._callbacks[event].append(callback)

    def _notify(self, request: ApprovalRequest) -> None:
        """Send a notification about a pending request."""
        if self.notification_handler:
            self.notification_handler(request)
            return

        if self.notification_channel == NotificationChannel.CONSOLE:
            print(f"\n🔔 Approval Request: {request.action}")
            print(f"   ID: {request.request_id}")
            print(f"   Description: {request.description}")
            if request.amount_usd:
                print(f"   Amount: ${request.amount_usd:.2f}")
            if request.vendor:
                print(f"   Vendor: {request.vendor}")
            print(f"   Risk: {request.risk_level} ({request.risk_score:.2f})")
            print(f"   Status: {request.status.value}")
            print()

    def _fire_callbacks(self, event: str, data) -> None:
        """Fire registered callbacks for an event."""
        for callback in self._callbacks.get(event, []):
            try:
                callback(data)
            except Exception:
                pass  # Don't let callback errors break the gateway