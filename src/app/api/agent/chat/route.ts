import { NextRequest, NextResponse } from 'next/server';

// BonanzaLabs chat agent — forwards to MiniMax-M3 via OpenAI-compatible API
// Keeps API key server-side, exposes OpenAI-compatible endpoint for chat widget

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || process.env.OPENROUTER_API_KEY;
const MINIMAX_BASE_URL = 'https://api.minimaxi.chat/v1';
const MODEL = 'MiniMax-M3';

// Fallback to OpenRouter if MiniMax key not set
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, stream } = body as { messages: ChatMessage[]; stream?: boolean };

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    const allMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ];

    // Use MiniMax if key is set, otherwise fall back to OpenRouter
    const useMiniMax = !!MINIMAX_API_KEY;
    const apiUrl = useMiniMax
      ? `${MINIMAX_BASE_URL}/chat/completions`
      : 'https://openrouter.ai/api/v1/chat/completions';
    const apiKey = useMiniMax ? MINIMAX_API_KEY : OPENROUTER_API_KEY;
    const model = useMiniMax ? MODEL : OPENROUTER_MODEL;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Agent backend not configured. Set MINIMAX_API_KEY or OPENROUTER_API_KEY.' },
        { status: 503 }
      );
    }

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
    model: MINIMAX_API_KEY ? MODEL : OPENROUTER_MODEL,
    configured: !!(MINIMAX_API_KEY || OPENROUTER_API_KEY),
  });
}