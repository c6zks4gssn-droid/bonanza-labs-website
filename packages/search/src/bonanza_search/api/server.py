"""FastAPI server for Bonanza Search."""

from __future__ import annotations
from fastapi import FastAPI
from pydantic import BaseModel as APIModel
from bonanza_search.core.engine import WebSearchEngine

app = FastAPI(title="Bonanza Search API", version="0.1.0")
engine = WebSearchEngine()


class SearchRequest(APIModel):
    query: str
    max_results: int = 10
    provider: str = "duckduckgo"


class ExtractRequest(APIModel):
    url: str
    max_chars: int = 5000


@app.get("/")
def root():
    return {"name": "Bonanza Search", "version": "0.1.0"}


@app.post("/search")
async def search(req: SearchRequest):
    return await engine.search(req.query, req.max_results, req.provider)


@app.post("/extract")
async def extract(req: ExtractRequest):
    return await engine.extract(req.url, req.max_chars)