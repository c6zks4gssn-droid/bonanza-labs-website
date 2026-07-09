import { NextRequest, NextResponse } from 'next/server';

// PageAgent backend proxy — forwards chat completions to OpenRouter
// Keeps API key server-side, exposes OpenAI-compatible endpoint for PageAgent widget

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'tencent/hy3:free'; // Free, 120B, good quality, reasoning model

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: 'Agent backend not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { messages, stream } = body as { messages: ChatMessage[]; stream?: boolean };

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    // System prompt for Bonanza Labs page assistant
    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `Je bent de Bonanza Labs AI-assistent. Je helpt bezoekers van bonanza-labs.com met vragen over onze producten en diensten.

Belangrijk:
- Spreek de taal van de gebruiker (Nederlands of Engels)
- Wees beknopt en behulpzaam
- Verwijs naar relevante pagina's op de site
- Producten: mcp-guard (spending firewall), TenderAI (offerte generator), PageAgent (AI site assistant)
- Pricing: €2.400/€7.200/Custom
- Contact: hallo@bonanza-labs.com
- Wees eerlijk als je iets niet weet`,
    };

    const allMessages = [systemPrompt, ...messages];

    if (stream) {
      // Stream response via SSE
      const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://bonanza-labs.com',
          'X-Title': 'Bonanza Labs PageAgent',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: allMessages,
          stream: true,
          max_tokens: 2000,
          temperature: 0.4,
        }),
      });

      if (!upstream.ok || !upstream.body) {
        return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
      }

      // Pipe SSE stream through
      return new Response(upstream.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming response
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://bonanza-labs.com',
        'X-Title': 'Bonanza Labs PageAgent',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: allMessages,
        max_tokens: 2000,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter error:', response.status, errText);
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
      model: MODEL,
    });
  } catch (error) {
    console.error('Agent chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: 'Bonanza Labs Agent Chat',
    model: MODEL,
    configured: !!OPENROUTER_API_KEY,
  });
}