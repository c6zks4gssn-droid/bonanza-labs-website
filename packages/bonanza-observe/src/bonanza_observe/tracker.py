"""Tracker — Core observability engine for AI agent cost tracking."""

from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from collections import defaultdict


class SpanStatus(Enum):
    """Status of a tracing span."""
    ACTIVE = "active"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class CostEntry:
    """A single cost record."""
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    provider: str = ""        # e.g., "openai", "anthropic", "google"
    model: str = ""           # e.g., "gpt-4o", "claude-3.5-sonnet"
    input_tokens: int = 0
    output_tokens: int = 0
    total_tokens: int = 0
    cost_usd: float = 0.0
    latency_ms: float = 0.0
    span_name: str = ""
    session_id: str = ""
    metadata: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "timestamp": self.timestamp,
            "provider": self.provider,
            "model": self.model,
            "input_tokens": self.input_tokens,
            "output_tokens": self.output_tokens,
            "total_tokens": self.total_tokens,
            "cost_usd": round(self.cost_usd, 6),
            "latency_ms": round(self.latency_ms, 1),
            "span_name": self.span_name,
            "session_id": self.session_id,
            "metadata": self.metadata,
        }


@dataclass
class Span:
    """A tracing span — represents a single operation."""
    name: str
    span_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    parent_id: Optional[str] = None
    session_id: str = ""
    start_time: float = field(default_factory=time.time)
    end_time: Optional[float] = None
    status: SpanStatus = SpanStatus.ACTIVE
    cost_entries: list[CostEntry] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)

    def finish(self, status: SpanStatus = SpanStatus.COMPLETED) -> None:
        self.end_time = time.time()
        self.status = status

    @property
    def duration_ms(self) -> float:
        if self.end_time:
            return (self.end_time - self.start_time) * 1000
        return (time.time() - self.start_time) * 1000

    @property
    def total_cost(self) -> float:
        return sum(e.cost_usd for e in self.cost_entries)

    @property
    def total_tokens(self) -> int:
        return sum(e.total_tokens for e in self.cost_entries)

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "span_id": self.span_id,
            "parent_id": self.parent_id,
            "session_id": self.session_id,
            "status": self.status.value,
            "duration_ms": round(self.duration_ms, 1),
            "total_cost_usd": round(self.total_cost, 6),
            "total_tokens": self.total_tokens,
            "cost_entries": [e.to_dict() for e in self.cost_entries],
            "metadata": self.metadata,
        }


@dataclass
class Session:
    """A tracking session — groups spans and costs together."""
    session_id: str = field(default_factory=lambda: str(uuid.uuid4())[:12])
    name: str = ""
    start_time: float = field(default_factory=time.time)
    end_time: Optional[float] = None
    spans: list[Span] = field(default_factory=list)
    tags: dict = field(default_factory=dict)

    @property
    def total_cost(self) -> float:
        return sum(s.total_cost for s in self.spans)

    @property
    def total_tokens(self) -> int:
        return sum(s.total_tokens for s in self.spans)

    @property
    def total_input_tokens(self) -> int:
        return sum(e.input_tokens for s in self.spans for e in s.cost_entries)

    @property
    def total_output_tokens(self) -> int:
        return sum(e.output_tokens for s in self.spans for e in s.cost_entries)

    @property
    def avg_latency_ms(self) -> float:
        latencies = [e.latency_ms for s in self.spans for e in s.cost_entries if e.latency_ms > 0]
        return sum(latencies) / len(latencies) if latencies else 0.0

    @property
    def span_count(self) -> int:
        return len(self.spans)

    def to_dict(self) -> dict:
        return {
            "session_id": self.session_id,
            "name": self.name,
            "duration_ms": round((self.end_time or time.time()) - self.start_time, 1) * 1000,
            "total_cost_usd": round(self.total_cost, 6),
            "total_tokens": self.total_tokens,
            "total_input_tokens": self.total_input_tokens,
            "total_output_tokens": self.total_output_tokens,
            "avg_latency_ms": round(self.avg_latency_ms, 1),
            "span_count": self.span_count,
            "spans": [s.to_dict() for s in self.spans],
            "tags": self.tags,
        }


# Pricing data (per 1M tokens) — update as needed
PRICING: dict[str, dict[str, float]] = {
    "gpt-4o": {"input": 2.50, "output": 10.00},
    "gpt-4o-mini": {"input": 0.15, "output": 0.60},
    "gpt-4-turbo": {"input": 10.00, "output": 30.00},
    "gpt-3.5-turbo": {"input": 0.50, "output": 1.50},
    "claude-3.5-sonnet": {"input": 3.00, "output": 15.00},
    "claude-3-haiku": {"input": 0.25, "output": 1.25},
    "claude-3-opus": {"input": 15.00, "output": 75.00},
    "gemini-1.5-pro": {"input": 1.25, "output": 5.00},
    "gemini-1.5-flash": {"input": 0.075, "output": 0.30},
    "llama-3.1-70b": {"input": 0.60, "output": 0.60},
    "llama-3.1-8b": {"input": 0.05, "output": 0.05},
}


