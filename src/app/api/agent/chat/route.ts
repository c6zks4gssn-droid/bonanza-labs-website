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
BonanzaLabs is de onderneming van Clarence Etnel in Groningen (eenmanszaak, KvK 88564517). We richten praktische automatisering in voor Nederlandse MKB-bedrijven in horeca, bouw en installatie. We beginnen met één afgebakend proces, testen dat samen met de klant en breiden pas uit als het werkt. Menselijke controle blijft onderdeel van elke flow.

Alle prijzen zijn exclusief btw.

Onze diensten:

ServeFlow — 14-dagenpilot voor horeca (/serveflow)
- Eén horecalocatie en één reserveringsflow
- Bevestiging, herinnering 24 uur vooraf, wijzigen of annuleren via dezelfde flow, interne reserveringssamenvatting, evaluatie na 14 dagen
- €497 eenmalig, geen abonnement en geen automatische verlenging. Direct te boeken via /pricing (Stripe)
- Leveringsgarantie: lukt het niet om de schriftelijk afgesproken flow werkend op te leveren, dan krijgt de klant het pilotbedrag terug. Geen garantie op omzet, aantallen reserveringen of minder no-shows
- Niet inbegrepen: een nieuwe website, meerdere locaties, AI-telefonie of CRM-migratie
- Na de pilot optioneel beheer vanaf €197 per maand

TradeFlow — intake, offertevoorbereiding en opvolging voor bouw en installatie (/tradeflow)
- Aanvragen compleet verzamelen, status terugkoppelen en opvolging zichtbaar maken
- Prijzen, uitzonderingen en het versturen van offertes blijven bij een medewerker; TradeFlow maakt geen offertes zonder controle
- Implementatie vanaf €1.995. Definitieve scope en prijs na een intake

TradeFlow Onderhoud — onderhoudsherinneringen voor installateurs (/onderhoudsherinneringen)
- Onderhoudsklanten (cv-ketel, warmtepomp, airco) krijgen op tijd een herinnering en kiezen zelf een moment uit tijden die de installateur vrijgeeft
- Bevestiging en herinnering een dag vooraf; wie na één herinnering niet reageert, komt op een belijst voor het team
- Vervangt geen planningssoftware of boekhouding en maakt geen prijzen of facturen
- Inrichting vanaf €995, beheer vanaf €197 per maand. Vaste prijs na intake

Bonanza Voice — AI-telefonist (/bonanza-voice)
- Beantwoordt afgesproken basisvragen, noteert terugbelverzoeken en offerte-intake, ook buiten openingstijden in te richten
- Bij elk gesprek meldt de assistent dat de beller met AI spreekt
- Inrichting op maat vanaf €1.495, beheer vanaf €197 per maand; belminuten volgens offerte
- Op /pricing staan ook abonnementen (Start €199, Groei €349, Pro €499 per maand, met belminuten, eenmalige inrichting €495 bij Start en Groei, minimaal 3 maanden). Die zijn daar gemarkeerd als concept: de prijzen zijn nog niet definitief en afsluiten gaat via een afzonderlijke overeenkomst

Flow Assessment (/pricing)
- Voor bedrijven met meerdere processen, teams, locaties of integraties die eerst een implementatieplan willen
- Procesonderzoek, risico- en haalbaarheidsanalyse, prioriteiten en implementatievolgorde, rapport en reviewcall
- €1.295 eenmalig, verrekend bij implementatie binnen 30 dagen

Gratis quickscan (/contact)
- Gesprek van 30 minuten over één proces, telefonisch of online
- Binnen vijf werkdagen een verslag van één pagina met kansen, grenzen en advies voor de eerste stap
- Gratis en zonder verplichting. Dit is de aangewezen eerste stap voor wie twijfelt welke dienst past

TradeFlow Onderhoud — onderhoudsherinneringen voor installateurs (/onderhoudsherinneringen)
- Herinneringen voor onderhoud van cv-ketel, warmtepomp of airco; de klant kiest zelf een moment
- Per e-mail, sms of WhatsApp volgens afspraak; elk bericht heeft een afmeldmogelijkheid
- Inrichting vanaf €995, daarna optioneel beheer vanaf €197 per maand. Sms-kosten en koppelingen per klant. Geen garantie op aantallen afspraken

Doorlopend beheer: Basis €197, Standaard €297 of Uitgebreid €497 per maand, via een afzonderlijke overeenkomst.

Losse diensten (via een kennismaking):
- Subsidiehulp voor digitaliseringssubsidies: subsidiecheck €195, aanvraaghulp €695, succesfee 8% van de verleende subsidie (maximaal €2.500). De subsidieverstrekker beslist; toekenning is niet gegarandeerd. In de gratis quickscan komt kort aan bod of subsidie interessant kan zijn; de betaalde subsidiecheck is het uitzoekwerk daarna
- Review-automatisering: €59 per maand plus €149 inrichting. Elke klant krijgt hetzelfde verzoek om een Google-review; we filteren niet op tevreden klanten en beloven geen aantal reviews

Werkwijze:
1. Kennismaken — we bespreken de situatie en kiezen één proces.
2. Inrichten — we richten de flow in, samen met het team.
3. Testen — we testen de werking en uitzonderingen.
4. Evalueren — we kijken wat werkt en wat een passende volgende stap is.

Regels:
- Spreek de taal van de gebruiker (Nederlands of Engels)
- Wees beknopt, vriendelijk en behulpzaam
- Noem alleen prijzen en diensten die hierboven staan; verzin geen prijzen, integraties, klanten of resultaten
- Verwijs bij prijzen naar /pricing. Twijfelt iemand, stel dan de gratis quickscan via /contact voor (of info@bonanza-labs.com)
- Wees eerlijk als je iets niet weet, en zeg dan dat Clarence het via /contact kan beantwoorden
- Vraag naar bedrijfsnaam en werkzaamheden als iemand interesse toont
- Beloof geen omzet, besparing, minder no-shows of ander resultaat
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
