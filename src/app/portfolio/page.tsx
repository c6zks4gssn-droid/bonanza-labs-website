"use client";

import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { ExternalLink, HeartPulse, ShieldCheck, Store } from "lucide-react";
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

const projects = [
  {
    icon: Store,
    name: "SilverJStore",
    proof: "Webshop · checkout en betaling",
    description: "Webshop voor 925 sterling zilveren kettingen en armbanden, met een duidelijke collectie en checkoutflow.",
    url: "https://silverjstore.com",
  },
  {
    icon: HeartPulse,
    name: "BonanzaVitals",
    proof: "Productlancering · eerst controleren, dan live",
    description: "Wellnessmerk in pre-launch: leveranciers, labels, productdocumentatie en fulfilment worden eerst gecontroleerd.",
    url: "https://bonanzavitals.com",
  },
  {
    icon: ShieldCheck,
    name: "mcp-guard",
    proof: "Open source · beveiliging van AI-koppelingen",
    description: "Open-source beveiligingslaag voor AI-koppelingen: toegangscontrole, gebruikslimieten en een kostenplafond.",
    url: "https://github.com/c6zks4gssn-droid/mcp-guard",
  },
];

export default function PortfolioPage() {

  return (
    <main id="main-content" className="light-site light-subpage min-h-screen">
      {/* Nav */}
      <SiteNav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-violet-400 font-semibold tracking-[3px] uppercase text-sm mb-4"
            >
              Ons werk
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]"
            >
              Wat we zelf bouwen{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                en beheren.
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl"
            >
              Eigen projecten van BonanzaLabs. Ze laten zien hoe we werken: afgebakend beginnen, zorgvuldig testen en pas daarna live gaan.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                <project.icon className="mb-5 h-10 w-10 text-cyan-300" aria-hidden="true" />
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  {project.name}
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
                </h3>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-300">{project.proof}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{project.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-black mb-4">
              Eén proces in jouw bedrijf slimmer inrichten?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-gray-400 mb-8">
              Vertel waar je team nu tijd verliest. We kijken eerst of het probleem concreet genoeg is om zinvol te automatiseren.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Bespreek je situatie →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}