class Tracker:
    """Cost and usage tracker for AI agent sessions.

    Example:
        >>> from bonanza_observe import Tracker
        >>> tracker = Tracker(name="my-agent")
        >>> session = tracker.start_session("research-task")
        >>> span = tracker.start_span("web-search")
        >>> tracker.record_cost(provider="openai", model="gpt-4o",
        ...     input_tokens=1000, output_tokens=500, latency_ms=1200)
        >>> tracker.finish_span()
        >>> print(tracker.summary())
    """

    def __init__(
        self,
        name: str = "default",
        budget_usd: Optional[float] = None,
        alert_threshold: float = 0.8,
    ):
        self.name = name
        self.budget_usd = budget_usd
        self.alert_threshold = alert_threshold
        self.sessions: list[Session] = []
        self._current_session: Optional[Session] = None
        self._current_span: Optional[Span] = None
        self._span_stack: list[Span] = []

    def start_session(self, name: str = "", tags: Optional[dict] = None) -> Session:
        """Start a new tracking session."""
        session = Session(name=name, tags=tags or {})
        self.sessions.append(session)
        self._current_session = session
        return session

    def end_session(self) -> Optional[Session]:
        """End the current session."""
        if self._current_session:
            self._current_session.end_time = time.time()
            session = self._current_session
            self._current_session = None
            return session
        return None

    def start_span(self, name: str, metadata: Optional[dict] = None) -> Span:
        """Start a new span within the current session."""
        parent_id = self._current_span.span_id if self._current_span else None
        span = Span(
            name=name,
            parent_id=parent_id,
            session_id=self._current_session.session_id if self._current_session else "",
            metadata=metadata or {},
        )
        if self._current_session:
            self._current_session.spans.append(span)
        self._span_stack.append(span)
        self._current_span = span
        return span

    def finish_span(self, status: SpanStatus = SpanStatus.COMPLETED) -> Optional[Span]:
        """Finish the current span."""
        if self._span_stack:
            span = self._span_stack.pop()
            span.finish(status)
            self._current_span = self._span_stack[-1] if self._span_stack else None
            return span
        return None

    def record_cost(
        self,
        provider: str,
        model: str,
        input_tokens: int = 0,
        output_tokens: int = 0,
        cost_usd: Optional[float] = None,
        latency_ms: float = 0.0,
        metadata: Optional[dict] = None,
    ) -> CostEntry:
        """Record a cost entry in the current span."""
        total_tokens = input_tokens + output_tokens

        # Auto-calculate cost if not provided
        if cost_usd is None:
            pricing = PRICING.get(model, {"input": 0, "output": 0})
            cost_usd = (input_tokens * pricing["input"] + output_tokens * pricing["output"]) / 1_000_000

        entry = CostEntry(
            provider=provider,
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            total_tokens=total_tokens,
            cost_usd=cost_usd,
            latency_ms=latency_ms,
            span_name=self._current_span.name if self._current_span else "",
            session_id=self._current_session.session_id if self._current_session else "",
            metadata=metadata or {},
        )

        if self._current_span:
            self._current_span.cost_entries.append(entry)

        return entry

    def check_budget(self) -> dict:
        """Check if spending is within budget."""
        total = sum(s.total_cost for s in self.sessions)
        if self.budget_usd is None:
            return {"total_usd": round(total, 6), "budget_usd": None, "remaining_usd": None, "percentage": None}
        remaining = self.budget_usd - total
        percentage = (total / self.budget_usd) * 100
        return {
            "total_usd": round(total, 6),
            "budget_usd": self.budget_usd,
            "remaining_usd": round(remaining, 6),
            "percentage": round(percentage, 1),
            "over_budget": total > self.budget_usd,
            "alert": percentage >= self.alert_threshold * 100,
        }

    def summary(self) -> dict:
        """Get a summary of all tracking data."""
        total_cost = sum(s.total_cost for s in self.sessions)
        total_tokens = sum(s.total_tokens for s in self.sessions)
        total_input = sum(s.total_input_tokens for s in self.sessions)
        total_output = sum(s.total_output_tokens for s in self.sessions)
        all_latencies = [e.latency_ms for s in self.sessions for sp in s.spans for e in sp.cost_entries if e.latency_ms > 0]

        # Per-model breakdown
        by_model: dict[str, dict] = defaultdict(lambda: {"cost": 0.0, "input_tokens": 0, "output_tokens": 0, "calls": 0})
        for s in self.sessions:
            for sp in s.spans:
                for e in sp.cost_entries:
                    by_model[e.model]["cost"] += e.cost_usd
                    by_model[e.model]["input_tokens"] += e.input_tokens
                    by_model[e.model]["output_tokens"] += e.output_tokens
                    by_model[e.model]["calls"] += 1

        # Per-provider breakdown
        by_provider: dict[str, dict] = defaultdict(lambda: {"cost": 0.0, "calls": 0})
        for s in self.sessions:
            for sp in s.spans:
                for e in sp.cost_entries:
                    by_provider[e.provider]["cost"] += e.cost_usd
                    by_provider[e.provider]["calls"] += 1

        return {
            "tracker": self.name,
            "total_cost_usd": round(total_cost, 6),
            "total_tokens": total_tokens,
            "total_input_tokens": total_input,
            "total_output_tokens": total_output,
            "avg_latency_ms": round(sum(all_latencies) / len(all_latencies), 1) if all_latencies else 0,
            "session_count": len(self.sessions),
            "span_count": sum(s.span_count for s in self.sessions),
            "by_model": {k: {kk: round(vv, 6) if isinstance(vv, float) else vv for kk, vv in v.items()} for k, v in by_model.items()},
            "by_provider": {k: {kk: round(vv, 6) if isinstance(vv, float) else vv for kk, vv in v.items()} for k, v in by_provider.items()},
            "budget": self.check_budget(),
        }