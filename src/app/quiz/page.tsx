"use client";

import { useState } from "react";

interface Question {
  id: number;
  question: string;
  options: { text: string; scores: Record<string, number> }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What's your biggest challenge right now?",
    options: [
      { text: "AI agents spending money without oversight", scores: { wallet: 3, firewall: 2 } },
      { text: "My GitHub repos are a mess", scores: { forkdoctor: 3 } },
      { text: "Creating video content takes too long", scores: { frameforge: 3 } },
      { text: "I can't find the right AI tool for my problem", scores: { search: 2, prompts: 2 } },
    ],
  },
  {
    id: 2,
    question: "What type of work do you do most?",
    options: [
      { text: "Building AI agents & automation", scores: { wallet: 2, firewall: 1 } },
      { text: "Open source development", scores: { forkdoctor: 2 } },
      { text: "Content creation & marketing", scores: { frameforge: 2, prompts: 1 } },
      { text: "Research & analysis", scores: { search: 2, intel: 1 } },
    ],
  },
  {
    id: 3,
    question: "What matters most to you?",
    options: [
      { text: "Security & control", scores: { firewall: 3, wallet: 1 } },
      { text: "Speed & automation", scores: { frameforge: 2, search: 1 } },
      { text: "Quality & best practices", scores: { forkdoctor: 2 } },
      { text: "Productivity & prompts", scores: { prompts: 3 } },
    ],
  },
  {
    id: 4,
    question: "What's your team size?",
    options: [
      { text: "Solo developer", scores: { forkdoctor: 1, prompts: 1 } },
      { text: "Small team (2-10)", scores: { wallet: 1, frameforge: 1 } },
      { text: "Growing startup (10-50)", scores: { firewall: 2, wallet: 1 } },
      { text: "Enterprise (50+)", scores: { firewall: 2, intel: 1 } },
    ],
  },
  {
    id: 5,
    question: "Pick the scenario that scares you most:",
    options: [
      { text: "An AI agent buying things without permission", scores: { firewall: 3, wallet: 2 } },
      { text: "Shipping code without CI/CD or security checks", scores: { forkdoctor: 3 } },
      { text: "Spending hours editing a 30-second video", scores: { frameforge: 3 } },
      { text: "Wasting hours finding the right prompt", scores: { prompts: 2, search: 1 } },
    ],
  },
];

const toolInfo: Record<string, { name: string; tag: string; desc: string; emoji: string; link: string; install: string }> = {
  wallet: {
    name: "Agent Wallet",
    tag: "AI Payment Infrastructure",
    desc: "Spending policies, approval queues, and Stripe checkout for AI agents. Never let an agent spend without your approval.",
    emoji: "💰",
    link: "/#wallet",
    install: "pip install bonanza-agents",
  },
  firewall: {
    name: "Spending Firewall",
    tag: "The Flagship Product",
    desc: "Set rules, approve risky payments, block bad vendors, and audit every agent transaction before money moves.",
    emoji: "🛡️",
    link: "/firewall",
    install: "pip install bonanza-agents",
  },
  forkdoctor: {
    name: "Fork Doctor",
    tag: "Repo Health Checker",
    desc: "13 automated checks for any GitHub repo — CI/CD, security, SBOM, Dev Containers. Diagnose and fix in seconds.",
    emoji: "🩺",
    link: "/#fork-doctor",
    install: "pip install fork-doctor",
  },
  frameforge: {
    name: "FrameForge",
    tag: "AI Video Generator",
    desc: "Script → Voiceover → Video. Type a topic, pick a style, get a polished MP4 in minutes.",
    emoji: "🎬",
    link: "/#frameforge",
    install: "pip install bonanza-labs[video]",
  },
  search: {
    name: "Bonanza Search",
    tag: "Agent Search Layer",
    desc: "Search and extract from any source. A simple open source search/extract layer for agents.",
    emoji: "🔍",
    link: "/#search",
    install: "pip install bonanza-labs",
  },
  intel: {
    name: "Bonanza Intel",
    tag: "Competitive Intelligence",
    desc: "Track competitors, monitor changes, and get AI-powered insights — automatically.",
    emoji: "📡",
    link: "/intel",
    install: "pip install bonanza-labs",
  },
  prompts: {
    name: "Prompt Library",
    tag: "Weekly AI Prompts",
    desc: "Curated, ready-to-use AI prompts updated weekly. Copy, paste, and get better results from any AI tool.",
    emoji: "✨",
    link: "/prompts",
    install: "pip install bonanza-labs",
  },
};

function getResult(scores: Record<string, number>): string {
  let maxScore = 0;
  let topTool = "firewall";
  for (const [tool, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      topTool = tool;
    }
  }
  return topTool;
}

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = questions[step];

  function handleSelect(optionIndex: number) {
    setSelectedOption(optionIndex);
    const option = currentQuestion.options[optionIndex];
    const newScores = { ...scores };
    for (const [tool, score] of Object.entries(option.scores)) {
      newScores[tool] = (newScores[tool] || 0) + score;
    }
    setScores(newScores);

    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(step + 1);
        setSelectedOption(null);
      } else {
        setFinished(true);
      }
    }, 400);
  }

  function reset() {
    setStep(0);
    setScores({});
    setFinished(false);
    setSelectedOption(null);
  }

  const resultTool = finished ? getResult(scores) : null;
  const result = resultTool ? toolInfo[resultTool] : null;

  // Get top 3 results
  const topResults = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([tool]) => toolInfo[tool]);

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
        <div className="max-w-2xl mx-auto">
          {!finished ? (
            <>
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-white/40 mb-2">
                  <span>Question {step + 1} of {questions.length}</span>
                  <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f7931a] to-[#ff6b35] rounded-full transition-all duration-500"
                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h1 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
                {currentQuestion.question}
              </h1>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
                      selectedOption === i
                        ? "border-[#f7931a] bg-[#f7931a]/10 scale-[0.98]"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    <span className="text-base md:text-lg">{option.text}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Result */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">{result?.emoji}</div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Perfect Tool</h1>
                <p className="text-white/50">Based on your answers, we recommend:</p>
              </div>

              {/* Main result card */}
              <div className="border border-[#f7931a]/30 bg-[#f7931a]/5 rounded-2xl p-8 mb-6 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-[#f7931a] mb-2">{result?.tag}</div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">{result?.emoji} {result?.name}</h2>
                <p className="text-white/70 mb-6 leading-relaxed">{result?.desc}</p>
                <div className="bg-black/40 rounded-lg p-3 mb-6">
                  <code className="text-[#f7931a] text-sm">{result?.install}</code>
                </div>
                <a
                  href={result?.link}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f7931a] to-[#ff6b35] text-white font-semibold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
                >
                  Learn More →
                </a>
              </div>

              {/* Other matches */}
              {topResults.length > 1 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-white/70">Also relevant for you:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topResults.slice(1).map((tool) => (
                      <a
                        key={tool.name}
                        href={tool.link}
                        className="border border-white/10 bg-white/5 rounded-xl p-4 hover:border-white/20 transition"
                      >
                        <div className="text-xl mb-1">{tool.emoji}</div>
                        <div className="font-semibold">{tool.name}</div>
                        <div className="text-sm text-white/50">{tool.tag}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Restart */}
              <div className="text-center mt-8">
                <button
                  onClick={reset}
                  className="text-white/40 hover:text-white transition text-sm underline"
                >
                  Retake quiz
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}