import { NextRequest, NextResponse } from "next/server";
import {
  incrementRateLimit,
  isRedisConfigured,
  storeJsonRecord,
} from "@/lib/server-store";

interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  source: "contact-form" | "chat-widget" | "unknown";
  page: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  // Uitkomst van de notificatiemail, direct na de verzendpoging bijgewerkt.
  // Zonder deze velden is een geweigerde verzending spoorloos: Resend maakt
  // bij een afwijzing geen mailrecord aan, dus de controle op last_event in
  // de waakhond ziet hem nooit. Zie src/app/api/cron/mail-watch/route.ts.
  notified: boolean;
  notificationId: string | null;
  notificationError: string | null;
  notifiedAt: string | null;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "";
const LEAD_NOTIFICATION_EMAIL =
  process.env.LEAD_NOTIFICATION_EMAIL || "info@bonanza-labs.com";

// Twee jaar. Ook gebruikt bij het bijwerken van het record na de verzendpoging,
// zodat de bewaartermijn niet stilletjes verandert.
const LEAD_TTL_SECONDS = 60 * 60 * 24 * 730;

function clean(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

interface NotificationOutcome {
  ok: boolean;
  emailId: string | null;
  error: string | null;
}

async function sendLeadNotification(lead: Lead): Promise<NotificationOutcome> {
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    return {
      ok: false,
      emailId: null,
      error: "Resend is niet geconfigureerd: RESEND_API_KEY of RESEND_FROM_EMAIL ontbreekt.",
    };
  }

  try {
    return await postToResend(lead);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Onbekende fout bij het versturen";
    console.error("Resend notification error:", message);
    return { ok: false, emailId: null, error: message };
  }
}

async function postToResend(lead: Lead): Promise<NotificationOutcome> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "BonanzaLabs/1.0",
      "Idempotency-Key": lead.id,
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [LEAD_NOTIFICATION_EMAIL],
      reply_to: lead.email,
      subject: `Nieuwe BonanzaLabs lead — ${lead.name}`,
      html: `
        <h2>Nieuwe lead via ${escapeHtml(lead.source)}</h2>
        <p><strong>Naam:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(lead.email)}</p>
        <p><strong>Pagina:</strong> ${escapeHtml(lead.page || "onbekend")}</p>
        <p><strong>Bericht:</strong></p>
        <p>${escapeHtml(lead.message || "Geen bericht ingevuld").replace(/\n/g, "<br />")}</p>
      `,
      text: [
        `Nieuwe lead via ${lead.source}`,
        `Naam: ${lead.name}`,
        `E-mail: ${lead.email}`,
        `Pagina: ${lead.page || "onbekend"}`,
        `Bericht: ${lead.message || "Geen bericht ingevuld"}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    console.error("Resend notification failed:", detail);
    return {
      ok: false,
      emailId: null,
      error: `Resend gaf status ${response.status}: ${detail}`,
    };
  }

  const payload = (await response.json().catch(() => null)) as { id?: string } | null;
  return { ok: true, emailId: payload?.id ?? null, error: null };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (clean(body.company, 200) || clean(body.website, 200)) {
      return NextResponse.json({ success: true });
    }

    const name = clean(body.name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const message = clean(body.message, 5000);
    const page = clean(body.page, 500);
    const source =
      body.source === "contact-form" || body.source === "chat-widget"
        ? body.source
        : "unknown";

    if (name.length < 2) {
      return NextResponse.json({ error: "Naam is vereist" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Geldig e-mailadres vereist" },
        { status: 400 },
      );
    }

    if (source === "contact-form" && message.length < 10) {
      return NextResponse.json(
        { error: "Bericht moet minimaal 10 tekens bevatten" },
        { status: 400 },
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for") || "unknown";
    const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
    const rateCount = await incrementRateLimit(`rate:leads:${ip}`, 10 * 60);
    if (rateCount > 5) {
      return NextResponse.json(
        { error: "Te veel verzoeken. Probeer het later opnieuw." },
        { status: 429 },
      );
    }

    const lead: Lead = {
      id: `lead_${crypto.randomUUID()}`,
      name,
      email,
      message,
      source,
      page,
      ip,
      userAgent: clean(req.headers.get("user-agent"), 500),
      createdAt: new Date().toISOString(),
      notified: false,
      notificationId: null,
      notificationError: null,
      notifiedAt: null,
    };

    const persisted = await storeJsonRecord({
      key: `lead:${lead.id}`,
      value: lead,
      ttlSeconds: LEAD_TTL_SECONDS,
      recentList: "leads:recent",
      recentValue: lead.id,
      recentLimit: 2000,
    });

    if (!persisted) {
      console.error("Lead storage is not configured", lead);
      return NextResponse.json(
        { error: "Leadopslag is nog niet geconfigureerd" },
        { status: 503 },
      );
    }

    const outcome = await sendLeadNotification(lead);

    // De uitkomst op het record bijwerken. Bewust zonder recentList: dat zou
    // hetzelfde id een tweede keer in de lijst zetten. Mislukt deze
    // boekhouding, dan mag dat een geslaagde lead niet tot een fout maken —
    // de bezoeker heeft zijn aanvraag immers al zien slagen.
    try {
      await storeJsonRecord({
        key: `lead:${lead.id}`,
        value: {
          ...lead,
          notified: outcome.ok,
          notificationId: outcome.emailId,
          notificationError: outcome.error,
          notifiedAt: new Date().toISOString(),
        },
        ttlSeconds: LEAD_TTL_SECONDS,
      });
    } catch (error) {
      console.error("Kon notificatiestatus niet bijwerken", lead.id, error);
    }

    if (!outcome.ok) {
      console.error("Lead notification failed", { id: lead.id, error: outcome.error });
    } else {
      console.log("Lead stored", {
        id: lead.id,
        source: lead.source,
        resendId: outcome.emailId,
      });
    }

    // De foutmelding blijft intern: dit endpoint is publiek en een
    // infrastructuurmelding van de verzendpartij hoort daar niet.
    return NextResponse.json({
      success: true,
      id: lead.id,
      notified: outcome.ok,
    });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ error: "Interne fout" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "BonanzaLabs Leads",
    storageConfigured: isRedisConfigured,
    emailConfigured: Boolean(RESEND_API_KEY && RESEND_FROM_EMAIL),
  });
}
