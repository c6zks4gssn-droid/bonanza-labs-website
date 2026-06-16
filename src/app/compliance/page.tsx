"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Clock, AlertTriangle, FileText, ChevronDown, Check, Menu, X } from "lucide-react";

const EU_AI_ACT_DATE = new Date("2026-08-02T00:00:00+02:00");

const FAQ_ITEMS = [
  {
    q: "Wat is de EU AI Act?",
    a: "De EU AI Act is 's werelds eerste uitgebreide regelgeving voor kunstmatige intelligentie. Artikel 14 verplicht aanbieders van AI-systemen om transparantie, documentatie en menselijk toezicht te waarborgen.",
  },
  {
    q: "Geldt de AI Act voor Bonanza Labs?",
    a: "Ja. Bonanza Labs levert AI-powered tools (Spending Firewall, Agent Wallet, Search API) die onder 'limited risk' en mogelijk 'high risk' categorieën vallen. Artikel 14 vereisten zijn verplicht vanaf 2 augustus 2026.",
  },
  {
    q: "Wat zijn de boetes bij niet-naleving?",
    a: "Boetes kunnen oplopen tot €35 miljoen of 7% van de wereldwijde jaaromzet, afhankelijk van welke hoger is. Voor SMB's gelden lagere drempels, maar naleving is essentieel.",
  },
  {
    q: "Hoe voldoet Bonanza Labs aan Artikel 14?",
    a: "Onze Spending Firewall logging, Agent Wallet approvals, en Search API audit trails voldoen aan de transparantievereisten. Alle AI-beslissingen worden gelogd met redenering, timestamp en agent-ID.",
  },
  {
    q: "Kan ik een compliance rapport aanvragen?",
    a: "Ja. We bieden een gedetailleerd compliance rapport voor uw legal team. Laat uw email achter hieronder en wij sturen het rapport binnen 48 uur.",
  },
  {
    q: "Wat als de deadline wordt gemist?",
    a: "De EU AI Act Artikel 14 is verplicht vanaf 2 augustus 2026. Na deze datum kunnen niet-complying aanbieders boetes krijgen. Wij raden aan om voor 1 juli 2026 compliant te zijn.",
  },
];

const COMPLIANCE_FEATURES = [
  {
    requirement: "Risicobeoordeling & documentatie",
    bonanza: "Spending Firewall classificeert elke transactie met risico-score en redenering",
    status: "done",
  },
  {
    requirement: "Transparantie van AI-beslissingen",
    bonanza: "Alle beslissingen worden gelogd met agent-ID, timestamp, bedrag en rationale",
    status: "done",
  },
  {
    requirement: "Menselijk toezicht (human-in-the-loop)",
    bonanza: "Agent Wallet vereist handmatige goedkeuring voor transacties boven drempel",
    status: "done",
  },
  {
    requirement: "Audit trail & logboek",
    bonanza: "Search API en Firewall API behouden volledige audit trails van alle bevragingen",
    status: "done",
  },
  {
    requirement: "Data quality & bias monitoring",
    bonanza: "Regelmatige evaluatie van model-beslissingen via analytics dashboard",
    status: "progress",
  },
  {
    requirement: "Incident rapportage",
    bonanza: "Geautomatiseerde incident detectie met melding binnen 48 uur aan bevoegde autoriteiten",
    status: "progress",
  },
];

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = target.getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return timeLeft;
}

export default function CompliancePage() {
  const timeLeft = useCountdown(EU_AI_ACT_DATE);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-orange-500" />
            Bonanza Labs
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/products" className="hover:text-orange-500 transition">Products</Link>
            <Link href="/firewall" className="hover:text-orange-500 transition">Firewall</Link>
            <Link href="/compliance" className="text-orange-500 font-medium">Compliance</Link>
            <Link href="/gasvrij" className="hover:text-orange-500 transition">GasVrij</Link>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-3">
            <Link href="/products" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link href="/firewall" onClick={() => setMenuOpen(false)}>Firewall</Link>
            <Link href="/compliance" onClick={() => setMenuOpen(false)}>Compliance</Link>
            <Link href="/gasvrij" onClick={() => setMenuOpen(false)}>GasVrij</Link>
          </div>
        )}
      </nav>

      {/* Hero with countdown */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-6">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-400">EU AI Act — Artikel 14</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Compliance Countdown
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            De EU AI Act treedt in werking op 2 augustus 2026. Bonanza Labs is klaar. Is uw organisatie dat ook?
          </p>

          {/* Countdown timer */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-10">
            {[
              { label: "Dagen", value: timeLeft.days },
              { label: "Uren", value: timeLeft.hours },
              { label: "Minuten", value: timeLeft.minutes },
              { label: "Seconden", value: timeLeft.seconds },
            ].map((t) => (
              <div key={t.label} className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6">
                <div className="text-3xl md:text-5xl font-bold text-orange-500 tabular-nums">
                  {String(t.value).padStart(2, "0")}
                </div>
                <div className="text-xs md:text-sm text-gray-500 mt-2">{t.label}</div>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            Deadline: 2 augustus 2026
          </div>
        </div>
      </section>

      {/* Compliance features table */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Artikel 14 Vereisten → Bonanza Features</h2>
          <p className="text-gray-400 mb-8">Hoe wij aan elke vereiste voldoen</p>

          <div className="space-y-3">
            {COMPLIANCE_FEATURES.map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4">
                <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  f.status === "done" ? "bg-green-500/20" : "bg-yellow-500/20"
                }`}>
                  {f.status === "done" ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{f.requirement}</div>
                  <div className="text-gray-400 text-sm">{f.bonanza}</div>
                </div>
                <div className={`text-xs px-3 py-1 rounded-full shrink-0 ${
                  f.status === "done"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-yellow-500/10 text-yellow-400"
                }`}>
                  {f.status === "done" ? "Voltooid" : "In ontwikkeling"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fine section */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-400">Risico bij niet-naleving</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            €35 miljoen of 7% omzet
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            De maximale boete onder de EU AI Act. Boetes worden bepaald op basis van de ernd van de overtreding en de grootte van de aanbieder. Voor organisaties die AI-systemen aanbieden zonder adequate transparantie en menselijk toezicht, kunnen de gevolgen aanzienlijk zijn.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Veelgestelde vragen</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition"
                >
                  <span className="font-medium">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${
                    openFaq === i ? "rotate-180" : ""
                  }`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-400 text-sm">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <FileText className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Compliance Rapport Aanvragen</h2>
          <p className="text-gray-400 mb-6">
            Ontvang een gedetailleerd rapport voor uw legal team binnen 48 uur.
          </p>
          {submitted ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <Check className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <p className="text-green-400 font-medium">Aanvraag ontvangen!</p>
              <p className="text-gray-400 text-sm mt-1">We sturen het rapport naar {email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="uw@email.nl"
                required
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-medium transition"
              >
                Aanvragen
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>© 2026 Bonanza Labs — EU AI Act Compliance</p>
      </footer>
    </div>
  );
}