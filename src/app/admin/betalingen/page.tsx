import type {
  BetaalRecord,
  MislukteBetalingRecord,
  FactuurRecord,
  AbonnementRecord,
} from "@/lib/stripe-records";
import { formatteerBedrag, formatteerDatum } from "@/lib/stripe-records";
import {
  isRedisConfigured,
  readJsonRecordsFromRecentList,
} from "@/lib/server-store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Betalingen",
  robots: { index: false, follow: false },
};

function statusBadge(status?: string | null) {
  const normalizedStatus = status?.trim().toLowerCase();
  const isFavorable =
    normalizedStatus === "paid" ||
    normalizedStatus === "active" ||
    normalizedStatus === "succeeded";
  const isUnfavorable =
    normalizedStatus === "failed" ||
    normalizedStatus === "canceled" ||
    normalizedStatus === "past_due" ||
    normalizedStatus === "unpaid" ||
    normalizedStatus === "deleted";

  const statusClass = isFavorable
    ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
    : isUnfavorable
      ? "border-rose-300/20 bg-rose-300/10 text-rose-200"
      : "border-white/15 bg-white/5 text-slate-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}
    >
      {status?.trim() || "onbekend"}
    </span>
  );
}

export default async function BetalingenPage() {
  const payments: BetaalRecord[] = isRedisConfigured
    ? await readJsonRecordsFromRecentList<BetaalRecord>({
        recentList: "stripe:payments:recent",
        keyPrefix: "stripe:payment:",
        limit: 100,
      })
    : [];
  const failedPayments: MislukteBetalingRecord[] = isRedisConfigured
    ? await readJsonRecordsFromRecentList<MislukteBetalingRecord>({
        recentList: "stripe:payment-failures:recent",
        keyPrefix: "stripe:payment-failure:",
        limit: 100,
      })
    : [];
  const invoices: FactuurRecord[] = isRedisConfigured
    ? await readJsonRecordsFromRecentList<FactuurRecord>({
        recentList: "stripe:invoices:recent",
        keyPrefix: "stripe:invoice:",
        limit: 100,
      })
    : [];
  const subscriptions: AbonnementRecord[] = isRedisConfigured
    ? await readJsonRecordsFromRecentList<AbonnementRecord>({
        recentList: "stripe:subscriptions:recent",
        keyPrefix: "stripe:subscription:",
        limit: 100,
      })
    : [];

  return (
    <main className="min-h-screen bg-[#070A12] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-white/10 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                BonanzaLabs Admin
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Betalingen
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Betaalde sessies, mislukte betalingen, facturen en abonnementen,
                nieuwste eerst.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/api/admin/payments?limit=200"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/5"
              >
                JSON export
              </a>
              <a
                href="/admin/leads"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/5"
              >
                Leads
              </a>
              <a
                href="/"
                className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                Naar website
              </a>
            </div>
          </div>
        </header>

        {!isRedisConfigured ? (
          <div className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6 text-amber-100">
            Upstash Redis is niet geconfigureerd. Voeg de Redis environment
            variables toe in Vercel.
          </div>
        ) : (
          <>
            <section className="mt-10">
              <h2 className="text-xl font-semibold">
                Betalingen{" "}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  {payments.length}
                </span>
              </h2>
              <div className="mt-4 grid gap-5">
                {payments.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-[#0D1220] p-10 text-center text-slate-400">
                    Nog geen betalingen.
                  </div>
                ) : (
                  payments.map((payment, index) => (
                    <article
                      key={payment.sessionId ?? `payment-${index}`}
                      className="rounded-2xl border border-white/10 bg-[#0D1220] p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-semibold">
                          {payment.productName || payment.productId || "Onbekend product"}
                        </p>
                        {statusBadge(payment.paymentStatus)}
                      </div>
                      <p className="mt-4 text-2xl font-bold">
                        {formatteerBedrag(payment.total, payment.currency)}
                      </p>
                      <p className="mt-3 text-sm text-slate-400">
                        Klant: {payment.customerName || "Onbekende klant"}
                      </p>
                      <p className="mt-1 text-sm">
                        {payment.customerEmail ? (
                          <a
                            href={`mailto:${payment.customerEmail}`}
                            className="text-cyan-300 hover:underline"
                          >
                            {payment.customerEmail}
                          </a>
                        ) : (
                          <span className="text-slate-500">Geen e-mailadres</span>
                        )}
                      </p>
                      <p className="mt-3 break-all text-xs text-slate-500">
                        {payment.sessionId || "Geen sessie-ID"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Verwerkt op {formatteerDatum(payment.processedAt)}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold">
                Mislukte betalingen{" "}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  {failedPayments.length}
                </span>
              </h2>
              <div className="mt-4 grid gap-5">
                {failedPayments.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-[#0D1220] p-10 text-center text-slate-400">
                    Geen mislukte betalingen.
                  </div>
                ) : (
                  failedPayments.map((payment, index) => (
                    <article
                      key={payment.sessionId ?? `failure-${index}`}
                      className="rounded-2xl border border-white/10 bg-[#0D1220] p-6"
                    >
                      <p className="break-all text-xs text-slate-500">
                        {payment.sessionId || "Geen sessie-ID"}
                      </p>
                      <p className="mt-3 text-sm">
                        {payment.customerEmail ? (
                          <a
                            href={`mailto:${payment.customerEmail}`}
                            className="text-cyan-300 hover:underline"
                          >
                            {payment.customerEmail}
                          </a>
                        ) : (
                          <span className="text-slate-500">Geen e-mailadres</span>
                        )}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        {statusBadge(payment.paymentStatus)}
                        <span className="text-xs text-slate-400">
                          Aangemaakt op {formatteerDatum(payment.createdAt)}
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold">
                Facturen{" "}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  {invoices.length}
                </span>
              </h2>
              <div className="mt-4 grid gap-5">
                {invoices.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-[#0D1220] p-10 text-center text-slate-400">
                    Nog geen facturen.
                  </div>
                ) : (
                  invoices.map((invoice, index) => (
                    <article
                      key={invoice.invoiceId ?? `invoice-${index}`}
                      className="rounded-2xl border border-white/10 bg-[#0D1220] p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold">Factuur</h3>
                        {statusBadge(invoice.status)}
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-slate-400">Betaald</p>
                          <p className="mt-1 text-lg font-semibold">
                            {formatteerBedrag(invoice.amountPaid, invoice.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Verschuldigd</p>
                          <p className="mt-1 text-lg font-semibold">
                            {formatteerBedrag(invoice.amountDue, invoice.currency)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 break-all text-xs text-slate-500">
                        {invoice.invoiceId || "Geen factuur-ID"}
                      </p>
                      {invoice.hostedInvoiceUrl ? (
                        <a
                          href={invoice.hostedInvoiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-block text-sm font-semibold text-cyan-300 hover:underline"
                        >
                          Bekijk factuur
                        </a>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold">
                Abonnementen{" "}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  {subscriptions.length}
                </span>
              </h2>
              <div className="mt-4 grid gap-5">
                {subscriptions.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-[#0D1220] p-10 text-center text-slate-400">
                    Nog geen abonnementen.
                  </div>
                ) : (
                  subscriptions.map((subscription, index) => (
                    <article
                      key={subscription.subscriptionId ?? `subscription-${index}`}
                      className="rounded-2xl border border-white/10 bg-[#0D1220] p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold">Abonnement</h3>
                        {statusBadge(subscription.status)}
                      </div>
                      <p className="mt-4 break-all text-xs text-slate-500">
                        {subscription.customerId || "Geen klant-ID"}
                      </p>
                      <p className="mt-3 text-sm text-slate-400">
                        {subscription.cancelAtPeriodEnd
                          ? "Stopt aan het einde van de periode"
                          : "Loopt door"}
                      </p>
                      {subscription.cancelAt ? (
                        <p className="mt-1 text-xs text-slate-400">
                          Einde van de periode: {formatteerDatum(subscription.cancelAt)}
                        </p>
                      ) : null}
                      {subscription.canceledAt ? (
                        <p className="mt-1 text-xs text-slate-400">
                          Geannuleerd op {formatteerDatum(subscription.canceledAt)}
                        </p>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
