"use client";

import type { Metadata } from 'next';
import { X, Menu } from 'lucide-react';
import { useState } from 'react';

const services = [
  {
    icon: '🎯',
    name: 'Lead Generation',
    desc: 'We scan daily for new gigs, contracts, and opportunities in your niche. Draft personalized outreach. You approve via Telegram. Follow-ups on autopilot.',
    features: ['Daily lead scanning', 'Personalized outreach messages', 'Telegram approval workflow', 'Automated follow-ups'],
    bestFor: 'Marketing agencies, freelancers, consultants, real estate',
  },
  {
    icon: '📱',
    name: 'Social Media Management',
    desc: 'Auto-generate posts from your niche, schedule at optimal times, auto-engage with relevant content. Monthly analytics report included.',
    features: ['Auto-generated content', 'Optimal scheduling', 'Auto-engagement (like/reply)', 'Monthly analytics report'],
    bestFor: 'Restaurants, clinics, gyms, salons, local shops',
  },
  {
    icon: '💬',
    name: 'Customer Support AI',
    desc: 'AI chatbot on your website and socials. Answers FAQs, books appointments, escalates complex issues to a human. 24/7 availability.',
    features: ['FAQ automation', 'Appointment booking', 'Smart escalation', '24/7 availability'],
    bestFor: 'Clinics, salons, service businesses',
  },
  {
    icon: '✍️',
    name: 'Content & SEO Factory',
    desc: 'Generate blog posts, product descriptions, and meta tags. Optimize existing content. Track rankings. All on a schedule you approve.',
    features: ['Blog post generation', 'Product descriptions', 'Meta tag optimization', 'Rank tracking'],
    bestFor: 'E-commerce, SaaS, professional services',
  },
  {
    icon: '⭐',
    name: 'Review Management',
    desc: 'Monitor Google/Yelp reviews. Auto-draft responses for your approval. Flag negative reviews immediately. Never miss a review again.',
    features: ['Real-time review monitoring', 'Auto-drafted responses', 'Negative review alerts', 'Monthly reputation report'],
    bestFor: 'Restaurants, clinics, hotels, any local business',
  },
];

