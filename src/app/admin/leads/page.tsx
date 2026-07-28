import Link from "next/link";
import {
  isRedisConfigured,
  readJsonRecordsFromRecentList,
} from "@/lib/server-store";

interface LeadRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  source: "contact-form" | "chat-widget" | "unknown";
  page: string;
  ip: string;
  userAgent: string;
  createdAt: string;
}

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(value));
}

export default async function AdminLeadsPage() {
  const leads = isRedisConfigured
    ? await readJsonRecordsFromRecentList<LeadRecord>({
        recentList: "leads:recent",
        keyPrefix: "lead:",
        limit: 200,
      })
    : [];

  return (
    <main className="min-h-screen bg-[#070A12] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              BonanzaLabs Admin
            </p>
            <h1 className="mt-3 text-4xl font-black">Binnengekomen leads</h1>
            <p className="mt-3 text-slate-400">
              Contactformulier- en chatleads, nieuwste eerst.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/admin/leads?limit=200"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:border-cyan-300/40"
            >
              JSON export
            </a>
            <Link
              href="/"
              className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold hover:bg-[#1D4ED8]"
            >
              Naar website
            </Link>
          </div>
        </header>

        {!isRedisConfigured ? (
          <section className="mt-10 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6 text-amber-100">
            Upstash Redis is niet geconfigureerd. Voeg de Redis environment variables toe in Vercel.
          </section>
        ) : leads.length === 0 ? (
          <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-slate-400">
            Er zijn nog geen leads opgeslagen.
          </section>
        ) : (
          <section className="mt-10 grid gap-5">
            {leads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-2xl border border-white/10 bg-[#0D1220] p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold">{lead.name}</h2>
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                        {lead.source === "chat-widget" ? "Chat" : "Contactformulier"}
                      </span>
                    </div>
                    <a
                      href={`mailto:${lead.email}`}
                      className="mt-2 inline-block text-cyan-300 hover:underline"
                    >
                      {lead.email}
                    </a>
                  </div>
                  <time className="text-sm text-slate-500" dateTime={lead.createdAt}>
                    {formatDate(lead.createdAt)}
                  </time>
                </div>

                <div className="mt-5 whitespace-pre-wrap rounded-xl bg-black/20 p-4 text-sm leading-relaxed text-slate-300">
                  {lead.message || "Geen bericht ingevuld via de chatwidget."}
                </div>

                <dl className="mt-5 grid gap-3 text-xs text-slate-500 md:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-slate-400">Bronpagina</dt>
                    <dd className="mt-1 break-all">{lead.page || "Onbekend"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-400">Lead-ID</dt>
                    <dd className="mt-1 break-all">{lead.id}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
