"""Tests for bonanza-observe."""

import pytest
from bonanza_observe import Tracker, Session, Span, JsonExporter, CsvExporter


class TestTracker:
    """Test Tracker core functionality."""

    def test_basic_tracking(self):
        tracker = Tracker(name="test-agent")
        session = tracker.start_session("research")
        span = tracker.start_span("web-search")
        tracker.record_cost(provider="openai", model="gpt-4o", input_tokens=1000, output_tokens=500, latency_ms=1200)
        tracker.finish_span()
        tracker.end_session()

        summary = tracker.summary()
        assert summary["total_cost_usd"] > 0
        assert summary["total_tokens"] == 1500
        assert summary["session_count"] == 1
        assert summary["span_count"] == 1

    def test_multiple_models(self):
        tracker = Tracker(name="multi-model")
        tracker.start_session("test")
        tracker.start_span("call-1")
        tracker.record_cost(provider="openai", model="gpt-4o", input_tokens=1000, output_tokens=500)
        tracker.finish_span()

        tracker.start_span("call-2")
        tracker.record_cost(provider="anthropic", model="claude-3.5-sonnet", input_tokens=2000, output_tokens=1000)
        tracker.finish_span()
        tracker.end_session()

        summary = tracker.summary()
        assert "gpt-4o" in summary["by_model"]
        assert "claude-3.5-sonnet" in summary["by_model"]
        assert summary["total_tokens"] == 4500

    def test_budget_tracking(self):
        tracker = Tracker(name="budget-test", budget_usd=1.0)
        tracker.start_session("test")
        tracker.start_span("call")
        # gpt-4o: input $2.50/1M, output $10.00/1M
        # 100k input + 50k output = 0.25 + 0.50 = $0.75
        tracker.record_cost(provider="openai", model="gpt-4o", input_tokens=100000, output_tokens=50000)
        tracker.finish_span()
        tracker.end_session()

        budget = tracker.check_budget()
        assert budget["percentage"] == 75.0  # $0.75 / $1.00 * 100
        assert budget["over_budget"] is False
        assert budget["remaining_usd"] == 0.25

    def test_budget_alert(self):
        tracker = Tracker(name="alert-test", budget_usd=1.0, alert_threshold=0.8)
        tracker.start_session("test")
        tracker.start_span("call")
        # $0.90 cost = 90% of budget > 80% threshold
        tracker.record_cost(provider="openai", model="gpt-4o", input_tokens=100000, output_tokens=80000)
        tracker.finish_span()
        tracker.end_session()

        budget = tracker.check_budget()
        assert budget["alert"] is True

    def test_nested_spans(self):
        tracker = Tracker(name="nested")
        tracker.start_session("test")
        tracker.start_span("parent")
        tracker.start_span("child-1")
        tracker.record_cost(provider="openai", model="gpt-4o", input_tokens=500, output_tokens=200)
        tracker.finish_span()
        tracker.start_span("child-2")
        tracker.record_cost(provider="anthropic", model="claude-3.5-sonnet", input_tokens=1000, output_tokens=500)
        tracker.finish_span()
        tracker.finish_span()  # parent
        tracker.end_session()

        summary = tracker.summary()
        assert summary["span_count"] == 3  # parent + 2 children
        assert summary["total_cost_usd"] > 0

    def test_auto_cost_calculation(self):
        tracker = Tracker(name="auto-cost")
        tracker.start_session("test")
        tracker.start_span("call")
        # gpt-4o: input $2.50/1M, output $10.00/1M
        entry = tracker.record_cost(provider="openai", model="gpt-4o", input_tokens=1000000, output_tokens=1000000)
        assert abs(entry.cost_usd - 12.50) < 0.01  # $2.50 + $10.00

    def test_manual_cost(self):
        tracker = Tracker(name="manual-cost")
        tracker.start_session("test")
        tracker.start_span("call")
        entry = tracker.record_cost(provider="custom", model="custom-model", cost_usd=0.05)
        assert entry.cost_usd == 0.05
        assert entry.input_tokens == 0

    def test_latency_tracking(self):
        tracker = Tracker(name="latency")
        tracker.start_session("test")
        tracker.start_span("fast-call")
        tracker.record_cost(provider="openai", model="gpt-4o", input_tokens=100, output_tokens=50, latency_ms=250.5)
        tracker.finish_span()
        tracker.end_session()

        summary = tracker.summary()
        assert summary["avg_latency_ms"] == 250.5


class TestExporters:
    """Test JSON and CSV exporters."""

    def setup_method(self):
        self.tracker = Tracker(name="export-test")
        session = self.tracker.start_session("test")
        span = self.tracker.start_span("call")
        self.tracker.record_cost(provider="openai", model="gpt-4o", input_tokens=100, output_tokens=50, latency_ms=100)
        self.tracker.finish_span()
        self.tracker.end_session()

    def test_json_export(self):
        json_str = JsonExporter.export(self.tracker)
        import json
        data = json.loads(json_str)
        assert data["tracker"] == "export-test"
        assert len(data["sessions"]) == 1
        assert data["summary"]["total_cost_usd"] > 0

    def test_csv_export(self):
        csv_str = CsvExporter.export(self.tracker)
        lines = csv_str.strip().split("\n")
        assert len(lines) == 2  # header + 1 data row
        assert "timestamp" in lines[0]
        assert "openai" in lines[1]