const tiers = [
  {
    name: 'Starter',
    price: '€297',
    period: '/mo',
    desc: '1 automation — review management or social posting',
    features: ['1 automation', 'Telegram approval', 'Weekly report', 'Email support', 'Month-to-month'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '€497',
    period: '/mo',
    desc: '2-3 automations — lead gen + social + content',
    features: ['2-3 automations', 'Telegram approval', 'Weekly reports', 'Priority support', 'Custom SOUL.md profile', 'Month-to-month'],
    cta: 'Most Popular',
    highlight: true,
  },
  {
    name: 'Scale',
    price: '€997',
    period: '/mo',
    desc: 'Full AI ops suite + dedicated profile + weekly calls',
    features: ['All automations', 'Telegram approval', 'Daily reports', 'Dedicated account manager', 'Custom SOUL.md profile', 'Weekly strategy call', 'Month-to-month'],
    cta: 'Contact Us',
    highlight: false,
  },
];

const howItWorks = [
  { step: '1', title: 'Audit', desc: 'We analyze your business processes and identify what to automate.' },
  { step: '2', title: 'Setup', desc: 'We configure your AI ops profile — isolated, secure, tailored to your niche.' },
  { step: '3', title: 'Approve', desc: 'Every outbound action goes through you via Telegram. You stay in control.' },
  { step: '4', title: 'Scale', desc: 'Your AI runs 24/7. You approve, it executes. More clients = more revenue.' },
];

const faqs = [
  { q: 'How is this different from hiring a virtual assistant?', a: 'A VA works 8 hours. Our AI runs 24/7, never forgets, never calls in sick. And at €497/mo, it costs less than a part-time VA.' },
  { q: 'Do I lose control over what gets posted or sent?', a: 'Never. Every outbound action — posts, emails, replies — goes through your Telegram for approval first. You can edit, approve, or reject anything.' },
  { q: 'What if I want to cancel?', a: 'Month-to-month contracts. No lock-in. Cancel anytime.' },
  { q: 'Is my data safe?', a: 'Each client gets an isolated AI profile. No cross-contamination. Your data never touches another client\'s automation.' },
  { q: 'How quickly can I see results?', a: 'Setup takes 4-8 hours. You\'ll see first automated actions within 48 hours. Most clients see ROI within the first month.' },
  { q: 'I\'m not technical. Is this for me?', a: 'That\'s the point. We handle all the tech. You just approve or reject actions in Telegram. If you can use WhatsApp, you can use this.' },
];

const navLinks = [
  { href: '/ai-ops', label: 'AI Ops' },
  { href: '/firewall', label: 'Firewall' },
  { href: '/products', label: 'Products' },
  { href: '/gasvrij', label: '🌱 GasVrij', className: 'text-emerald-400' },
  { href: '/pricing', label: 'Pricing' },
  { href: 'https://github.com/c6zks4gssn-droid', label: '🐙 GitHub', external: true },
];

const footerLinks = [
  { href: '/ai-ops', label: 'AI Ops' },
  { href: '/firewall', label: 'Firewall' },
  { href: '/tenderai', label: 'TenderAI' },
  { href: '/ugc', label: 'UGC Video' },
  { href: '/gasvrij', label: 'GasVrij' },
  { href: '/products', label: 'All Products' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/prompts', label: 'Prompts' },
  { href: '/intel', label: 'Intel' },
  { href: 'https://github.com/c6zks4gssn-droid', label: '🐙 GitHub', external: true },
];

export default function AIOpsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-lg">Bonanza Labs</a>
          <button className="md:hidden text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''} md:flex items-center gap-6 text-sm text-gray-400`}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`hover:text-white transition ${'className' in l && l.className ? l.className : ''}`}
                onClick={() => setMenuOpen(false)}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-gray-950 to-gray-950" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-6">
            <span className="animate-pulse w-2 h-2 rounded-full bg-violet-400" />
            Running 24/7 — no sick days
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your Business, <br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">On Autopilot</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            AI automation that handles lead generation, social media, customer support, and content — while you approve everything via Telegram. Based in the Netherlands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition">
              Start Free Audit →
            </a>
            <a href="#how-it-works" className="inline-flex items-center gap-2 border border-white/10 px-8 py-4 rounded-xl font-semibold hover:bg-white/5 transition">
              How It Works
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2"><span className="text-green-400">✓</span> KvK Registered</span>
            <span className="flex items-center gap-2"><span className="text-green-400">✓</span> Month-to-Month</span>
            <span className="flex items-center gap-2"><span className="text-green-400">✓</span> Dutch &amp; English</span>
            <span className="flex items-center gap-2"><span className="text-green-400">✓</span> iDEAL &amp; Crypto</span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">What We Automate</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Pick one, pick three, or go all-in. Every automation runs 24/7 and you approve every action.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.name} className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 hover:border-violet-500/30 transition group">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{s.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{s.desc}</p>
                <ul className="space-y-2 mb-4">
                  {s.features.map((f) => (
                    <li key={f} className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="text-violet-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 border-t border-white/5 pt-3">
                  Best for: {s.bestFor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((h) => (
              <div key={h.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {h.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{h.title}</h3>
                <p className="text-gray-400 text-sm">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Terminal */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">See It In Action</h2>
          <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto">Your AI ops agent runs in the background. You get a Telegram message, you approve, it executes.</p>
          <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-gray-900/50">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500 ml-2 font-mono">telegram — AI Ops Agent</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-xs">🤖</div>
                <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-md">
                  <p className="text-gray-300">New lead found: <span className="text-white font-medium">Bakery de Vries</span> in Amsterdam is looking for social media management.</p>
                  <p className="text-gray-400 mt-1">Draft outreach message:</p>
                  <p className="text-violet-300 mt-1 italic">&quot;Hi Bakery de Vries, I noticed you&apos;re looking for social media support. I run automated social media management for local businesses — posts, engagement, analytics — all on autopilot. Want to see a demo?&quot;</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-violet-500 rounded-2xl rounded-tr-none px-4 py-3 max-w-xs">
                  <p className="text-white">✅ Approve &amp; Send</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-xs">🤖</div>
                <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-md">
                  <p className="text-green-400">✅ Outreach sent to Bakery de Vries</p>
                  <p className="text-gray-400 mt-1">Follow-up scheduled for Thursday 10:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing, No Surprises</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">Month-to-month. No lock-in. Cancel anytime. First audit is free.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((t) => (
              <div key={t.name} className={`rounded-2xl p-8 ${t.highlight ? 'bg-gradient-to-b from-violet-500/10 to-cyan-500/5 border border-violet-500/30' : 'bg-gray-900/50 border border-white/5'} flex flex-col`}>
                <h3 className="text-xl font-semibold mb-1">{t.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{t.price}</span>
                  <span className="text-gray-400">{t.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{t.desc}</p>
                <ul className="space-y-3 mb-8 flex-grow">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="text-violet-400">✓</span>
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://t.me/BonanzaLabs_Bot"
                  className={`text-center py-3 rounded-xl font-semibold transition ${t.highlight ? 'bg-gradient-to-r from-violet-500 to-cyan-500 hover:opacity-90' : 'border border-white/10 hover:bg-white/5'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            All prices exclude BTW. KvK: 88564517 | BTW: NL004627152B36
          </p>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Bonanza Labs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🇳🇱', title: 'Netherlands-Based', desc: 'KvK registered. Dutch & English. Understands the local market, iDEAL payments, and EU regulations.' },
              { icon: '🔒', title: 'You Stay In Control', desc: 'Every outbound action — emails, posts, replies — goes through your Telegram for approval. Nothing goes out without you.' },
              { icon: '⚡', title: 'Runs 24/7', desc: 'No sick days, no sleep. Your AI agent monitors, generates, and queues actions around the clock.' },
              { icon: '🧠', title: 'Gets Smarter Over Time', desc: 'Your AI profile learns your preferences, tone, and business. The longer it runs, the better it gets.' },
              { icon: '💶', title: '€497/mo, Not €5K/mo', desc: 'A VA costs €2-5K/month. Our AI does more, costs less, and never takes a day off.' },
              { icon: '🛡️', title: 'Isolated & Secure', desc: 'Each client gets their own AI profile. No data sharing. No cross-contamination. Your business stays yours.' },
            ].map((w) => (
              <div key={w.title} className="bg-gray-900/50 border border-white/5 rounded-xl p-6 flex gap-4">
                <div className="text-3xl">{w.icon}</div>
                <div>
                  <h3 className="font-semibold mb-1">{w.title}</h3>
                  <p className="text-gray-400 text-sm">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
                <h3 className="font-semibold mb-2">{f.q}</h3>
                <p className="text-gray-400 text-sm">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Put Your Business on Autopilot?</h2>
          <p className="text-gray-400 text-lg mb-8">Free audit. No commitment. We&apos;ll show you exactly what we can automate for your business.</p>
          <a
            href="https://t.me/BonanzaLabs_Bot"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Start Free Audit →
          </a>
          <p className="text-sm text-gray-500 mt-6">Or email us at hello@bonanza-labs.com</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-4">Bonanza Labs</h3>
              <p className="text-sm text-gray-500">AI automation for businesses that want to scale without hiring.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><a href="/ai-ops" className="text-sm text-gray-500 hover:text-white transition">AI Ops</a></li>
                <li><a href="/firewall" className="text-sm text-gray-500 hover:text-white transition">Firewall</a></li>
                <li><a href="/ugc" className="text-sm text-gray-500 hover:text-white transition">UGC Video</a></li>
                <li><a href="/tenderai" className="text-sm text-gray-500 hover:text-white transition">TenderAI</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/pricing" className="text-sm text-gray-500 hover:text-white transition">Pricing</a></li>
                <li><a href="/products" className="text-sm text-gray-500 hover:text-white transition">All Products</a></li>
                <li><a href="/quiz" className="text-sm text-gray-500 hover:text-white transition">Quiz</a></li>
                <li><a href="/prompts" className="text-sm text-gray-500 hover:text-white transition">Prompts</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-500">KvK: 88564517</li>
                <li className="text-sm text-gray-500">BTW: NL004627152B36</li>
                <li><a href="https://github.com/c6zks4gssn-droid" className="text-sm text-gray-500 hover:text-white transition" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Bonanza Labs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}