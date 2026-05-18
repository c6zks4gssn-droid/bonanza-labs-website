"""Tests for bonanza-approve."""

import pytest
from bonanza_approve import (
    ApprovalGateway,
    ApprovalRequest,
    ApprovalDecision,
    ApprovalStatus,
    NotificationChannel,
    MemoryStore,
    FileStore,
)


class TestApprovalGateway:
    """Test ApprovalGateway core functionality."""

    def setup_method(self):
        self.gw = ApprovalGateway(name="test")

    def test_request_approval(self):
        request = self.gw.request_approval(
            action="payment",
            description="Pay $5.00 for weather API",
            amount_usd=5.00,
            vendor="api.weather.com",
            risk_score=0.3,
        )
        assert request.status == ApprovalStatus.PENDING
        assert request.action == "payment"
        assert request.amount_usd == 5.00

    def test_auto_approve_low_risk(self):
        gw = ApprovalGateway(auto_approve_below=0.2)
        request = gw.request_approval(
            action="payment",
            description="Small payment",
            amount_usd=0.50,
            risk_score=0.1,
        )
        assert request.status == ApprovalStatus.APPROVED
        assert request.decided_by == "auto"

    def test_auto_reject_high_risk(self):
        gw = ApprovalGateway(auto_reject_above=0.8)
        request = gw.request_approval(
            action="payment",
            description="Suspicious payment",
            amount_usd=1000.00,
            risk_score=0.95,
        )
        assert request.status == ApprovalStatus.REJECTED

    def test_manual_approve(self):
        request = self.gw.request_approval(
            action="payment",
            description="Pay $5.00",
            amount_usd=5.00,
            risk_score=0.3,
        )
        decision = self.gw.approve(request.request_id, decided_by="admin", reason="Looks good")
        assert decision.status == ApprovalStatus.APPROVED
        assert decision.decided_by == "admin"

        # Verify request is updated
        updated = self.gw.get_request(request.request_id)
        assert updated.status == ApprovalStatus.APPROVED

    def test_manual_reject(self):
        request = self.gw.request_approval(
            action="payment",
            description="Pay $5.00",
            amount_usd=5.00,
            risk_score=0.3,
        )
        decision = self.gw.reject(request.request_id, decided_by="admin", reason="Too expensive")
        assert decision.status == ApprovalStatus.REJECTED

    def test_cancel_request(self):
        request = self.gw.request_approval(
            action="payment",
            description="Pay $5.00",
            risk_score=0.3,
        )
        decision = self.gw.cancel(request.request_id, reason="No longer needed")
        assert decision.status == ApprovalStatus.CANCELLED

    def test_cannot_approve_non_pending(self):
        request = self.gw.request_approval(
            action="payment",
            description="Pay $5.00",
            risk_score=0.3,
        )
        self.gw.approve(request.request_id, decided_by="admin")
        with pytest.raises(ValueError, match="not pending"):
            self.gw.approve(request.request_id, decided_by="admin2")

    def test_list_pending(self):
        self.gw.request_approval(action="payment", description="Pay $5", risk_score=0.3)
        self.gw.request_approval(action="payment", description="Pay $10", risk_score=0.5)
        pending = self.gw.list_pending()
        assert len(pending) == 2

        # Approve one
        self.gw.approve(pending[0].request_id, decided_by="admin")
        assert len(self.gw.list_pending()) == 1

    def test_list_pending_by_agent(self):
        self.gw.request_approval(action="payment", description="Pay $5", agent_id="agent-1", risk_score=0.3)
        self.gw.request_approval(action="payment", description="Pay $10", agent_id="agent-2", risk_score=0.3)
        pending = self.gw.list_pending(agent_id="agent-1")
        assert len(pending) == 1

    def test_stats(self):
        self.gw.request_approval(action="payment", description="Pay $5", amount_usd=5.00, risk_score=0.3)
        request2 = self.gw.request_approval(action="payment", description="Pay $10", amount_usd=10.00, risk_score=0.3)
        self.gw.approve(request2.request_id, decided_by="admin")
        stats = self.gw.stats()
        assert stats["total"] == 2
        assert stats["pending"] == 1
        assert stats["approved"] == 1
        assert stats["total_approved_usd"] == 10.00

    def test_callbacks(self):
        approved = []
        self.gw.on("approve", lambda d: approved.append(d))

        request = self.gw.request_approval(action="payment", description="Pay $5", risk_score=0.3)
        self.gw.approve(request.request_id, decided_by="admin")
        assert len(approved) == 1

    def test_notification_handler(self):
        notifications = []
        handler = lambda r: notifications.append(r)
        gw = ApprovalGateway(notification_handler=handler)
        gw.request_approval(action="payment", description="Pay $5", risk_score=0.3)
        assert len(notifications) == 1

    def test_nonexistent_request(self):
        with pytest.raises(ValueError):
            self.gw.approve("nonexistent-id")


class TestMemoryStore:
    """Test MemoryStore backend."""

    def test_save_and_get(self):
        store = MemoryStore()
        request = ApprovalRequest(action="payment", description="Pay $5")
        store.save(request)
        retrieved = store.get(request.request_id)
        assert retrieved is not None
        assert retrieved.action == "payment"

    def test_list_all(self):
        store = MemoryStore()
        store.save(ApprovalRequest(action="payment", description="Pay $5"))
        store.save(ApprovalRequest(action="file_delete", description="Delete temp.log"))
        assert len(store.list_all()) == 2

    def test_delete(self):
        store = MemoryStore()
        request = ApprovalRequest(action="payment", description="Pay $5")
        store.save(request)
        assert store.delete(request.request_id) is True
        assert store.get(request.request_id) is None


class TestFileStore:
    """Test FileStore backend."""

    def test_save_and_get(self, tmp_path):
        store = FileStore(path=str(tmp_path / "approvals"))
        request = ApprovalRequest(action="payment", description="Pay $5")
        store.save(request)
        retrieved = store.get(request.request_id)
        assert retrieved is not None
        assert retrieved.action == "payment"

    def test_list_all(self, tmp_path):
        store = FileStore(path=str(tmp_path / "approvals"))
        store.save(ApprovalRequest(action="payment", description="Pay $5"))
        store.save(ApprovalRequest(action="file_delete", description="Delete temp.log"))
        assert len(store.list_all()) == 2

    def test_delete(self, tmp_path):
        store = FileStore(path=str(tmp_path / "approvals"))
        request = ApprovalRequest(action="payment", description="Pay $5")
        store.save(request)
        assert store.delete(request.request_id) is True
        assert store.get(request.request_id) is None