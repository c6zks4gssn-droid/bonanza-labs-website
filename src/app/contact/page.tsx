"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { X, Menu, Mail } from "lucide-react";
import { motion } from "framer-motion";

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
  const [error, setError] = useState("");
  const pageLoadTime = useRef(Date.now());
  // Honeypot field — separate state for the "website" trap
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Rate limiting: minimum 2 seconds between page load and submit (bot protection)
    const timeSinceLoad = Date.now() - pageLoadTime.current;
    if (timeSinceLoad < 2000) {
      setError("Er is een fout opgetreden. Probeer het later opnieuw.");
      return;
    }

    // Basic server-side-equivalent validation
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

    // Honeypot 1: if company field is filled, it's a bot — silent reject
    if (form.company) {
      // Pretend success but do nothing
      setSubmitted(true);
      return;
    }

    // Honeypot 2: if website field is filled, it's a bot — silent reject
    if (honeypot) {
      // Pretend success but do nothing
      setSubmitted(true);
      return;
    }

    setSubmitted(true);
    window.location.href = `mailto:hello@bonanzalabs.com?subject=Contactaanvraag van ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message + "\n\nE-mail: " + form.email)}`;
  };

  return (
    <main className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#050508]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between relative">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-256.png" alt="Bonanza Labs" className="h-8 w-8 rounded" />
            <span className="font-bold tracking-tight">BonanzaLabs</span>
          </Link>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div
            className={`nav-links ${menuOpen ? "open" : ""} md:flex items-center gap-6 text-sm text-gray-400`}
          >
            <Link href="/" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/tradeflow" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              TradeFlow
            </Link>
            <Link href="/serveflow" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              ServeFlow
            </Link>
            <Link href="/bonanza-voice" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              Bonanza Voice
            </Link>
            <Link href="/portfolio" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              Portfolio
            </Link>
            <Link href="/over-ons" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              Over ons
            </Link>
            <span className="text-white font-medium">Contact</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-violet-400 font-semibold tracking-[3px] uppercase text-sm mb-4"
            >
              Contact
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]"
            >
              Neem{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                contact op
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl"
            >
              Vragen of interesse in een Flow Assessment? Stuur ons een bericht.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact form + email */}
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Email */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">E-mail</p>
                <a href="mailto:hello@bonanzalabs.com" className="text-white font-semibold hover:text-violet-400 transition">
                  hello@bonanzalabs.com
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-emerald-300 mb-2">Bedankt voor je bericht!</h3>
              <p className="text-sm text-gray-400">Je e-mailclient wordt geopend. Als dat niet lukt, mail ons direct op <a href="mailto:hello@bonanzalabs.com" className="text-violet-400 hover:underline">hello@bonanzalabs.com</a>.</p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
            {/* Honeypot field 1 — hidden from users, bots fill it in */}
            <div className="hidden" aria-hidden="true">
              <label>Bedrijfsnaam (niet invullen)</label>
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            {/* Honeypot field 2 — website trap, visually hidden */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: "none" }}
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
              <label className="block text-sm text-gray-400 mb-2">Naam</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition"
                placeholder="Je naam"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">E-mail</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition"
                placeholder="je@email.nl"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Bericht</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition resize-none"
                placeholder="Vertel ons over je bedrijf en wat je nodig hebt..."
              />
            </div>
            <p className="text-xs text-gray-600">
              Door te versturen ga je akkoord met het verwerken van je gegevens conform de AVG/GDPR. We gebruiken je gegevens uitsluitend om contact met je op te nemen.
            </p>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition"
            >
              Verstuur →
            </button>
          </form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-black mb-4">
              Liever direct een gesprek?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-gray-400 mb-8">
              Boek een Flow Assessment en we bespreken je mogelijkheden.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Boek een Flow Assessment →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo-256.png" alt="Bonanza Labs" className="h-6 w-6 rounded" />
            <span className="font-bold">BonanzaLabs</span>
          </div>
          <p className="text-sm text-gray-600">
            © 2026 BonanzaLabs — AI automatisering voor het MKB
          </p>
        </div>
      </footer>
    </main>
  );
}
