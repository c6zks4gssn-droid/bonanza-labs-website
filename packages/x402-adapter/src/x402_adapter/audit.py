"""Audit trail for the Bonanza x402 firewall."""

from __future__ import annotations

import json
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from .policy import RiskLevel


@dataclass
class AuditEntry:
    """A single audit trail entry."""
    transaction_id: str
    amount: float
    vendor: str
    network: str
    token: str
    decision: str  # "approved", "blocked", "pending_approval"
    reason: str
    risk_score: float
    risk_level: RiskLevel
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self) -> dict:
        d = asdict(self)
        d["risk_level"] = self.risk_level.value
        return d

    def to_json(self) -> str:
        return json.dumps(self.to_dict(), indent=2)


class AuditLog:
    """In-memory audit log for firewall evaluations.

    Optionally persists to a JSONL file.

    Example:
        >>> log = AuditLog(path="firewall_audit.jsonl")
        >>> log.append(entry)
        >>> entries = log.query(vendor="api.weather.com")
    """

    def __init__(self, path: Optional[str] = None):
        self.entries: list[AuditEntry] = []
        self._path = Path(path) if path else None

        # Load existing entries if file exists
        if self._path and self._path.exists():
            self._load()

    def append(self, entry: AuditEntry) -> None:
        """Add an entry to the audit log."""
        self.entries.append(entry)

        if self._path:
            with open(self._path, "a") as f:
                f.write(entry.to_json() + "\n")

    def _load(self) -> None:
        """Load entries from the JSONL file."""
        if not self._path or not self._path.exists():
            return

        with open(self._path) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    data["risk_level"] = RiskLevel(data["risk_level"])
                    self.entries.append(AuditEntry(**data))
                except (json.JSONDecodeError, ValueError):
                    continue

    def query(
        self,
        vendor: Optional[str] = None,
        decision: Optional[str] = None,
        min_amount: Optional[float] = None,
        max_amount: Optional[float] = None,
        limit: int = 100,
    ) -> list[AuditEntry]:
        """Query audit entries with filters."""
        results = self.entries

        if vendor:
            results = [e for e in results if e.vendor == vendor]
        if decision:
            results = [e for e in results if e.decision == decision]
        if min_amount is not None:
            results = [e for e in results if e.amount >= min_amount]
        if max_amount is not None:
            results = [e for e in results if e.amount <= max_amount]

        return results[-limit:]

    def stats(self) -> dict:
        """Get summary statistics."""
        if not self.entries:
            return {"total": 0}

        approved = [e for e in self.entries if e.decision == "approved"]
        blocked = [e for e in self.entries if e.decision == "blocked"]
        pending = [e for e in self.entries if e.decision == "pending_approval"]

        return {
            "total": len(self.entries),
            "approved": len(approved),
            "blocked": len(blocked),
            "pending_approval": len(pending),
            "total_spend_usd": sum(e.amount for e in approved),
            "avg_risk_score": sum(e.risk_score for e in self.entries) / len(self.entries),
        }

    def __len__(self) -> int:
        return len(self.entries)

    def __iter__(self):
        return iter(self.entries)