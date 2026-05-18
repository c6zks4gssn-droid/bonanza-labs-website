"use client";

import { motion } from "framer-motion";


import { useState } from "react";
import { FileText, Upload, Zap, Check, ArrowRight, Sparkles, Clock, Shield, Brain, ChevronDown } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

function DemoSection() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: Upload, title: "Upload je offertes", desc: "Sleep je oude offertes, aanbestedingen en bedrijfsmateriaal naar TenderAI. Onze AI leert je stijl, toon en prijsstructuren." },
    { icon: FileText, title: "Plak de tender", desc: "Kopieer de RFQ of aanbesteding die je wilt beantwoorden. TenderAI analyseert de eisen en matcht ze met je kennisbank." },
    { icon: Brain, title: "AI schrijft je offerte", desc: "In 5 minuten genereert TenderAI een op maat geschreven offerte die jouw stijl volgt, met juiste pricing en overtuigende argumentatie." },
    { icon: Check, title: "Review & verstuur", desc: "Check de gegenereerde offerte, tweak wat je wil, en verstuur. Klaar. Van 40 uur naar 5 minuten." },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`flex-1 p-4 rounded-xl border transition-all text-left ${
              step === i ? 'border-amber-500/50 bg-amber-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}>
            <s.icon className={`w-5 h-5 mb-2 ${step === i ? 'text-amber-400' : 'text-white/40'}`} />
            <p className={`text-sm font-semibold ${step === i ? 'text-amber-400' : 'text-white/60'}`}>Stap {i + 1}</p>
            <p className="text-xs text-white/40 mt-1">{s.title}</p>
          </button>
        ))}
      </div>
      <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-3">{steps[step].title}</h3>
        <p className="text-white/70 leading-relaxed">{steps[step].desc}</p>
      </motion.div>
    </div>
  );
}

export default function TenderAIPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const features = [
    { icon: Brain, title: "Leert jouw stijl", desc: "Upload je oude offertes en TenderAI leert je tone of voice, pricing en argumentatiepatronen." },
    { icon: Zap, title: "5 minuten i.p.v. 40 uur", desc: "Van aanbesteding naar complete offerte in minuten. Niet uren typen, niet copy-pasten." },
    { icon: Shield, title: "Nederlands zakelijk", desc: "Getraind op Nederlandse aanbestedingstaal. Geen vertalingen, geen AI-geur. Precies hoe jij het zou schrijven." },
    { icon: Clock, title: "Kennisbank hergebruikt", desc: "Elke offerte maakt je volgende beter. TenderAI bouwt een kennisbank die groeit met elk project." },
  ];

  const pricing = [
    {
      name: "Starter",
      price: "€49",
      period: "/maand",
      desc: "Perfect voor freelancers die af en toe een offerte schrijven",
      features: ["5 offertes per maand", "1 kennisbank", "Nederlandse taal", "PDF export"],
      cta: "Begin gratis",
      highlight: false,
    },
    {
      name: "Pro",
      price: "€149",
      period: "/maand",
      desc: "Voor MKB'ers die wekelijks offertes schrijven",
      features: ["Onbeperkt offertes", "Meerdere kennisbanken", "Team samenwerking", "API toegang", "Prioriteit support"],
      cta: "Populairste keuze",
      highlight: true,
    },
    {
      name: "Agency",
      price: "€299",
      period: "/maand",
      desc: "Voor bureaus die schaalbaar offertes willen produceren",
      features: ["Alles in Pro", "Onbeperkt teamleden", "Custom branding", "White-label export", "Dedicated support"],
      cta: "Neem contact op",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#050508]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <img src="/logo-256.png" alt="Bonanza Labs" className="h-7" />
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <a href="#how-it-works" className="hover:text-white transition-colors">Hoe het werkt</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Prijzen</a>
            <a href="/products" className="hover:text-white transition-colors">Alle producten</a>
          </div>
          <a href="#cta" className="px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors">
            Gratis starten
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Nieuw — TenderAI voor de NL/BE markt
          </motion.div>

          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="hero-title text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
            Schrijf offertes in<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">5 minuten</span>, niet 40 uur
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="hero-sub text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            TenderAI leert van je oude offertes en schrijft nieuwe aanbestedingen in jouw stijl. Stop met typen, begin met winnen.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#cta" className="px-8 py-4 rounded-xl bg-amber-500 text-black font-bold text-lg hover:bg-amber-400 transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/25">
              Gratis uitproberen →
            </a>
            <a href="#how-it-works" className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:border-white/40 transition-all">
              Hoe het werkt
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/tenderai/demo" className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/25 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Proef het zelf →
            </a>
          </motion.div>

          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
            className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {[
              { num: "80%", label: "van offertes wordt verloren" },
              { num: "40u", label: "gemiddeld per offerte" },
              { num: "5min", label: "met TenderAI" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-400">{s.num}</p>
                <p className="text-sm text-white/40 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3">Hoe het werkt</p>
          <h2 className="section-title text-3xl md:text-5xl font-bold">Van aanbesteding naar offerte in 4 stappen</h2>
        </div>
        <DemoSection />
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3">Features</p>
            <h2 className="section-title text-3xl md:text-5xl font-bold">Alles wat je nodig hebt</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-amber-500/30 transition-colors group">
                <f.icon className="w-10 h-10 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-white/60 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3">Waarom dit werkt</p>
          <h2 className="section-title text-3xl md:text-5xl font-bold mb-12">Eén gewonnen tender = maanden abo terugverdiend</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "€149", desc: "Pro abonnement per maand" },
              { num: "€10k+", desc: "omzet uit één gewonnen tender" },
              { num: "67x", desc: "ROI op je TenderAI abonnement" },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <p className="text-4xl font-bold text-amber-400">{s.num}</p>
                <p className="text-white/60 mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3">Prijzen</p>
            <h2 className="section-title text-3xl md:text-5xl font-bold">Begin vandaag. Annuleer altijd.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 border ${
                plan.highlight ? 'border-amber-500 bg-amber-500/5' : 'border-white/10 bg-white/5'
              } relative`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold">
                    Populair
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-white/40 text-sm mb-4">{plan.desc}</p>
                <p className="text-4xl font-bold mb-1">{plan.price}<span className="text-lg text-white/40">{plan.period}</span></p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#cta" className={`block text-center mt-8 py-3 rounded-xl font-semibold transition-all ${
                  plan.highlight ? 'bg-amber-500 text-black hover:bg-amber-400' : 'border border-white/20 text-white hover:border-amber-500/50'
                }`}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3">Wacht niet op de volgende aanbesteding</p>
          <h2 className="section-title text-3xl md:text-5xl font-bold mb-6">
            Begin vandaag met <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">TenderAI</span>
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Meld je aan voor early access. De eerste 100 gebruikers krijgen 3 maanden Pro gratis.
          </p>
          {submitted ? (
            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
              <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-semibold">Je staat op de wachtlijst!</p>
              <p className="text-white/60 text-sm mt-1">We nemen contact op zodra TenderAI beschikbaar is.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="je@email.nl" required
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-colors" />
              <button type="submit"
                className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all whitespace-nowrap">
                Aanmelden →
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-xs">B</div>
            <span className="text-white/40 text-sm">© 2026 Bonanza Labs</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/products" className="hover:text-white transition-colors">Products</a>
            <a href="/firewall" className="hover:text-white transition-colors">Firewall</a>
            <a href="/tenderai" className="hover:text-amber-400 font-semibold">TenderAI</a>
          </div>
        </div>
      </footer>
    </div>
  );
}