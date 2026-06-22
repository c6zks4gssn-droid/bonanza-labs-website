import { NextRequest, NextResponse } from 'next/server';

// TenderAI — Visual Search API
// Searches the PixelRAG FAISS index for relevant document screenshots
// Uses the PixelRAG search server running locally on port 30001

const PIXELRAG_URL = process.env.PIXELRAG_API_URL || 'http://127.0.0.1:30001';

interface VisualSearchRequest {
  query: string;
  n_docs?: number;
}

interface VisualSearchResult {
  article_id: number;
  title: string;
  url: string;
  score: number;
  tile_index: number;
  chunk_index: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, n_docs = 5 } = body as VisualSearchRequest;

    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    // Call PixelRAG search API
    const response = await fetch(`${PIXELRAG_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        queries: [{ text: query }],
        n_docs,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('PixelRAG search failed:', errText);
      return NextResponse.json(
        { error: 'Visual search server unavailable', detail: errText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const results: VisualSearchResult[] = data.results?.[0] || [];

    return NextResponse.json({
      query,
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Visual search error:', error);
    // Graceful fallback — return empty results if PixelRAG server is down
    return NextResponse.json({
      query: '',
      results: [],
      total: 0,
      note: 'Visual search server not available. Start with: cd pixelrag-test && python3 serve_mps.py',
    });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.get('q');
  const n_docs = parseInt(url.searchParams.get('n') || '5');

  if (!query) {
    return NextResponse.json({
      service: 'TenderAI Visual Search',
      status: 'ready',
      pixelrag_url: PIXELRAG_URL,
    });
  }

  // Forward as POST
  return POST(new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, n_docs }),
  }));
}