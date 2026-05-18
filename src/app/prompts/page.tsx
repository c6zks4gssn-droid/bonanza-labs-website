"use client";

import { useState } from "react";

interface Prompt {
  title: string;
  category: string;
  prompt: string;
  emoji: string;
  useCase: string;
}

const prompts: Prompt[] = [
  {
    title: "LinkedIn Post Writer",
    category: "Content",
    emoji: "📝",
    useCase: "Write a LinkedIn post about [TOPIC] in the style of [PERSON]. Max 200 words. Start with a hook in the first line. End with a question.",
    prompt: `Write a LinkedIn post about [TOPIC] in the style of [PERSON].

Rules:
- Maximum 200 words
- Hook in the first line (no "I'm excited to announce")
- Use short paragraphs (1-2 sentences max)
- Include 1 specific number or data point
- End with a question that invites comments
- Tone: confident but not preachy
- No hashtags in the middle of the text`,
  },
  {
    title: "Code Reviewer",
    category: "Development",
    emoji: "🔍",
    useCase: "Review this code for bugs, performance issues, and security vulnerabilities. Suggest fixes.",
    prompt: `You are a senior code reviewer. Analyze the following code:

[PASTE CODE]

Check for:
1. **Security vulnerabilities** — XSS, SQL injection, hardcoded secrets, auth issues
2. **Performance bottlenecks** — N+1 queries, unnecessary loops, memory leaks
3. **Logic errors** — Race conditions, null checks, edge cases
4. **Best practices** — Naming, structure, DRY, SOLID principles
5. **Missing error handling** — Uncaught exceptions, missing try/catch

Format your response as:
- 🔴 Critical (must fix)
- 🟡 Warning (should fix)
- 🟢 Suggestion (nice to have)

For each issue, provide the line number, explanation, and a code fix.`,
  },
  {
    title: "Product Description Generator",
    category: "Marketing",
    emoji: "🛍️",
    useCase: "Generate a compelling product description for [PRODUCT] targeting [AUDIENCE].",
    prompt: `Write a product description for [PRODUCT] targeting [AUDIENCE].

Structure:
1. **Headline** (6-10 words, benefit-driven)
2. **Opening hook** (1 sentence that creates desire)
3. **Key benefits** (3-5 bullet points, focus on outcomes not features)
4. **Social proof snippet** (placeholder for review/number)
5. **CTA** (urgency-driven)

Rules:
- Use power words: "discover", "transform", "elevate"
- Address objections implicitly
- No jargon unless the audience expects it
- Include specific numbers where possible
- End with a clear call-to-action`,
  },
  {
    title: "Weekly Planner",
    category: "Productivity",
    emoji: "📅",
    useCase: "Plan my week around [GOAL]. I have [HOURS] available per day.",
    prompt: `Create a weekly plan for [GOAL].

Available time: [HOURS] hours per day
Constraints: [CONSTRAINTS]

For each day, provide:
1. **Main focus** (1 primary objective)
2. **Time blocks** (specific hours allocated)
3. **Quick wins** (tasks under 15 min)
4. **Deep work** (tasks needing 1+ hours of focus)

Rules:
- Schedule deep work in morning blocks
- Group similar tasks together
- Include 1 buffer hour per day for unexpected items
- Mark the #1 priority task each day with ⭐
- Friday afternoon: review + next week prep`,
  },
  {
    title: "Bug Report Analyzer",
    category: "Development",
    emoji: "🐛",
    useCase: "Analyze this bug report and identify root cause, severity, and fix steps.",
    prompt: `Analyze the following bug report:

[PASTE BUG REPORT]

Provide:
1. **Severity**: P0 (critical) / P1 (high) / P2 (medium) / P3 (low)
2. **Root Cause**: Most likely cause (max 2 sentences)
3. **Reproduction Steps**: Ordered list to reliably reproduce
4. **Affected Areas**: What else might be broken
5. **Fix Approach**: Step-by-step fix plan
6. **Test Plan**: How to verify the fix works
7. **Prevention**: What to change so this can't happen again`,
  },
  {
    title: "SEO Blog Outline",
    category: "Content",
    emoji: "📊",
    useCase: "Create an SEO-optimized blog outline for [KEYWORD] targeting [AUDIENCE].",
    prompt: `Create an SEO blog outline for the keyword: [KEYWORD]
Target audience: [AUDIENCE]

Include:
1. **Title options** (3 variations, include keyword naturally)
2. **Meta description** (155 chars, keyword included)
3. **H2 structure** (5-7 sections)
4. **Key points per section** (2-3 bullet points each)
5. **Internal linking opportunities** (related topics)
6. **FAQ section** (4 questions people also ask)
7. **CTA placement** (where to convert readers)

Rules:
- Keyword in title, first H2, and conclusion
- Each H2 should target a related long-tail keyword
- Include 1 statistic or data point suggestion per section
- Word count target: 1500-2000 words`,
  },
  {
    title: "Startup Pitch Deck",
    category: "Business",
    emoji: "🚀",
    useCase: "Create a 10-slide pitch deck outline for [STARTUP] in [INDUSTRY].",
    prompt: `Create a 10-slide pitch deck outline for [STARTUP] in the [INDUSTRY] space.

Slides:
1. **Title** — Name, tagline, your name
2. **Problem** — What's broken? (1 stat, 1 story)
3. **Solution** — Your product in 1 sentence
4. **Market** — TAM, SAM, SOM with numbers
5. **Product** — 3 key features with screenshots
6. **Traction** — Revenue, users, growth rate
7. **Business Model** — How you make money
8. **Competition** — 2x2 matrix vs competitors
9. **Team** — Why you're the right people
10. **Ask** — How much, for what, milestones

For each slide provide:
- Headline (max 6 words)
- 3 key bullet points
- What visual to use (chart, photo, diagram)`,
  },
  {
    title: "Email Sequence Builder",
    category: "Marketing",
    emoji: "📧",
    useCase: "Build a 5-email cold outreach sequence for [PRODUCT] targeting [AUDIENCE].",
    prompt: `Create a 5-email cold outreach sequence for [PRODUCT] targeting [AUDIENCE].

Email 1: Cold intro (Day 1)
Email 2: Value-add (Day 3)
Email 3: Case study (Day 7)
Email 4: FOMO (Day 10)
Email 5: Breakup (Day 14)

For each email provide:
- **Subject line** (A/B options)
- **Preview text** (first line visible in inbox)
- **Body** (under 100 words)
- **CTA** (1 clear next step)

Rules:
- Subject lines: 3-6 words, no clickbait
- First line references their company/role
- Each email adds value, not just "bumping this"
- Last email: "Should I close your file?" (gets highest reply rate)
- No attachments in cold emails`,
  },
];

