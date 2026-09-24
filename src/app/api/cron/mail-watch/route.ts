import { NextRequest, NextResponse } from "next/server";
import { readJsonRecordsFromRecentList } from "@/lib/server-store";

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

// Tweede, onafhankelijke detectiebron.
//
// Waarom nodig: de controle hierboven kijkt naar mails die de verzendpartij
// heeft aangenomen en daarna niet aankwamen. Wordt een verzending bij het
// versturen geweigerd — bijvoorbeeld omdat het afzenderdomein niet geverifieerd
// is — dan bestaat er geen mailrecord, vindt de controle op last_event nul
// fouten, en meldt deze route voor altijd dat alles in orde is.
//
// Het leadrecord houdt daarom zelf bij of de melding gelukt is. Dat dekt precies
// het pad dat hierboven onzichtbaar blijft.
interface LeadRecord {
  id: string;
  createdAt: string;
  notified?: boolean;
  notificationError?: string | null;
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

  let mislukteLeads: LeadRecord[] = [];
  let leadControle = "ok";
  try {
    const leads = await readJsonRecordsFromRecentList<LeadRecord>({
      recentList: "leads:recent",
      keyPrefix: "lead:",
      limit: 200,
    });
    mislukteLeads = leads.filter((lead) => {
      // Alleen een expliciete false telt. Oudere records zonder dit veld
      // blijven buiten beeld, zodat het verleden geen valse melding geeft.
      if (lead.notified !== false) return false;
      const created = Date.parse(lead.createdAt);
      return Number.isNaN(created) ? true : created >= since;
    });
  } catch {
    // Een mislukte leesactie mag niet als "niets aan de hand" doorgaan.
    leadControle = "mislukt";
  }

  const telegramGeconfigureerd = Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

  if (failed.length === 0 && mislukteLeads.length === 0 && leadControle === "ok") {
    return NextResponse.json({
      ok: true,
      nietBezorgd: 0,
      meldingMislukt: 0,
      telegramGeconfigureerd,
    });
  }

  // Geen klantgegevens in de melding: alleen tijdstip, status, intern nummer
  // en de foutmelding van de verzendpartij.
  const blokken: string[] = [];
  if (failed.length > 0) {
    blokken.push(
      [
        `${failed.length} verzending(en) niet bezorgd:`,
        ...failed
          .slice(0, 10)
          .map(
            (email) =>
              `• ${email.created_at || "tijdstip onbekend"} — ${email.last_event} — ${email.id || "geen nummer"}`,
          ),
      ].join("\n"),
    );
  }
  if (mislukteLeads.length > 0) {
    blokken.push(
      [
        `${mislukteLeads.length} lead(s) waarvan de notificatiemail niet verzonden is:`,
        ...mislukteLeads
          .slice(0, 10)
          .map(
            (lead) =>
              `• ${lead.createdAt || "tijdstip onbekend"} — ${lead.id} — ${(lead.notificationError || "onbekende fout").slice(0, 120)}`,
          ),
      ].join("\n"),
    );
  }
  if (leadControle === "mislukt") {
    blokken.push(
      "Let op: de leadopslag was niet leesbaar, dus onverzonden meldingen zijn nu niet gecontroleerd.",
    );
  }

  const tekst = [
    `BonanzaLabs: ${LOOKBACK_HOURS} uur aan meldingen die aandacht vragen.`,
    "",
    ...blokken,
    "",
    "Dit gaat over de notificatiemail. De aanvraag zelf kan wel opgeslagen zijn; controleer de leadopslag in /admin/leads.",
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

  return NextResponse.json({
    ok: true,
    nietBezorgd: failed.length,
    meldingMislukt: mislukteLeads.length,
    leadControle,
    gemeld,
    telegramGeconfigureerd,
  });
}
