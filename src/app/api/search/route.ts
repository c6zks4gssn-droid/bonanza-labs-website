import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { tmpdir } from "os";
import { join } from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const max = parseInt(searchParams.get("max") || "5");

  if (!q) {
    return NextResponse.json({ error: "q parameter required" }, { status: 400 });
  }

  try {
    const python = "/Users/clarenceetnel/.openclaw/workspace/tada-env/bin/python";
    const script = `
import asyncio
from bonanza_search.core.engine import WebSearchEngine
engine = WebSearchEngine()
results = asyncio.run(engine.search("${q.replace(/"/g, '\\"')}", ${max}, "duckduckgo"))
import json
print(json.dumps([{"title": r.title, "url": r.url, "snippet": r.snippet or ""} for r in results.results]))
`.trim();

    const output = execSync(`${python} -c "${script}"`, { timeout: 15000 });
    const results = JSON.parse(output.toString());
    return NextResponse.json({ results, query: q });
  } catch (e) {
    return NextResponse.json({ error: "Search failed", details: String(e) }, { status: 500 });
  }
}