const categories = ["All", "Content", "Development", "Marketing", "Productivity", "Business"];

export default function PromptsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = activeCategory === "All" ? prompts : prompts.filter((p) => p.category === activeCategory);

  function copyPrompt(prompt: string, title: string) {
    navigator.clipboard.writeText(prompt);
    setCopied(title);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050508]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-lg font-bold tracking-tight">Bonanza Labs</a>
          <a href="/" className="text-sm text-white/50 hover:text-white transition">← Home</a>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-[#f7931a] text-xs tracking-[0.3em] uppercase mb-3">Weekly AI Prompts</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Copy. Paste. Ship.</h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Battle-tested AI prompts for developers, founders, and marketers.
              Updated weekly. No fluff.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  activeCategory === cat
                    ? "bg-[#f7931a] text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Prompts */}
          <div className="space-y-6">
            {filtered.map((prompt) => (
              <div
                key={prompt.title}
                className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]"
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{prompt.emoji}</span>
                        <h2 className="text-xl font-bold">{prompt.title}</h2>
                      </div>
                      <span className="text-xs text-white/40 uppercase tracking-wider">{prompt.category}</span>
                    </div>
                    <button
                      onClick={() => copyPrompt(prompt.prompt, prompt.title)}
                      className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        copied === prompt.title
                          ? "bg-green-500/20 text-green-400"
                          : "bg-[#f7931a]/10 text-[#f7931a] hover:bg-[#f7931a]/20"
                      }`}
                    >
                      {copied === prompt.title ? "✓ Copied" : "Copy Prompt"}
                    </button>
                  </div>
                  <p className="text-white/50 mt-2 text-sm">{prompt.useCase}</p>
                </div>

                {/* Prompt body */}
                <div className="px-6 pb-6">
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-white/80 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {prompt.prompt}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16 p-8 border border-white/10 rounded-2xl bg-white/[0.02]">
            <h3 className="text-xl font-bold mb-2">New prompts every week</h3>
            <p className="text-white/50 mb-4">Bookmark this page. We add fresh prompts every Monday.</p>
            <a
              href="/quiz"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f7931a] to-[#ff6b35] text-white font-semibold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Find your perfect tool →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}