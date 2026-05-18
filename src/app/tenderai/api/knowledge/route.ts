import { NextRequest, NextResponse } from 'next/server';

// TenderAI — Knowledge base upload and management

interface KnowledgeBaseEntry {
  id: string;
  title: string;
  content: string;
  type: 'offer' | 'company_info' | 'case_study' | 'pricing';
  createdAt: string;
}

// In-memory store — in production this would be a database
// Using Vercel KV or similar for persistence
const knowledgeStore: Map<string, KnowledgeBaseEntry[]> = new Map();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyId, entries } = body as {
      companyId: string;
      entries: Omit<KnowledgeBaseEntry, 'id' | 'createdAt'>[];
    };

    if (!companyId || !entries?.length) {
      return NextResponse.json({ error: 'companyId and entries are required' }, { status: 400 });
    }

    const stored: KnowledgeBaseEntry[] = entries.map(e => ({
      ...e,
      id: `kb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    }));

    const existing = knowledgeStore.get(companyId) || [];
    knowledgeStore.set(companyId, [...existing, ...stored]);

    return NextResponse.json({
      added: stored.length,
      total: knowledgeStore.get(companyId)!.length,
      entries: stored,
    });
  } catch (error) {
    console.error('Knowledge base error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');

  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
  }

  const entries = knowledgeStore.get(companyId) || [];
  return NextResponse.json({ companyId, entries, total: entries.length });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  const entryId = url.searchParams.get('entryId');

  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
  }

  if (entryId) {
    const entries = knowledgeStore.get(companyId) || [];
    const filtered = entries.filter(e => e.id !== entryId);
    knowledgeStore.set(companyId, filtered);
    return NextResponse.json({ deleted: entries.length - filtered.length });
  }

  knowledgeStore.delete(companyId);
  return NextResponse.json({ deleted: 'all' });
}