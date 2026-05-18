"""FastAPI server for Bonanza Auth."""

from fastapi import FastAPI, Depends, HTTPException, Header
from bonanza_auth.core.manager import AuthManager

app = FastAPI(title="Bonanza Auth API", version="0.1.0")
mgr = AuthManager()


@app.get("/")
def root():
    return {"name": "Bonanza Auth", "version": "0.1.0"}


@app.post("/identities")
def create_identity(name: str, scopes: str = "read"):
    ident = mgr.create_identity(name=name, scopes=scopes.split(","))
    return ident.model_dump()


@app.post("/api-keys")
def create_api_key(agent_id: str, scopes: str = "read"):
    ak, raw = mgr.create_api_key(agent_id=agent_id, scopes=scopes.split(","))
    return {"id": ak.id, "prefix": ak.prefix, "key": raw, "scopes": ak.scopes}


@app.post("/jwt")
def create_jwt(agent_id: str):
    tok = mgr.create_jwt(agent_id=agent_id)
    return {"token": tok.token, "expires_at": tok.expires_at}


async def verify_key(x_api_key: str = Header(default="")):
    if not x_api_key:
        raise HTTPException(401, "Missing X-API-Key")
    ak = mgr.verify_api_key(x_api_key)
    if not ak:
        raise HTTPException(401, "Invalid API key")
    return ak


@app.get("/protected")
def protected(ak=Depends(verify_key)):
    return {"agent_id": ak.agent_id, "scopes": ak.scopes}