import Link from "next/link";
import { isRedisConfigured, redisCommand, storageKey } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

interface StreamEntry {
  id?: string;
  name?: string;
  label?: string;
  path?: string;
  source?: string;
  campaign?: string;
  timestamp?: string;
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(value));
}

const EVENT_LABELS: Record<string, string> = {
  page_view: "Pagina bekeken",
  cta_click: "Knop geklikt",
  checkout_start: "Checkout gestart",
  checkout_error: "Checkout mislukt",
  lead_submit: "Aanvraag verstuurd",
  quickscan_start: "Quickscan gestart",
  video_play: "Video afgespeeld",
};

// HGETALL levert een afwisselend array: [veld, waarde, veld, waarde, ...].
// Deze helper maakt er een object van.
function hgetallToObject(flat?: string[] | null): Record<string, string> {
  const result: Record<string, string> = {};
  if (!Array.isArray(flat)) return result;
  for (let index = 0; index + 1 < flat.length; index += 2) {
    result[String(flat[index])] = String(flat[index + 1]);
  }
  return result;
}

export default async function AdminAnalyticsPage() {
  const configured = isRedisConfigured;

  const rawCounters = configured
    ? hgetallToObject(
        await redisCommand<string[]>("HGETALL", storageKey("analytics:counters")),
      )
    : {};

  const totals: Record<string, number> = {};
  const labels: Record<string, number> = {};
  const pages: Record<string, number> = {};

  for (const [key, value] of Object.entries(rawCounters)) {
    const count = Number(value) || 0;
    if (key.startsWith("page:")) pages[key.slice(5)] = count;
    else if (key.includes(":")) labels[key] = count;
    else totals[key] = count;
  }

  const rawStream = configured
    ? (await redisCommand<string[]>("LRANGE", storageKey("analytics:stream"), 0, 99)) || []
    : [];
  const stream = rawStream.flatMap((entry) => {
    try {
      return [JSON.parse(entry) as StreamEntry];
    } catch {
      return [];
    }
  });

  const viewCount = totals.page_view || 0;
  const leadCount = totals.lead_submit || 0;
  const checkoutCount = totals.checkout_start || 0;

  const sortedPages = Object.entries(pages).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const sortedLabels = Object.entries(labels).sort((a, b) => b[1] - a[1]).slice(0, 15);

  return (
    <main className="min-h-screen bg-[#070A12] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              BonanzaLabs Admin
            </p>
            <h1 className="mt-3 text-4xl font-black">Analytics</h1>
            <p className="mt-3 text-slate-400">
              Eerste-partijmeting: geen cookies, geen derde partij, geen persoonsgegevens.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/leads"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:border-cyan-300/40"
            >
              Leads
            </Link>
            <Link
              href="/admin/betalingen"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:border-cyan-300/40"
            >
              Betalingen
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold hover:bg-[#1D4ED8]"
            >
              Naar website
            </Link>
          </div>
        </header>

        {!configured ? (
          <section className="mt-10 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6 text-amber-100">
            Upstash Redis is niet geconfigureerd. Voeg de Redis environment variables toe in Vercel.
          </section>
        ) : (
          <>
            <section className="mt-10 grid gap-5 md:grid-cols-4">
              {[
                { label: "Paginaweergaven", value: viewCount },
                { label: "Knoppen geklikt", value: totals.cta_click || 0 },
                { label: "Checkout gestart", value: checkoutCount },
                { label: "Aanvragen", value: leadCount },
              ].map((card) => (
                <article key={card.label} className="rounded-2xl border border-white/10 bg-[#0D1220] p-6">
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className="mt-2 text-4xl font-black">{card.value}</p>
                </article>
              ))}
            </section>

            <section className="mt-10 grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-[#0D1220] p-6">
                <h2 className="text-xl font-bold">Populairste pagina&apos;s</h2>
                {sortedPages.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">Nog geen data.</p>
                ) : (
                  <ul className="mt-4 space-y-2 text-sm">
                    {sortedPages.map(([path, count]) => (
                      <li key={path} className="flex items-center justify-between gap-4">
                        <span className="truncate text-slate-300">{path}</span>
                        <span className="font-semibold tabular-nums">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>

              <article className="rounded-2xl border border-white/10 bg-[#0D1220] p-6">
                <h2 className="text-xl font-bold">Knoppen en acties</h2>
                {sortedLabels.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">Nog geen data.</p>
                ) : (
                  <ul className="mt-4 space-y-2 text-sm">
                    {sortedLabels.map(([key, count]) => (
                      <li key={key} className="flex items-center justify-between gap-4">
                        <span className="truncate text-slate-300">{key.split(":").slice(1).join(":")}</span>
                        <span className="font-semibold tabular-nums">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-bold">Laatste gebeurtenissen</h2>
              {stream.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">Nog geen gebeurtenissen vastgelegd.</p>
              ) : (
                <ul className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#0D1220]">
                  {stream.map((entry, index) => (
                    <li key={entry.id || index} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                      <span className="font-semibold text-cyan-200">
                        {EVENT_LABELS[entry.name || ""] || entry.name}
                      </span>
                      <span className="text-slate-400">{entry.label || entry.path || "—"}</span>
                      <time className="text-xs text-slate-500">{formatDate(entry.timestamp)}</time>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
