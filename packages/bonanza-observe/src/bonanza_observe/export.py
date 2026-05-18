"""Export utilities for Bonanza Observe — JSON and CSV exporters."""

from __future__ import annotations

import json
import csv
import io
from typing import Optional
from .tracker import Tracker


class JsonExporter:
    """Export tracker data as JSON."""

    @staticmethod
    def export(tracker: Tracker, pretty: bool = True) -> str:
        """Export tracker data as JSON string."""
        data = {
            "tracker": tracker.name,
            "sessions": [s.to_dict() for s in tracker.sessions],
            "summary": tracker.summary(),
        }
        indent = 2 if pretty else None
        return json.dumps(data, indent=indent)

    @staticmethod
    def export_session(session, pretty: bool = True) -> str:
        """Export a single session as JSON string."""
        indent = 2 if pretty else None
        return json.dumps(session.to_dict(), indent=indent)

    @staticmethod
    def save(tracker: Tracker, path: str, pretty: bool = True) -> None:
        """Save tracker data to a JSON file."""
        data = JsonExporter.export(tracker, pretty=pretty)
        with open(path, "w") as f:
            f.write(data)


class CsvExporter:
    """Export tracker data as CSV."""

    @staticmethod
    def export(tracker: Tracker) -> str:
        """Export cost entries as CSV string."""
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "timestamp", "session_id", "span_name", "provider", "model",
            "input_tokens", "output_tokens", "total_tokens", "cost_usd", "latency_ms",
        ])
        for session in tracker.sessions:
            for span in session.spans:
                for entry in span.cost_entries:
                    writer.writerow([
                        entry.timestamp, entry.session_id, entry.span_name,
                        entry.provider, entry.model,
                        entry.input_tokens, entry.output_tokens, entry.total_tokens,
                        round(entry.cost_usd, 6), round(entry.latency_ms, 1),
                    ])
        return output.getvalue()

    @staticmethod
    def save(tracker: Tracker, path: str) -> None:
        """Save cost entries to a CSV file."""
        data = CsvExporter.export(tracker)
        with open(path, "w") as f:
            f.write(data)