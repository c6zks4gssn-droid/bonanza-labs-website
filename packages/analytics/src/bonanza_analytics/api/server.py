"""FastAPI server for Bonanza Analytics."""

from fastapi import FastAPI, Request
from bonanza_analytics.core.engine import AnalyticsEngine

app = FastAPI(title="Bonanza Analytics API", version="0.1.0")
engine = AnalyticsEngine()


@app.get("/")
def root():
    return {"name": "Bonanza Analytics", "version": "0.1.0"}


@app.post("/api/track")
async def track(request: Request):
    """Receive tracking events from bonanza.js."""
    data = await request.json()
    pv = engine.track(**data)
    return {"status": "ok", "id": pv.id}


@app.get("/api/summary/{site_id}")
def summary(site_id: str, period: str = "7d"):
    return engine.summary(site_id, period).model_dump()


@app.get("/bonanza.js")
def tracker_js(site_id: str):
    """Serve the tracking script."""
    from fastapi.responses import JavaScriptResponse
    return JavaScriptResponse(content=engine.bonanza_js(site_id))