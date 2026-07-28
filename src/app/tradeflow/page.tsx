"use client";

import Link from "next/link";
import { useState } from "react";
import { X, Menu, Check } from "lucide-react";
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

const modules = [
  "Conversiegerichte website of landingspagina",
  "Intake- en offerteformulieren",
  "TenderAI offertegenerator",
  "WhatsApp-opvolging",
  "Leadpipeline en CRM",
  "Automatische herinneringen",
  "Dashboard met aanvragen en status",
];

export default function TradeFlowPage() {
  const [menuOpen, setMenuOpen] = useState(false);

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
            <span className="text-white font-medium">TradeFlow</span>
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
            <Link href="/contact" className="hover:text-white transition" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <Link
              href="/pricing"
              className="bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-1.5 rounded-lg font-semibold text-white hover:opacity-90 transition"
              onClick={() => setMenuOpen(false)}
            >
              Flow Assessment
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300"
            >
              🔧 TradeFlow
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]"
            >
              Van aanvraag naar offerte en opvolging{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                zonder WhatsApp-chaos.
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl"
            >
              Website, lead intake, offertegeneratie, WhatsApp-opvolging en eenvoudige CRM — alles in één systeem.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300"
            >
              Vanaf €2.500
            </motion.div>
            <motion.div
              variants={fadeUp}
              custom={4}
              className="mt-8 flex gap-3 md:gap-4 flex-wrap justify-center"
            >
              <Link
                href="/pricing"
                className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Boek een Flow Assessment →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 px-6 relative">
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-violet-400 font-semibold tracking-[3px] uppercase text-sm mb-4">
              Modules
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black">
              Alles wat je nodig hebt voor aanvraagafhandeling
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {modules.map((mod, i) => (
              <motion.div
                key={mod}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/10 transition"
              >
                <span className="text-violet-400 flex-shrink-0">
                  <Check className="w-5 h-5" />
                </span>
                <span className="text-sm text-white/80">{mod}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-black mb-4">
              Klaar om je aanvraagproces te stroomlijnen?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-gray-400 mb-8">
              Start met een Flow Assessment. We analyseren je proces en bouwen je systeem op maat.
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