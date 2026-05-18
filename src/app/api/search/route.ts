import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q) {
    return NextResponse.json({ error: "q parameter required" }, { status: 400 });
  }

  // Search is disabled in production — return empty results
  // To re-enable, integrate with a search API (e.g. Brave Search, SerpAPI)
  return NextResponse.json({ results: [], query: q, message: "Search is being reconfigured. Check back soon." });
}