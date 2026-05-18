"""Storage backends for Bonanza Approve."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Optional

from .gateway import ApprovalRequest, ApprovalStatus


class MemoryStore:
    """In-memory store for approval requests (default, no persistence)."""

    def __init__(self):
        self._requests: dict[str, ApprovalRequest] = {}

    def save(self, request: ApprovalRequest) -> None:
        self._requests[request.request_id] = request

    def get(self, request_id: str) -> Optional[ApprovalRequest]:
        return self._requests.get(request_id)

    def list_all(self) -> list[ApprovalRequest]:
        return list(self._requests.values())

    def delete(self, request_id: str) -> bool:
        if request_id in self._requests:
            del self._requests[request_id]
            return True
        return False


class FileStore:
    """File-based store for approval requests (JSON persistence)."""

    def __init__(self, path: str = "~/.bonanza/approvals"):
        self.path = Path(path).expanduser()
        self.path.mkdir(parents=True, exist_ok=True)

    def _request_path(self, request_id: str) -> Path:
        return self.path / f"{request_id}.json"

    def save(self, request: ApprovalRequest) -> None:
        data = request.to_dict()
        with open(self._request_path(request.request_id), "w") as f:
            json.dump(data, f, indent=2)

    def get(self, request_id: str) -> Optional[ApprovalRequest]:
        path = self._request_path(request_id)
        if not path.exists():
            return None
        with open(path) as f:
            data = json.load(f)
        return ApprovalRequest.from_dict(data)

    def list_all(self) -> list[ApprovalRequest]:
        requests = []
        for path in self.path.glob("*.json"):
            with open(path) as f:
                data = json.load(f)
            requests.append(ApprovalRequest.from_dict(data))
        return requests

    def delete(self, request_id: str) -> bool:
        path = self._request_path(request_id)
        if path.exists():
            path.unlink()
            return True
        return False