"use client";

import { motion } from "framer-motion";
import { Zap, Home, Thermometer, Shield, ArrowRight, CheckCircle, Phone, Euro } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
};

export default function GasVrijPage() {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("");

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
              <Zap className="w-3.5 h-3.5" /> Noodzakelijke energietransitie
            </div>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
            GasVrij<br />
            <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">Groningen</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            300.000+ huizen moeten van het gas af. Wij berekenen jouw transitieplan — subsidies, warmtepomp, zonnepanelen — in 60 seconden.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mt-8 flex gap-4 justify-center flex-wrap">
            <a href="#check" className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-amber-500 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
              <Home className="w-4 h-4" /> Check je woning
            </a>
            <a href="#hoe" className="flex items-center gap-2 border border-white/10 px-6 py-3 rounded-xl font-semibold hover:bg-white/5 transition">
              Hoe werkt het? <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500 flex-wrap">
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">🏠 Adres-check</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">💰 Subsidie-berekening</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">📋 Persoonlijk plan</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">🔧 Geverifieerde aannemers</span>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "300K+", label: "Huizen van het gas af" },
            { num: "€1.2B", label: "Herstelfonds Groningen" },
            { num: "€8K-25K", label: "Gemiddelde investering" },
            { num: "40%", label: "Subsidie-dekking mogelijk" },
          ].map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">{s.num}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="hoe" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-emerald-400 font-semibold tracking-[3px] uppercase text-sm text-center mb-4">Hoe werkt het</p>
          <h2 className="text-4xl font-black text-center mb-16">Van gas naar gasvrij in 3 stappen</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Home className="w-8 h-8" />, title: "1. Adres check", desc: "Voer je adres in. Wij halen je woningtype, bouwjaar, energielabel en warmtenet-beschikbaarheid op." },
              { icon: <Euro className="w-8 h-8" />, title: "2. Subsidie berekening", desc: "Automatische check van ISDE, warmtefonds, gemeente-subsidies en provinciale regelingen. Je ziet direct wat je bespaart." },
              { icon: <Shield className="w-8 h-8" />, title: "3. Persoonlijk plan", desc: "Krijg een concreet transitieplan met warmtepomp-type, isolatie-advies, kosten na subsidie, en 3 geverifieerde aannemers." },
            ].map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-emerald-500/20 transition">
                <div className="text-emerald-400 mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Check */}
      <section id="check" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Check je woning</h2>
          <p className="text-gray-400 mb-8">Voer je adres in en ontdek direct je transitie-mogelijkheden.</p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Bijv. Grote Markt 1, Groningen"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={() => setStep(1)}
              className="bg-gradient-to-r from-emerald-500 to-amber-500 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> Check
            </button>
          </div>
          {step >= 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-left">
              <h3 className="font-bold text-lg mb-3 text-emerald-400">🔍 Analyse gestart voor: {address || "jouw adres"}</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Woningtype gedetecteerd</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Energielabel opgehaald</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Warmtenet-beschikbaarheid gecheckt</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> ISDE-subsidie berekend</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Warmtefonds-subsidie berekend</div>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-2xl font-black text-emerald-400">€4.200 — €8.900 subsidie beschikbaar</div>
                <div className="text-sm text-gray-400 mt-1">Gebaseerd op gemiddelde woning in Groningen. Jouw exacte berekening komt binnenkort.</div>
              </div>
              <div className="mt-4 text-sm text-gray-500 italic">⚡ GasVrij Groningen is in ontwikkeling. Laat je e-mail achter voor early access.</div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Why GasVrij */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-emerald-400 font-semibold tracking-[3px] uppercase text-sm text-center mb-4">Waarom GasVrij</p>
          <h2 className="text-4xl font-black text-center mb-16">De energietransitie is geen keuze meer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Wetgeving verplicht", desc: "Vanaf 2050 moeten alle huizen van het gas af. Gemeenten starten nu met wijk-aan-wijk aanpak." },
              { title: "Subsidies zijn nu het hoogst", desc: "ISDE, warmtefonds, en gemeentelijke subsidies zijn maximaal nu. Wachten kost geld." },
              { title: "Energiebesparing direct", desc: "Een warmtepomp bespaart €1.500-3.000/jaar op energiekosten. Dat verdient terug in 5-8 jaar." },
              { title: "Woningwaarde stijgt", desc: "Energiezuinige woningen zijn €20.000-50.000 meer waard. Gasvrij = toekomstbestendig." },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-emerald-500/20 transition">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Klaar om van het gas af te gaan?</h2>
          <p className="text-gray-400 mb-8">Ontdek in 60 seconden hoeveel subsidie je kunt krijgen voor je Groningse woning.</p>
          <a href="#check" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-amber-500 px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition">
            <Home className="w-5 h-5" /> Start je check
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-sm text-gray-600">
        <p>© 2026 Bonanza Labs — GasVrij Groningen is een product van Bonanza Labs</p>
        <p className="mt-1">Niet bevestigd als financieel of juridisch advies. Raadpleeg altijd een erkend installateur.</p>
      </footer>
    </div>
  );
}