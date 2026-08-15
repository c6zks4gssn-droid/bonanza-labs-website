import { NextRequest, NextResponse } from "next/server";
import { incrementRateLimit, isRedisConfigured } from "@/lib/server-store";

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const useMiniMax = Boolean(MINIMAX_API_KEY);
const useOpenRouter = !useMiniMax && Boolean(OPENROUTER_API_KEY);

const MINIMAX_BASE_URL =
  process.env.MINIMAX_BASE_URL || "https://api.minimax.io/v1";
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || "MiniMax-M3";
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "tencent/hy3:free";

interface ChatMessage {
  role: "user" | "assistant";
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
- Je krijgt een rapport met prioriteiten en een onderbouwde ROI-schatting
- Prijs: €497 introductie / €999 standaard

Werkwijze:
1. Analyse — We analyseren je processen en knelpunten.
2. Ontwerp — We ontwerpen een systeem dat past bij jouw bedrijfsvoering.
3. Implementatie — We bouwen en installeren alles. Live in 2-4 weken.
4. Optimalisatie — Maandelijks beheer en continue verbetering.

Beheer en optimalisatie: vanaf €197 per maand.
Telefonie en AI-verbruik: apart op basis van gebruik.

Regels:
- Spreek de taal van de gebruiker (Nederlands of Engels)
- Wees beknopt, vriendelijk en behulpzaam
- Verwijs bij prijzen en het Flow Assessment naar /pricing
- Verwijs voor afspraken en offertes naar /contact of hello@bonanzalabs.com
- Wees eerlijk als je iets niet weet
- Vraag naar bedrijfsnaam en werkzaamheden als iemand interesse toont
- Beloof geen gegarandeerde omzet, besparing of resultaat
- Gebruik de naam "BonanzaLabs" (niet "BonazaLabs" of "BonannaLabs")
- Gebruik "Bonanza Voice" (niet "VoiceFlow" of "Bonanna Voice")`;

const fallbackCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_SECONDS = 60;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 30;

async function isAllowed(ip: string): Promise<boolean> {
  if (isRedisConfigured) {
    const count = await incrementRateLimit(
      `rate:chat:${ip}`,
      RATE_WINDOW_SECONDS,
    );
    return count <= RATE_LIMIT;
  }

  const now = Date.now();
  const record = fallbackCounts.get(ip);
  if (!record || now > record.resetTime) {
    fallbackCounts.set(ip, {
      count: 1,
      resetTime: now + RATE_WINDOW_SECONDS * 1000,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT) return false;
  record.count += 1;
  return true;
}

function validateMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    return null;
  }

  const messages: ChatMessage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;

    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return null;
    }

    const trimmed = content.trim();
    if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) return null;
    messages.push({ role, content: trimmed });
  }

  return messages;
}

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for") || "unknown";
    const ip = forwardedFor.split(",")[0]?.trim() || "unknown";

    if (!(await isAllowed(ip))) {
      return NextResponse.json(
        { error: "Te veel verzoeken. Probeer het over een minuut opnieuw." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const messages = validateMessages(body.messages);
    const stream = body.stream === true;

    if (!messages) {
      return NextResponse.json(
        { error: "Ongeldige of te lange chatgeschiedenis" },
        { status: 400 },
      );
    }

    if (!useMiniMax && !useOpenRouter) {
      return NextResponse.json(
        { error: "Agent backend not configured" },
        { status: 503 },
      );
    }

    const apiUrl = useMiniMax
      ? `${MINIMAX_BASE_URL}/chat/completions`
      : "https://openrouter.ai/api/v1/chat/completions";
    const apiKey = useMiniMax ? MINIMAX_API_KEY! : OPENROUTER_API_KEY!;
    const model = useMiniMax ? MINIMAX_MODEL : OPENROUTER_MODEL;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    if (!useMiniMax) {
      headers["HTTP-Referer"] = "https://www.bonanza-labs.com";
      headers["X-Title"] = "BonanzaLabs Chat Agent";
    }

    const upstream = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream,
        max_tokens: 1000,
        temperature: 0.4,
      }),
    });

    if (!upstream.ok) {
      const errorText = await upstream.text();
      console.error("Chat upstream error:", upstream.status, errorText);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    if (stream) {
      if (!upstream.body) {
        return NextResponse.json({ error: "Empty AI response" }, { status: 502 });
      }

      return new Response(upstream.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const data = await upstream.json();
    const content = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({
      id: data.id,
      object: "chat.completion",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content },
          finish_reason: data.choices?.[0]?.finish_reason || "stop",
        },
      ],
      model,
    });
  } catch (error) {
    console.error("Agent chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "BonanzaLabs Chat Agent",
    provider: useMiniMax ? "minimax" : useOpenRouter ? "openrouter" : "none",
    model: useMiniMax ? MINIMAX_MODEL : OPENROUTER_MODEL,
    configured: Boolean(MINIMAX_API_KEY || OPENROUTER_API_KEY),
    distributedRateLimit: isRedisConfigured,
  });
}
