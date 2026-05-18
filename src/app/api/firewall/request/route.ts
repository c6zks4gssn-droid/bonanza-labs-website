import { NextRequest, NextResponse } from 'next/server';

// Shared in-memory store — import from parent route
// Since Next.js API routes are separate modules, we use a global to share state
declare global {
  var __firewallEvents: FirewallEvent[] | undefined;
}

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

function computeRisk(amountCents: number, merchant: string): { riskLevel: FirewallEvent['riskLevel']; riskScore: number; reasons: string[]; decision: FirewallEvent['decision'] } {
  const reasons: string[] = [];
  let score = 0;

  if (amountCents > 50000) { score += 40; reasons.push('Amount exceeds high-risk threshold ($500)'); }
  else if (amountCents > 10000) { score += 15; reasons.push('Amount above standard threshold ($100)'); }
  else { score += 5; reasons.push('Amount within normal range'); }

  const knownMerchants = ['openai', 'stripe', 'aws', 'google', 'github', 'vercel', 'anthropic'];
  const merchantLower = merchant.toLowerCase();
  if (knownMerchants.some(m => merchantLower.includes(m))) {
    score += 5;
    reasons.push('Known/verified merchant');
  } else {
    score += 20;
    reasons.push('Unknown merchant — requires review');
  }

  const riskLevel: FirewallEvent['riskLevel'] = score >= 50 ? 'high' : score >= 20 ? 'medium' : 'low';
  const decision: FirewallEvent['decision'] = score >= 50 ? 'deny' : score >= 15 ? 'require_approval' : 'allow';

  return { riskLevel, riskScore: Math.min(score, 100), reasons, decision };
}

function getEvents(): FirewallEvent[] {
  if (!globalThis.__firewallEvents) globalThis.__firewallEvents = [];
  return globalThis.__firewallEvents;
}

// POST — create a new firewall request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, merchant, merchantUrl, amountCents, currency } = body;

    if (!agentId || !merchant || !amountCents) {
      return NextResponse.json({ error: 'Missing required fields: agentId, merchant, amountCents' }, { status: 400 });
    }

    const { riskLevel, riskScore, reasons, decision } = computeRisk(amountCents, merchant);

    const id = `fw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const requestId = `lsrq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const event: FirewallEvent = {
      id,
      requestId,
      agentId,
      merchant,
      merchantUrl: merchantUrl || `https://${merchant.toLowerCase().replace(/\s+/g, '')}.com`,
      amountCents,
      currency: currency || 'USD',
      decision,
      status: decision === 'allow' ? 'approved' : 'pending_approval',
      riskLevel,
      riskScore,
      reasons,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    getEvents().push(event);

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}