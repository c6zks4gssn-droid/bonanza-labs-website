import { NextRequest, NextResponse } from 'next/server';

// BonanzaLabs chat agent — forwards to MiniMax-M3 or OpenRouter
// Keeps API key server-side, exposes OpenAI-compatible endpoint for chat widget

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const useMiniMax = !!MINIMAX_API_KEY;
const useOpenRouter = !useMiniMax && !!OPENROUTER_API_KEY;

const MINIMAX_BASE_URL = 'https://api.minimaxi.chat/v1';
const MINIMAX_MODEL = 'MiniMax-M3';
const OPENROUTER_MODEL = 'tencent/hy3:free';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `Je bent de BonanzaLabs AI-assistent. Je helpt bezoekers van bonanza-labs.com met vragen over onze diensten.

Over BonanzaLabs:
We bouwen praktische automatiseringssystemen voor het Nederlandse MKB. Minder handwerk, snellere opvolging, meer omzet.

Onze diensten:

🔧 TradeFlow — automatisering voor bouw, installatie en zakelijke dienstverlening
- Conversiegerichte website, intake- en offerteformulieren, AI-offertegenerator, WhatsApp-opvolging, leadpipeline en CRM, dashboard met aanvragen
- Implementatie: vanaf €2.500
- Voor bedrijven die offertes maken en leads opvolgen

🍽️ ServeFlow — automatisering voor horeca
- Online reserveringen, WhatsApp-bevestigingen, no-showpreventie, reviewverzoeken, digitale menukaart, lokale vindbaarheid
- Implementatie: vanaf €2.500
- Voor restaurants, cafés en cateraars

🎙️ Bonanza Voice — AI-telefonie en spraakautomatisering
- AI-telefonie, afspraken en reserveringen registreren, veelgestelde vragen beantwoorden, gesprekssamenvattingen, doorverbinden naar medewerkers, WhatsApp voice en follow-up
- Implementatie: vanaf €1.495
- Ook beschikbaar als add-on voor TradeFlow en ServeFlow

Flow Assessment:
- Eerst analyseren we je processen in een gesprek van 60 minuten
- Je krijgt een rapport met prioriteiten en verwachte besparing en ROI
- Prijs: €497 introductie / €999 standaard

Werkwijze:
1. Analyse — We analyseren je processen en knelpunten.
2. Ontwerp — We ontwerpen een systeem dat past bij jouw bedrijfsvoering.
3. Implementatie — We bouwen en installeren alles. Live in 2-4 weken.
4. Optimalisatie — Maandelijkse beheer en verbetering.

Beheer en optimalisatie: vanaf €197 per maand.
Telefonie en AI-verbruik: apart op basis van gebruik.

Regels:
- Spreek de taal van de gebruiker (Nederlands of Engels)
- Wees beknopt, vriendelijk en behulpzaam
- Stuur voor vragen naar de juiste productpagina (/pricing)
- Voor afspraken of offertes: verwijs naar hello@bonanzalabs.com
- Wees eerlijk als je iets niet weet
- Vraag naar bedrijfsnaam en wat ze doen als ze interesse tonen
- Geef geen korting tenzij expliciet gevraagd
- Gebruik de naam "BonanzaLabs" (niet "BonanzaLabs")
- Gebruik "Bonanza Voice" (niet "VoiceFlow" of "Bonanna Voice")`;

// Simple in-memory rate limiting (production: KV)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // max 10 messages per minute
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 50;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Te veel verzoeken. Probeer het over een minuut opnieuw.' }, { status: 429 });
    }

    const body = await req.json();
    const { messages, stream } = body as { messages: ChatMessage[]; stream?: boolean };

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    // Limit number of messages in a conversation
    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: 'Te veel berichten' }, { status: 400 });
    }

    // Validate message length
    for (const msg of messages) {
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return NextResponse.json({ error: 'Bericht te lang' }, { status: 400 });
      }
    }

    // Filter system messages from client — only our system prompt is allowed
    const filteredMessages = messages.filter(m => m.role !== 'system');
    const allMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...filteredMessages,
    ];

    if (!useMiniMax && !useOpenRouter) {
      return NextResponse.json(
        { error: 'Agent backend not configured. Set MINIMAX_API_KEY or OPENROUTER_API_KEY.' },
        { status: 503 }
      );
    }

    const apiUrl = useMiniMax
      ? `${MINIMAX_BASE_URL}/chat/completions`
      : 'https://openrouter.ai/api/v1/chat/completions';
    const apiKey = useMiniMax ? MINIMAX_API_KEY! : OPENROUTER_API_KEY!;
    const model = useMiniMax ? MINIMAX_MODEL : OPENROUTER_MODEL;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    if (!useMiniMax) {
      headers['HTTP-Referer'] = 'https://bonanza-labs.com';
      headers['X-Title'] = 'BonanzaLabs Chat Agent';
    }

    if (stream) {
      const upstream = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: allMessages,
          stream: true,
          max_tokens: 1000,
          temperature: 0.4,
        }),
      });

      if (!upstream.ok || !upstream.body) {
        return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
      }

      return new Response(upstream.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming response
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: allMessages,
        max_tokens: 1000,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Chat API error:', response.status, errText);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      id: data.id,
      object: 'chat.completion',
      choices: [{
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: data.choices?.[0]?.finish_reason || 'stop',
      }],
      model,
    });
  } catch (error) {
    console.error('Agent chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: 'BonanzaLabs Chat Agent',
    model: useMiniMax ? MINIMAX_MODEL : OPENROUTER_MODEL,
    configured: !!(MINIMAX_API_KEY || OPENROUTER_API_KEY),
  });
}