import { NextRequest, NextResponse } from 'next/server';

interface FirewallEvent {
  id: string;
  requestId: string;
  agentId: string;
  merchant: string;
  merchantUrl: string;
  amountCents: number;
  currency: string;
  decision: 'allow' | 'deny' | 'require_approval';
  status: 'pending_approval' | 'approved' | 'denied' | 'completed' | 'canceled';
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  reasons: string[];
  createdAt: string;
  updatedAt: string;
  checkoutSessionId?: string;
}

declare global {
  var __firewallEvents: FirewallEvent[] | undefined;
}

function getEvents(): FirewallEvent[] {
  if (!globalThis.__firewallEvents) globalThis.__firewallEvents = [];
  return globalThis.__firewallEvents;
}

// GET — list events + summary
export async function GET() {
  const events = getEvents();
  const pending = events.filter(e => e.status === 'pending_approval').length;
  const approved = events.filter(e => e.status === 'approved' || e.status === 'completed').length;
  const denied = events.filter(e => e.status === 'denied').length;
  const highRisk = events.filter(e => e.riskLevel === 'high').length;

  return NextResponse.json({
    events: events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    summary: { pending, approved, denied, highRisk },
  });
}

// POST — approve/deny a request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId, action } = body;

    if (!requestId || !action) {
      return NextResponse.json({ error: 'Missing requestId or action' }, { status: 400 });
    }

    const events = getEvents();
    const event = events.find(e => e.requestId === requestId);
    if (!event) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (action === 'approve') {
      event.status = 'approved';
      event.updatedAt = new Date().toISOString();
      // In production: create Stripe checkout session here
      event.checkoutSessionId = `cs_test_${Date.now()}`;
    } else if (action === 'deny') {
      event.status = 'denied';
      event.updatedAt = new Date().toISOString();
    }

    return NextResponse.json({ success: true, event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}