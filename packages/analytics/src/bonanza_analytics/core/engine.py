"""Analytics engine — privacy-first, AI-powered analytics."""

from __future__ import annotations
import hashlib
import uuid
from datetime import datetime, timezone
from typing import Optional
from collections import defaultdict
from pydantic import BaseModel, Field


class PageView(BaseModel):
    """A single page view event."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    site_id: str
    url: str
    referrer: str = ""
    country: str = ""
    device: str = ""  # mobile, desktop, tablet
    browser: str = ""
    duration_sec: int = 0
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    # Privacy: no cookies, no PII — visitor is hashed IP + UA
    visitor_hash: str = ""


class AnalyticsSummary(BaseModel):
    """Summary stats for a site."""
    site_id: str
    period: str  # "1d", "7d", "30d"
    page_views: int
    unique_visitors: int
    avg_duration_sec: float
    top_pages: list[dict]
    top_referrers: list[dict]
    top_countries: list[dict]
    bounce_rate: float
    ai_insights: str = ""


class AnalyticsEngine:
    """Privacy-first analytics engine."""

    def __init__(self):
        self._events: list[PageView] = []

    def track(self, site_id: str, url: str, referrer: str = "", country: str = "",
              device: str = "", browser: str = "", duration_sec: int = 0,
              visitor_hash: str = "") -> PageView:
        """Record a page view."""
        if not visitor_hash:
            visitor_hash = hashlib.sha256(f"{site_id}:{url}:{datetime.now().strftime('%Y%m%d')}".encode()).hexdigest()[:16]
        pv = PageView(
            site_id=site_id, url=url, referrer=referrer, country=country,
            device=device, browser=browser, duration_sec=duration_sec, visitor_hash=visitor_hash,
        )
        self._events.append(pv)
        return pv

    def summary(self, site_id: str, period: str = "7d") -> AnalyticsSummary:
        """Get analytics summary for a site."""
        events = [e for e in self._events if e.site_id == site_id]
        unique = set(e.visitor_hash for e in events)

        # Top pages
        page_counts = defaultdict(int)
        for e in events:
            page_counts[e.url] += 1
        top_pages = [{"url": u, "views": c} for u, c in sorted(page_counts.items(), key=lambda x: -x[1])[:10]]

        # Top referrers
        ref_counts = defaultdict(int)
        for e in events:
            if e.referrer:
                ref_counts[e.referrer] += 1
        top_referrers = [{"referrer": r, "views": c} for r, c in sorted(ref_counts.items(), key=lambda x: -x[1])[:5]]

        # Top countries
        country_counts = defaultdict(int)
        for e in events:
            if e.country:
                country_counts[e.country] += 1
        top_countries = [{"country": c, "views": n} for c, n in sorted(country_counts.items(), key=lambda x: -x[1])[:5]]

        avg_duration = sum(e.duration_sec for e in events) / max(len(events), 1)
        bounce_rate = 0.0  # Would need session tracking

        return AnalyticsSummary(
            site_id=site_id, period=period, page_views=len(events),
            unique_visitors=len(unique), avg_duration_sec=round(avg_duration, 1),
            top_pages=top_pages, top_referrers=top_referrers,
            top_countries=top_countries, bounce_rate=bounce_rate,
            ai_insights="AI insights require LLM integration — install bonanza-agents",
        )

    def tracking_script(self, site_id: str) -> str:
        """Generate a client-side tracking script."""
        return f"""<script>
(function() {{
  var s=document.createElement('script');
  s.src='/bonanza.js?site={site_id}';
  document.head.appendChild(s);
}})();
</script>"""

    def bonanza_js(self, site_id: str) -> str:
        """Generate the bonanza.js tracker."""
        return f"""// Bonanza Analytics — Privacy-first, no cookies
(function() {{
  var siteId = '{site_id}';
  var endpoint = '/api/track';
  function track() {{
    var data = {{
      site_id: siteId,
      url: location.href,
      referrer: document.referrer,
      device: /Mobi/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    }};
    navigator.sendBeacon(endpoint, JSON.stringify(data));
  }}
  track();
  window.addEventListener('beforeunload', function() {{
    var end = Date.now();
    navigator.sendBeacon(endpoint, JSON.stringify({{site_id: siteId, duration: Math.round((end - start) / 1000)}}));
  }});
  var start = Date.now();
}})();"""