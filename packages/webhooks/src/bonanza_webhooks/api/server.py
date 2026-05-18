"""FastAPI server for Bonanza Webhooks."""

from fastapi import FastAPI, Request
from bonanza_webhooks.core.hub import WebhookHub

app = FastAPI(title="Bonanza Webhooks API", version="0.1.0")
hub = WebhookHub()


@app.get("/")
def root():
    return {"name": "Bonanza Webhooks", "version": "0.1.0", "endpoints": len(hub.list_endpoints())}


@app.post("/register")
def register(path: str, agent_id: str = "", secret: str = ""):
    ep = hub.register_endpoint(path=path, agent_id=agent_id, secret=secret)
    return {"id": ep.id, "path": ep.path}


@app.post("/webhooks/{path:path}")
async def receive(path: str, request: Request):
    payload = await request.json()
    headers = dict(request.headers)
    source = headers.get("x-github-event", headers.get("x-source", ""))
    event = hub.receive_webhook(f"/webhooks/{path}", payload, headers, source)
    if event:
        return {"status": "ok", "event_id": event.id, "verified": event.verified}
    return {"status": "no_endpoint", "path": f"/webhooks/{path}"}


@app.get("/events")
def list_events(limit: int = 50):
    return [e.model_dump() for e in hub.list_events(limit)]