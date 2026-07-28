"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import { motion } from "framer-motion";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@bonanza-labs.com";
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || "";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_PHONE_DISPLAY || PHONE_NUMBER;
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hallo BonanzaLabs, ik wil graag meer weten over de ServeFlow 14-dagen pilot.",
);

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
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
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050508]/85 backdrop-blur-xl">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <img src="/logo-256.png" alt="BonanzaLabs" className="h-8 w-8 rounded" />
            BonanzaLabs
          </Link>
          <button className="text-white/60 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu openen">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className={`${menuOpen ? "flex" : "hidden"} absolute left-4 right-4 top-16 flex-col gap-4 rounded-2xl border border-white/10 bg-[#0D1220] p-5 text-sm text-white/65 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}>
            <Link href="/serveflow" className="hover:text-white">ServeFlow</Link>
            <Link href="/tradeflow" className="hover:text-white">TradeFlow</Link>
            <Link href="/blog" className="hover:text-white">Kennisbank</Link>
            <span className="font-semibold text-white">Contact</span>
            <Link href="/pricing" className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-black hover:bg-amber-300">Start pilot</Link>
          </div>
        </div>
      </nav>

      <section className="relative px-6 pb-14 pt-36 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-amber-600/12 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Contact</p>
          <h1 className="mt-5 text-4xl font-black md:text-6xl">Vraag naar de ServeFlow-pilot</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/55">
            De pilot omvat één locatie, één reserveringsflow en veertien dagen meten. Voor complexere processen bespreken we eerst een Flow Assessment.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          <a href={`mailto:${CONTACT_EMAIL}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-300/30">
            <Mail className="h-5 w-5 text-cyan-300" />
            <p className="mt-3 text-xs text-white/40">E-mail</p>
            <p className="mt-1 break-all text-sm font-semibold">{CONTACT_EMAIL}</p>
          </a>
          {WHATSAPP_NUMBER && (
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`} target="_blank" rel="noreferrer" className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 hover:border-emerald-300/40">
              <MessageCircle className="h-5 w-5 text-emerald-300" />
              <p className="mt-3 text-xs text-white/40">WhatsApp</p>
              <p className="mt-1 text-sm font-semibold">Stuur een bericht</p>
            </a>
          )}
          {PHONE_NUMBER && (
            <a href={`tel:${PHONE_NUMBER}`} className="rounded-2xl border border-violet-400/20 bg-violet-400/5 p-5 hover:border-violet-300/40">
              <Phone className="h-5 w-5 text-violet-300" />
              <p className="mt-3 text-xs text-white/40">Telefoon</p>
              <p className="mt-1 text-sm font-semibold">{PHONE_DISPLAY}</p>
            </a>
          )}
        </div>

        <div className="mt-8">
          {submitted ? (
            <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center">
              <div className="text-4xl">✅</div>
              <h2 className="mt-4 text-2xl font-black text-emerald-300">Bericht ontvangen</h2>
              <p className="mt-3 text-sm text-white/55">We reageren doorgaans binnen één werkdag. Je aanvraag is geen automatische pilotboeking; betaling verloopt uitsluitend via de beveiligde pricingpagina.</p>
              <Link href="/pricing" className="mt-6 inline-flex rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black hover:bg-amber-300">Bekijk pilot en voorwaarden</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="hidden" aria-hidden="true">
                <label>Bedrijfsnaam (niet invullen)</label>
                <input type="text" tabIndex={-1} autoComplete="off" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
              </div>
              <input type="text" name="website" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {error && <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">{error}</div>}

              <div>
                <label className="mb-2 block text-sm text-white/55">Naam</label>
                <input type="text" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-amber-400/50" placeholder="Je naam" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/55">E-mail</label>
                <input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-amber-400/50" placeholder="je@email.nl" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/55">Bericht</label>
                <textarea required rows={6} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-amber-400/50" placeholder="Vertel hoe reserveringen nu binnenkomen en welke locatie je wilt testen." />
              </div>
              <p className="text-xs leading-relaxed text-white/35">
                Door te versturen ga je akkoord met verwerking volgens onze <Link href="/privacy" className="text-cyan-300 underline">privacyverklaring</Link>. Voor een betaalde pilot gelden daarnaast de <Link href="/voorwaarden" className="text-cyan-300 underline">voorwaarden</Link>.
              </p>
              <button type="submit" disabled={submitting} className="w-full rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? "Versturen…" : "Verstuur bericht"}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>© 2026 BonanzaLabs — Groningen</p>
          <div className="flex gap-5"><Link href="/voorwaarden" className="hover:text-white">Voorwaarden</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/pricing" className="hover:text-white">Prijzen</Link></div>
        </div>
      </footer>
    </main>
  );
}
