"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { X, Menu, Mail, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || "";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_PHONE_DISPLAY || PHONE_NUMBER;
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hallo BonanzaLabs, ik wil graag meer weten over een Flow Assessment.",
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "", company: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const pageLoadTime = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (Date.now() - pageLoadTime.current < 2000) {
      setError("Er is een fout opgetreden. Probeer het later opnieuw.");
      return;
    }

    if (form.name.trim().length < 2) {
      setError("Voer een geldige naam in.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
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
      const res = await fetch("/api/leads", {
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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Er ging iets mis. Probeer het opnieuw of mail ons direct.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Contact form error:", err);
      setError("Er ging iets mis. Probeer het opnieuw of mail hello@bonanzalabs.com.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050508] text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050508]/80 backdrop-blur-xl">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-256.png" alt="Bonanza Labs" className="h-8 w-8 rounded" />
            <span className="font-bold tracking-tight">BonanzaLabs</span>
          </Link>
          <button
            className="text-gray-400 hover:text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu openen"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""} items-center gap-6 text-sm text-gray-400 md:flex`}>
            <Link href="/" className="transition hover:text-white" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/tradeflow" className="transition hover:text-white" onClick={() => setMenuOpen(false)}>TradeFlow</Link>
            <Link href="/serveflow" className="transition hover:text-white" onClick={() => setMenuOpen(false)}>ServeFlow</Link>
            <Link href="/bonanza-voice" className="transition hover:text-white" onClick={() => setMenuOpen(false)}>Bonanza Voice</Link>
            <Link href="/portfolio" className="transition hover:text-white" onClick={() => setMenuOpen(false)}>Portfolio</Link>
            <Link href="/blog" className="transition hover:text-white" onClick={() => setMenuOpen(false)}>Kennisbank</Link>
            <span className="font-medium text-white">Contact</span>
          </div>
        </div>
      </nav>

      <section className="relative px-6 pb-16 pt-36">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
            <motion.p variants={fadeUp} custom={0} className="mb-4 text-sm font-semibold uppercase tracking-[3px] text-violet-400">Contact</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Neem <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">contact op</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 max-w-2xl text-lg text-gray-400 md:text-xl">
              Vragen of interesse in een Flow Assessment? Kies het contactkanaal dat voor jou het makkelijkst is.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <a href="mailto:hello@bonanzalabs.com" className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-violet-400/30 hover:bg-violet-400/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                  <Mail className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  <p className="font-semibold text-white">hello@bonanzalabs.com</p>
                </div>
              </div>
            </a>

            {WHATSAPP_NUMBER && (
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6 transition hover:border-emerald-400/35 hover:bg-emerald-400/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                    <MessageCircle className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="font-semibold text-white">Stuur direct een bericht</p>
                  </div>
                </div>
              </a>
            )}

            {PHONE_NUMBER && (
              <a href={`tel:${PHONE_NUMBER}`} className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-6 transition hover:border-cyan-400/35 hover:bg-cyan-400/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                    <Phone className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefoon</p>
                    <p className="font-semibold text-white">{PHONE_DISPLAY}</p>
                  </div>
                </div>
              </a>
            )}
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
              <div className="mb-4 text-4xl">✅</div>
              <h3 className="mb-2 text-xl font-bold text-emerald-300">Bedankt voor je bericht!</h3>
              <p className="text-sm text-gray-400">Je bericht is veilig ontvangen. We reageren doorgaans binnen één werkdag.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {WHATSAPP_NUMBER && (
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`} target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400">Open WhatsApp</a>
                )}
                <Link href="/" className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:border-white/30">Terug naar home</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <div className="hidden" aria-hidden="true">
                <label>Bedrijfsnaam (niet invullen)</label>
                <input type="text" tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {error && <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">{error}</div>}

              <div>
                <label className="mb-2 block text-sm text-gray-400">Naam</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 transition focus:border-violet-500/50 focus:outline-none" placeholder="Je naam" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">E-mail</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 transition focus:border-violet-500/50 focus:outline-none" placeholder="je@email.nl" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Bericht</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 transition focus:border-violet-500/50 focus:outline-none" placeholder="Vertel ons over je bedrijf en wat je nodig hebt..." />
              </div>
              <p className="text-xs text-gray-600">
                Door te versturen ga je akkoord met het verwerken van je gegevens volgens onze <Link href="/privacy" className="text-violet-400 hover:underline">privacyverklaring</Link>.
              </p>
              <button type="submit" disabled={submitting} className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-violet-500/25 disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? "Versturen..." : "Verstuur →"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} custom={0} className="mb-4 text-3xl font-black md:text-4xl">Liever direct beginnen?</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mb-8 text-gray-400">Boek een Flow Assessment en krijg een concreet plan voor je belangrijkste proces.</motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-4 font-semibold transition hover:opacity-90">Boek een Flow Assessment →</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <img src="/logo-256.png" alt="Bonanza Labs" className="h-6 w-6 rounded" />
            <span className="font-bold">BonanzaLabs</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <span>© 2026 BonanzaLabs</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
