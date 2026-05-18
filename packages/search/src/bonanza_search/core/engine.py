"""Search engine — multi-provider web search with caching."""

from __future__ import annotations
import json
import httpx
from typing import Optional
from pydantic import BaseModel
from bs4 import BeautifulSoup


class SearchResult(BaseModel):
    title: str
    url: str
    snippet: str = ""
    source: str = ""


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
    total: int
    source: str


class WebSearchEngine:
    """Multi-provider web search engine."""

    def __init__(self):
        self._cache: dict[str, SearchResponse] = {}

    async def search(self, query: str, max_results: int = 10, provider: str = "duckduckgo") -> SearchResponse:
        """Search the web."""
        cache_key = f"{query}:{max_results}:{provider}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        if provider == "duckduckgo":
            results = await self._search_duckduckgo(query, max_results)
        else:
            results = []

        resp = SearchResponse(query=query, results=results, total=len(results), source=provider)
        self._cache[cache_key] = resp
        return resp

    async def _search_duckduckgo(self, query: str, max_results: int) -> list[SearchResult]:
        """Search using DuckDuckGo HTML."""
        results = []
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(
                "https://html.duckduckgo.com/html/",
                params={"q": query},
                headers={"User-Agent": "Mozilla/5.0"},
            )
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "html.parser")
                for r in soup.select(".result")[:max_results]:
                    title_el = r.select_one(".result__a")
                    snippet_el = r.select_one(".result__snippet")
                    if title_el:
                        url = title_el.get("href", "")
                        # Clean DuckDuckGo redirect URLs
                        if "uddg=" in url:
                            from urllib.parse import unquote
                            url = unquote(url.split("uddg=")[1].split("&")[0])
                        results.append(SearchResult(
                            title=title_el.get_text(strip=True),
                            url=url,
                            snippet=snippet_el.get_text(strip=True) if snippet_el else "",
                            source="duckduckgo",
                        ))
        return results

    async def extract(self, url: str, max_chars: int = 5000) -> dict:
        """Extract text content from a URL."""
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "html.parser")
                # Remove scripts and styles
                for tag in soup(["script", "style", "nav", "footer"]):
                    tag.decompose()
                text = soup.get_text(separator="\n", strip=True)[:max_chars]
                title = soup.title.get_text(strip=True) if soup.title else ""
                return {"title": title, "url": url, "text": text, "length": len(text)}
            return {"error": f"HTTP {resp.status_code}", "url": url}