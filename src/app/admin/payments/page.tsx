import Link from "next/link";
import { isRedisConfigured, readJsonRecordsFromRecentList } from "@/lib/server-store";
import type {
  PaymentFailureRecord,
  PaymentRecord,
} from "@/app/api/admin/payments/route";

// Interne pagina. design.md zet de privé-administratie bewust buiten de lichte
// website-migratie, daarom dezelfde donkere opzet en tokens als /admin/leads.

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Betalingen",
  robots: { index: false, follow: false },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(value));
}

function formatAmount(cents: number | null | undefined, currency: string | null) {
  if (typeof cents !== "number") return "—";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: (currency || "eur").toUpperCase(),
  }).format(cents / 100);
}

function statusLabel(status: string | null) {
  switch (status) {
    case "paid":
      return "Betaald";
    case "unpaid":
      return "Niet betaald";
    case "no_payment_required":
      return "Geen betaling nodig";
    default:
      return status || "Onbekend";
  }
}

function statusClasses(status: string | null) {
  const base = "rounded-full border px-3 py-1 text-xs font-semibold";
  if (status === "paid") {
    return `${base} border-emerald-300/20 bg-emerald-300/10 text-emerald-200`;
  }
  if (status === "unpaid") {
    return `${base} border-amber-300/20 bg-amber-300/10 text-amber-200`;
  }
  return `${base} border-white/15 bg-white/5 text-slate-300`;
}

export default async function AdminPaymentsPage() {
  const [payments, failures] = isRedisConfigured
    ? await Promise.all([
        readJsonRecordsFromRecentList<PaymentRecord>({
          recentList: "stripe:payments:recent",
          keyPrefix: "stripe:payment:",
          limit: 200,
        }),
        readJsonRecordsFromRecentList<PaymentFailureRecord>({
          recentList: "stripe:payment-failures:recent",
          keyPrefix: "stripe:payment-failure:",
          limit: 200,
        }),
      ])
    : [[], []];

  const paid = payments.filter((payment) => payment.paymentStatus === "paid");
  const received = paid.reduce((sum, payment) => sum + (payment.total || 0), 0);

  return (
    <main className="min-h-screen bg-[#070A12] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              BonanzaLabs Admin
            </p>
            <h1 className="mt-3 text-4xl font-black">Betalingen</h1>
            <p className="mt-3 text-slate-400">
              Afgeronde betalingen en mislukte betalingen, nieuwste eerst.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/api/admin/payments?limit=200"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:border-cyan-300/40"
            >
              JSON export
            </a>
            <Link
              href="/admin/leads"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:border-cyan-300/40"
            >
              Leads
            </Link>
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
        ) : (
          <>
            <section className="mt-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#0D1220] p-6">
                <p className="text-sm font-semibold text-slate-400">Ontvangen</p>
                <p className="mt-2 text-3xl font-black">{formatAmount(received, "eur")}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Totaal van {paid.length} betaalde {paid.length === 1 ? "opdracht" : "opdrachten"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0D1220] p-6">
                <p className="text-sm font-semibold text-slate-400">Betaald</p>
                <p className="mt-2 text-3xl font-black">{paid.length}</p>
                <p className="mt-1 text-xs text-slate-500">van {payments.length} geregistreerd</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0D1220] p-6">
                <p className="text-sm font-semibold text-slate-400">Mislukt</p>
                <p className="mt-2 text-3xl font-black">{failures.length}</p>
                <p className="mt-1 text-xs text-slate-500">vragen om opvolging</p>
              </div>
            </section>

            {failures.length > 0 ? (
              <section className="mt-10 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6 text-rose-100">
                <h2 className="text-lg font-bold">
                  {failures.length} mislukte {failures.length === 1 ? "betaling" : "betalingen"}
                </h2>
                <ul className="mt-4 grid gap-2 text-sm">
                  {failures.map((failure) => (
                    <li key={failure.sessionId} className="break-all">
                      {formatDate(failure.createdAt)} — {failure.customerEmail || "geen e-mailadres"} —{" "}
                      {statusLabel(failure.paymentStatus)} — {failure.eventType} —{" "}
                      {failure.sessionId}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {payments.length === 0 ? (
              <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-slate-400">
                Er zijn nog geen betalingen opgeslagen.
              </section>
            ) : (
              <section className="mt-10 grid gap-5">
                {payments.map((payment) => (
                  <article
                    key={payment.sessionId}
                    className="rounded-2xl border border-white/10 bg-[#0D1220] p-6"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-bold">{payment.productName}</h2>
                          <span className={statusClasses(payment.paymentStatus)}>
                            {statusLabel(payment.paymentStatus)}
                          </span>
                        </div>
                        {payment.customerEmail ? (
                          <a
                            href={`mailto:${payment.customerEmail}`}
                            className="mt-2 inline-block text-cyan-300 hover:underline"
                          >
                            {payment.customerName
                              ? `${payment.customerName} — ${payment.customerEmail}`
                              : payment.customerEmail}
                          </a>
                        ) : (
                          <p className="mt-2 text-slate-500">Geen klantgegevens ontvangen</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black">
                          {formatAmount(payment.total, payment.currency)}
                        </p>
                        <time
                          className="text-sm text-slate-500"
                          dateTime={payment.createdAt}
                        >
                          {formatDate(payment.createdAt)}
                        </time>
                      </div>
                    </div>

                    <dl className="mt-5 grid gap-3 text-xs text-slate-500 md:grid-cols-3">
                      <div>
                        <dt className="font-semibold text-slate-400">Excl. btw</dt>
                        <dd className="mt-1">
                          {formatAmount(payment.subtotal, payment.currency)}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-400">Btw</dt>
                        <dd className="mt-1">{formatAmount(payment.tax, payment.currency)}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-400">Soort</dt>
                        <dd className="mt-1">
                          {payment.offerType}
                          {payment.durationDays ? ` · ${payment.durationDays} dagen` : ""}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-400">Product-id</dt>
                        <dd className="mt-1 break-all">{payment.productId}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-400">Sessie</dt>
                        <dd className="mt-1 break-all">{payment.sessionId}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-400">Gebeurtenis</dt>
                        <dd className="mt-1 break-all">{payment.eventType}</dd>
                      </div>
                    </dl>

                    {payment.invoiceId ? (
                      <p className="mt-4 text-xs text-slate-500">
                        Factuur: <span className="break-all">{payment.invoiceId}</span>
                      </p>
                    ) : null}
                  </article>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
