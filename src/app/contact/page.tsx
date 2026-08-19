"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  UserRound,
} from "lucide-react";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { businessDetails, fullBusinessAddress } from "@/lib/business-details";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@bonanza-labs.com";
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || "";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_PHONE_DISPLAY || PHONE_NUMBER;
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hallo BonanzaLabs, ik wil graag kort bespreken welk proces bij ons het meeste handwerk kost.",
);

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "", company: "" });
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const pageLoadTime = useRef(Date.now());

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (Date.now() - pageLoadTime.current < 2000) {
      setError("Er is een fout opgetreden. Probeer het later opnieuw.");
      return;
    }

    if (form.name.trim().length < 2) {
      setError("Voer een geldige naam in.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Voer een geldig e-mailadres in.");
      return;
    }

    if (form.message.trim().length < 10) {
      setError("Bericht moet minimaal 10 tekens bevatten.");
      return;
    }

    if (form.company || honeypot) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          source: "contact-form",
          page: window.location.href,
          company: form.company,
          website: honeypot,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || `Er ging iets mis. Mail ons via ${CONTACT_EMAIL}.`);
        return;
      }

      setSubmitted(true);
    } catch (submitError) {
      console.error("Contact form error:", submitError);
      setError(`Er ging iets mis. Mail ons via ${CONTACT_EMAIL}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <SiteNav active="/contact" />

      <section className="relative px-6 pb-14 pt-36 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-amber-600/12 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Contact</p>
          <h1 className="mt-5 text-4xl font-black md:text-6xl">
            Eerst één proces scherp krijgen.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/55">
            Vertel waar je team nu onnodig tijd verliest. We kijken eerst of het probleem
            concreet genoeg is voor ServeFlow, TradeFlow, Bonanza Voice of een kleine maatwerkflow.
          </p>

          {BOOKING_URL && (
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              data-cta="contact-booking"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-bold text-black hover:bg-amber-300"
            >
              <CalendarDays className="h-5 w-5" />
              Plan 15 minuten
            </a>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid gap-5 md:grid-cols-[.9fr_1.1fr]">
          <aside className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex items-center gap-3">
                <UserRound className="h-6 w-6 text-amber-300" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">Contactpersoon</p>
                  <h2 className="mt-1 text-xl font-black">Clarence Etnel</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/55">
                BonanzaLabs werkt vanuit Groningen en helpt MKB-bedrijven met afgebakende
                automatisering rond concrete operationele problemen.
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-7">
              <Building2 className="h-6 w-6 text-cyan-300" />
              <h2 className="mt-4 text-xl font-black">Controleerbaar bedrijf</h2>
              <div className="mt-4 space-y-2 text-sm text-white/60">
                <p><strong className="text-white">Handelsnaam:</strong> {businessDetails.tradeName}</p>
                <p><strong className="text-white">Rechtsvorm:</strong> {businessDetails.legalForm}</p>
                <p><strong className="text-white">KvK:</strong> {businessDetails.kvkNumber}</p>
              </div>
              <div className="mt-5 flex items-start gap-2 text-sm text-white/50">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                <span>{fullBusinessAddress}</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-300/30"
              >
                <Mail className="h-5 w-5 text-cyan-300" />
                <p className="mt-3 text-xs text-white/40">E-mail</p>
                <p className="mt-1 break-all text-sm font-semibold">{CONTACT_EMAIL}</p>
              </a>

              {PHONE_NUMBER && (
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="rounded-2xl border border-violet-400/20 bg-violet-400/5 p-5 hover:border-violet-300/40"
                >
                  <Phone className="h-5 w-5 text-violet-300" />
                  <p className="mt-3 text-xs text-white/40">Telefoon</p>
                  <p className="mt-1 text-sm font-semibold">{PHONE_DISPLAY}</p>
                </a>
              )}

              {WHATSAPP_NUMBER && (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 hover:border-emerald-300/40"
                >
                  <MessageCircle className="h-5 w-5 text-emerald-300" />
                  <p className="mt-3 text-xs text-white/40">WhatsApp</p>
                  <p className="mt-1 text-sm font-semibold">Stuur een bericht</p>
                </a>
              )}
            </div>
          </aside>

          <div>
            {submitted ? (
              <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center">
                <div className="text-4xl">✅</div>
                <h2 className="mt-4 text-2xl font-black text-emerald-300">Bericht ontvangen</h2>
                <p className="mt-3 text-sm text-white/55">
                  We reageren doorgaans binnen één werkdag. We starten met een korte
                  kwalificatie van het probleem voordat we een implementatie voorstellen.
                </p>
                <Link
                  href="/oplossingen"
                  className="mt-6 inline-flex rounded-xl border border-white/15 px-5 py-3 text-sm font-bold hover:bg-white/5"
                >
                  Bekijk oplossingen
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
              >
                <div className="hidden" aria-hidden="true">
                  <label>Bedrijfsnaam (niet invullen)</label>
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={(event) => setForm({ ...form, company: event.target.value })}
                  />
                </div>
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm text-white/55">Naam</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-amber-400/50"
                    placeholder="Je naam"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/55">E-mail</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-amber-400/50"
                    placeholder="je@email.nl"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/55">Waar verlies je nu tijd?</label>
                  <textarea
                    required
                    rows={7}
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-amber-400/50"
                    placeholder="Bijvoorbeeld: gemiste telefoontjes, reserveringen via drie kanalen, incomplete offerteaanvragen of opvolging via losse WhatsApps."
                  />
                </div>

                <p className="text-xs leading-relaxed text-white/35">
                  Door te versturen ga je akkoord met verwerking volgens onze{" "}
                  <Link href="/privacy" className="text-cyan-300 underline">privacyverklaring</Link>.
                  Voor betaalde trajecten gelden daarnaast de{" "}
                  <Link href="/voorwaarden" className="text-cyan-300 underline">voorwaarden</Link>.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Versturen…" : "Verstuur je situatie"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-[#0A0E18] p-7 md:p-9">
          <h2 className="text-2xl font-black">Wat gebeurt er daarna?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["1", "Korte kwalificatie", "We bepalen of het probleem concreet genoeg is om zinvol te automatiseren."],
              ["2", "Scope", "We spreken één proces, grenzen, data en menselijke controle af."],
              ["3", "Voorstel", "Alleen als er een duidelijke fit is krijg je een concrete vervolgstap en prijs."],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm font-black text-amber-300">{number}</p>
                <h3 className="mt-2 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
