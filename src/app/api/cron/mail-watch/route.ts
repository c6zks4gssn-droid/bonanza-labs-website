import { NextRequest, NextResponse } from "next/server";

// Waakhond op de mailbezorging.
//
// Waarom: de leadnotificatie gaf "notified: true" terug terwijl de mail werd
// gebounced en daarna onderdrukt. Succes in de code betekent alleen dat de
// verzendpartij het verzoek heeft aangenomen. Deze controle kijkt naar wat er
// daarna gebeurde en waarschuwt als een melding niet is bezorgd.
//
// De melding bevat géén klantgegevens: alleen tijdstip, status en het interne
// nummer van de verzending. Geen namen, geen onderwerpen, geen adressen.
//
// Vereiste variabelen (Production):
//   RESEND_API_KEY, CRON_SECRET, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
// Vercel stuurt bij een cron-aanroep "Authorization: Bearer $CRON_SECRET" mee.
// Zonder CRON_SECRET weigert deze route alles.

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const CRON_SECRET = process.env.CRON_SECRET || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

const LOOKBACK_HOURS = 26;
const FAILED_EVENTS = ["bounced", "suppressed", "failed", "complained"];

interface ResendEmail {
  id?: string;
  last_event?: string;
  created_at?: string;
}

function createdAtMs(value: string | undefined): number {
  if (!value) return NaN;
  const iso = value.replace(" ", "T").replace(/\+00$/, "+00:00");
  return Date.parse(iso);
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Niet toegestaan" }, { status: 401 });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { ok: false, reden: "Geen Resend-sleutel geconfigureerd" },
      { status: 503 },
    );
  }

  let emails: ResendEmail[] = [];
  try {
    const response = await fetch("https://api.resend.com/emails?limit=100", {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, reden: `Verzendpartij gaf status ${response.status}` },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as { data?: ResendEmail[] };
    emails = payload.data || [];
  } catch {
    return NextResponse.json(
      { ok: false, reden: "Verzendpartij niet bereikbaar" },
      { status: 502 },
    );
  }

  const since = Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000;
  const failed = emails.filter((email) => {
    const event = (email.last_event || "").toLowerCase();
    if (!FAILED_EVENTS.includes(event)) return false;
    const created = createdAtMs(email.created_at);
    return Number.isNaN(created) ? true : created >= since;
  });

  if (failed.length === 0) {
    return NextResponse.json({ ok: true, nietBezorgd: 0 });
  }

  const regels = failed
    .slice(0, 10)
    .map((email) => `• ${email.created_at || "tijdstip onbekend"} — ${email.last_event} — ${email.id || "geen nummer"}`);

  const tekst = [
    `BonanzaLabs: ${failed.length} verzending(en) niet bezorgd in de laatste ${LOOKBACK_HOURS} uur.`,
    ...regels,
    "",
    "Dit gaat over de notificatiemail. De aanvraag zelf kan wel opgeslagen zijn; controleer de leadopslag.",
  ].join("\n");

  let gemeld = false;
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: tekst,
            disable_web_page_preview: true,
          }),
        },
      );
      gemeld = response.ok;
    } catch {
      gemeld = false;
    }
  }

  return NextResponse.json({ ok: true, nietBezorgd: failed.length, gemeld });
}
