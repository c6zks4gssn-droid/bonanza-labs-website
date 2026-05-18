"""App templates — pre-built starting points for common app types."""

from pathlib import Path


# ── GPT Image 2 Studio Template ──────────────────────────────────────────────

GPT_IMAGE_STUDIO_TEMPLATE = """
"use client";
import { useState } from "react";

const STYLES = [
  { id: "photo", label: "Photorealistic", prompt: "photorealistic, real photograph, natural lighting" },
  { id: "3d", label: "3D Render", prompt: "3D render, octane render, studio lighting" },
  { id: "watercolor", label: "Watercolor", prompt: "hand-painted watercolor illustration, soft outlines" },
  { id: "comic", label: "Comic Strip", prompt: "comic-style illustration, bold outlines, panel layout" },
  { id: "infographic", label: "Infographic", prompt: "clean infographic, data visualization, labeled diagrams" },
  { id: "ad", label: "Ad Creative", prompt: "polished campaign image, fashion photography, brand aesthetic" },
  { id: "mockup", label: "UI Mockup", prompt: "realistic mobile app UI mockup, production-quality interface" },
  { id: "logo", label: "Logo", prompt: "clean vector logo, strong silhouette, flat design, scalable" },
];

const QUALITIES = [
  { id: "low", label: "Fast", desc: "Low latency, good quality" },
  { id: "medium", label: "Balanced", desc: "Best quality/speed ratio" },
  { id: "high", label: "Premium", desc: "Maximum fidelity, text-heavy images" },
];

export default function GPTImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photo");
  const [quality, setQuality] = useState("medium");
  const [size, setSize] = useState("1024x1024");
  const [images, setImages] = useState([]);
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    const styleObj = STYLES.find(s => s.id === style);
    const fullPrompt = `${prompt}. ${styleObj?.prompt || ""}`;
    setTimeout(() => {
      setImages(prev => [...prev, { id: Date.now(), prompt: fullPrompt, style, quality, size }]);
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          <span className="font-bold">GPT Image 2 Studio</span>
        </div>
      </nav>
      <div className="flex h-[calc(100vh-64px)]">
        <aside className="w-80 border-r border-white/10 p-4 flex flex-col gap-4 overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 uppercase">Prompt</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} placeholder="Describe what you want..." className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Style</label>
            <div className="mt-1 grid grid-cols-2 gap-1">
              {STYLES.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)} className={`px-2 py-1.5 rounded text-xs ${style === s.id ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}>{s.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Quality</label>
            <div className="mt-1 flex gap-1">
              {QUALITIES.map(q => (
                <button key={q.id} onClick={() => setQuality(q.id)} className={`flex-1 px-2 py-1.5 rounded text-xs ${quality === q.id ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}>{q.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase">Size</label>
            <select value={size} onChange={e => setSize(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">
              <option value="1024x1024">Square (1024x1024)</option>
              <option value="1024x1536">Portrait (1024x1536)</option>
              <option value="1536x1024">Landscape (1536x1024)</option>
              <option value="2560x1440">2K/QHD (2560x1440)</option>
              <option value="3840x2160">4K/UHD (3840x2160)</option>
            </select>
          </div>
          <button onClick={generate} disabled={generating || !prompt.trim()} className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium disabled:opacity-50">
            {generating ? "⏳ Generating..." : "✨ Generate"}
          </button>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400">
            <p className="font-medium text-gray-300 mb-1">💡 Pro Tips</p>
            <ul className="space-y-1 list-disc pl-4">
              <li>Be specific: materials, textures, lighting</li>
              <li>Use "photorealistic" for real photos</li>
              <li>Put text in QUOTES for accuracy</li>
              <li>Quality=high for text/infographics</li>
              <li>Iterate with small changes</li>
            </ul>
          </div>
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map(img => (
              <div key={img.id} className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex flex-col items-center justify-center border border-white/10 hover:border-blue-500/50 transition cursor-pointer">
                <span className="text-4xl mb-2">🎨</span>
                <p className="text-xs text-gray-400 text-center px-4 line-clamp-2">{img.prompt.slice(0, 60)}...</p>
                <p className="text-xs text-gray-500 mt-1">{img.style} · {img.quality} · {img.size}</p>
              </div>
            ))}
            {images.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <span className="text-6xl mb-4">🎨</span>
                <p className="text-lg font-medium">Describe what you want to create</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
"""


# ── Faceless Content Creator Template ───────────────────────────────────────

FACELESS_TEMPLATE = """
import Image from "next/image";
import { useState } from "react";

const niches = [
  { name: "Finance", cpm: "$15-25", emoji: "💰", color: "from-emerald-500 to-green-600" },
  { name: "Health", cpm: "$10-20", emoji: "🏋️", color: "from-rose-500 to-pink-600" },
  { name: "Tech", cpm: "$8-15", emoji: "💻", color: "from-blue-500 to-indigo-600" },
  { name: "Motivation", cpm: "$5-12", emoji: "🔥", color: "from-amber-500 to-orange-600" },
  { name: "Education", cpm: "$7-15", emoji: "📚", color: "from-violet-500 to-purple-600" },
  { name: "Travel", cpm: "$6-14", emoji: "✈️", color: "from-cyan-500 to-teal-600" },
];

const sampleTopics = {
  Finance: ["passive income ideas", "stock market tips", "crypto explained", "budgeting hacks"],
  Health: ["morning routines", "mental health tips", "workout hacks", "nutrition facts"],
  Tech: ["AI tools 2026", "coding tutorials", "app reviews", "productivity hacks"],
  Motivation: ["stoic quotes", "success stories", "daily motivation", "habits of winners"],
  Education: ["science facts", "history uncovered", "psychology tricks", "study hacks"],
  Travel: ["hidden destinations", "travel hacks", "budget travel", "digital nomad life"],
};

export default function FacelessStudio() {
  const [step, setStep] = useState(1);
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState("af_heart");
  const [format, setFormat] = useState("9:16");
  const [generating, setGenerating] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setScript(`Hook: Stop scrolling 🛑

Did you know that ${topic} could change your life?

Here's the truth nobody tells you:

[KEY POINT 1]
Most people miss this because it's counterintuitive.

[KEY POINT 2]
Here's what the experts don't want you to know:

[KEY POINT 3]
This is why it works:

Save this and follow for more 🔥`);
      setGenerating(false);
      setVideoReady(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎬</span>
            <div>
              <h1 className="text-xl font-bold">Faceless Content Studio</h1>
              <p className="text-xs text-gray-500">AI-powered video creation pipeline</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30">
            Step {step} of 3
          </span>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? "bg-blue-500" : "bg-white/10"}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Choose Your Niche</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {niches.map((n) => (
                  <button
                    key={n.name}
                    onClick={() => setSelectedNiche(n.name)}
                    className={`p-4 rounded-xl border text-left transition ${
                      selectedNiche === n.name
                        ? "bg-white/10 border-blue-500"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className="text-2xl">{n.emoji}</span>
                    <div className="mt-2 font-medium">{n.name}</div>
                    <div className="text-xs text-gray-400">{n.cpm} CPM</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Or Enter a Topic</h2>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. AI tools that save 10 hours per week"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 text-white"
              />
            </div>

            <button
              onClick={() => selectedNiche && setStep(2)}
              disabled={!selectedNiche && !topic.trim()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Customize Your Video</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Voice</label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <option value="af_heart">Aria (Female)</option>
                  <option value="af_nicole">Nicole (Female)</option>
                  <option value="am_adam">Adam (Male)</option>
                  <option value="am_michael">Michael (Male)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Format</label>
                <div className="flex gap-2">
                  {["9:16", "16:9", "1:1"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`flex-1 py-3 rounded-xl border ${
                        format === f ? "bg-blue-600 border-blue-500" : "bg-white/5 border-white/10"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {sampleTopics[selectedNiche] && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Sample Topics for {selectedNiche}</label>
                <div className="flex flex-wrap gap-2">
                  {sampleTopics[selectedNiche].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        topic === t ? "bg-blue-600" : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl">
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating || !topic.trim()}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium disabled:opacity-50"
              >
                {generating ? "⏳ Generating Script..." : "✨ Generate Script"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Your Script</h2>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 font-mono text-sm"
            />

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl">
                ← Edit
              </button>
              <button
                onClick={() => alert("Video generation would start here!")}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium"
              >
                🎬 Generate Video
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"""


# ── TikTok Slideshow Template ────────────────────────────────────────────────

TIKTOK_SLIDESHOW_TEMPLATE = """
"use client";
import { useState } from "react";

const sampleSlides = [
  { hook: "Stop scrolling 🛑", image: "🎨", bg: "from-rose-600 to-pink-700" },
  { hook: "This changed everything", image: "💡", bg: "from-amber-600 to-orange-700" },
  { hook: "3 tools you need", image: "🔧", bg: "from-blue-600 to-indigo-700" },
  { hook: "Save this for later", image: "📌", bg: "from-emerald-600 to-green-700" },
  { hook: "Follow for more 🚀", image: "⭐", bg: "from-violet-600 to-purple-700" },
];

export default function TikTokSlideshow() {
  const [slides, setSlides] = useState(sampleSlides);
  const [current, setCurrent] = useState(0);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      const newSlides = [
        { hook: `Stop scrolling 🛑`, image: "🎯", bg: "from-rose-600 to-pink-700" },
        { hook: `${topic} in 5 slides`, image: "📋", bg: "from-cyan-600 to-blue-700" },
        { hook: "The secret nobody tells you", image: "🤫", bg: "from-amber-600 to-orange-700" },
        { hook: "This is why it works", image: "💡", bg: "from-emerald-600 to-green-700" },
        { hook: "Save + Follow for more 🔥", image: "📌", bg: "from-violet-600 to-purple-700" },
      ];
      setSlides(newSlides);
      setCurrent(0);
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📱</span>
          <span className="font-bold">TikTok Slideshow Studio</span>
        </div>
        <span className="text-xs text-gray-500">Powered by GPT Image 2 + Codex</span>
      </nav>

      <div className="flex h-[calc(100vh-64px)]">
        <aside className="w-72 border-r border-white/10 p-4 flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI tools, budget hacks..."
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !topic.trim()}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {generating ? "⏳ Generating..." : "✨ Generate Slides"}
          </button>

          <div className="flex-1 overflow-y-auto">
            <h3 className="text-xs text-gray-500 uppercase mb-2">Slides ({slides.length})</h3>
            {slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-full text-left p-2 rounded-lg mb-1 text-sm transition ${
                  i === current ? "bg-white/10 border border-white/20" : "hover:bg-white/5"
                }`}
              >
                <span className="mr-1">{slide.image}</span> {slide.hook}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-gray-400">Platforms</p>
            <div className="flex gap-1 mt-1">
              {["TikTok", "Instagram", "Pinterest"].map((p) => (
                <span key={p} className="text-xs px-2 py-0.5 rounded bg-white/10">{p}</span>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center p-8">
          <div className="relative">
            <div className="w-[280px] h-[560px] bg-black rounded-[2.5rem] border-4 border-gray-800 overflow-hidden shadow-2xl">
              <div className="h-full flex flex-col">
                <div className="flex justify-between px-4 py-2 text-xs text-white/60">
                  <span>9:41</span>
                  <span>●●●</span>
                </div>
                <div className={`flex-1 bg-gradient-to-br ${slides[current]?.bg || "from-gray-800 to-gray-900"} flex flex-col items-center justify-center p-6`}>
                  <span className="text-6xl mb-4">{slides[current]?.image || "🎨"}</span>
                  <p className="text-xl font-bold text-center">{slides[current]?.hook || "Slide"}</p>
                </div>
                <div className="px-4 py-3 flex justify-between items-center bg-black/50">
                  <span className="text-xs text-white/60">@yourbrand</span>
                  <div className="flex gap-2">
                    {slides.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === current ? "bg-white" : "bg-white/30"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button onClick={() => setCurrent(Math.max(0, current - 1))} className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">← Prev</button>
              <span className="px-4 py-2 text-sm text-gray-400">{current + 1}/{slides.length}</span>
              <button onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))} className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">Next →</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
"""


# ── SaaS Dashboard Template ──────────────────────────────────────────────────

SAAS_TEMPLATE = """
"use client";
import { useState } from "react";

export default function SaaSDashboard() {
  const [period, setPeriod] = useState("30d");

  const metrics = [
    { label: "MRR", value: "$12,450", change: "+12.3%", up: true },
    { label: "Active Users", value: "2,847", change: "+8.1%", up: true },
    { label: "Churn Rate", value: "2.1%", change: "-0.3%", up: true },
    { label: "LTV", value: "$438", change: "+15.2%", up: true },
  ];

  const revenueData = [35, 45, 42, 50, 55, 60, 58, 65, 70, 68, 75, 82];
  const max = Math.max(...revenueData);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">B</div>
          <span className="font-bold">BonanzaSaaS</span>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs ${period === p ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}>{p}</button>
          ))}
        </div>
      </nav>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400">{m.label}</p>
              <p className="text-2xl font-bold mt-1">{m.value}</p>
              <p className={`text-xs mt-1 ${m.up ? "text-green-400" : "text-red-400"}`}>{m.change}</p>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-4">Revenue Trend</h3>
          <div className="flex items-end gap-1 h-40">
            {revenueData.map((v, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-blue-500/20 to-blue-500/60 rounded-t" style={{ height: `${(v / max) * 100}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Jan</span><span>Dec</span>
          </div>
        </div>
      </div>
    </div>
  );
}
"""


# ── Portfolio Template ────────────────────────────────────────────────────────

PORTFOLIO_TEMPLATE = """
"use client";
import { useState } from "react";

const projects = [
  { name: "Fork Doctor", desc: "AI-powered repo forking and PR creation", tech: ["Python", "AI", "GitHub"], emoji: "🍴", url: "#" },
  { name: "FrameForge", desc: "AI video generation from scripts", tech: ["Python", "Manim", "TTS"], emoji: "🎬", url: "#" },
  { name: "Bonanza Polybot", desc: "Polymarket trading bot with AI signals", tech: ["Python", "Polymarket", "AI"], emoji: "🎯", url: "#" },
  { name: "App Forge", desc: "Visual idea to working app generator", tech: ["Next.js", "GPT-4", "Tailwind"], emoji: "🛠️", url: "#" },
];

const skills = ["Python", "JavaScript", "React", "Next.js", "AI/ML", "GitHub API", "Node.js", "Tailwind"];

export default function Portfolio() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 mx-auto mb-6 flex items-center justify-center text-3xl font-bold">B</div>
          <h1 className="text-3xl font-bold">Bonanza Labs</h1>
          <p className="text-gray-400 mt-2">Building AI-powered tools that actually work</p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {skills.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-white/10 text-xs">{s}</span>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6">Projects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <a
              key={p.name}
              href={p.url}
              onMouseEnter={() => setHovered(p.name)}
              onMouseLeave={() => setHovered(null)}
              className={`p-5 rounded-xl border transition ${
                hovered === p.name ? "bg-white/10 border-blue-500/50" : "bg-white/5 border-white/10"
              }`}
            >
              <span className="text-3xl">{p.emoji}</span>
              <h3 className="font-bold mt-3">{p.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{p.desc}</p>
              <div className="flex gap-1 mt-3 flex-wrap">
                {p.tech.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/10">{t}</span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-16 text-gray-500 text-sm">
          Built with AI agents. Deployed with Vercel. Powered by Bonanza Labs.
        </div>
      </div>
    </div>
  );
}
"""


# ── Template Registry ────────────────────────────────────────────────────────

TEMPLATES = {
    "gpt-image-studio": {
        "name": "GPT Image 2 Studio",
        "description": "Generate, edit, and iterate on images with GPT Image 2. Infographics, mockups, ads, storyboards, character sheets.",
        "code": GPT_IMAGE_STUDIO_TEMPLATE,
    },
    "tiktok-slideshow": {
        "name": "TikTok Slideshow Studio",
        "description": "Viral TikTok slideshow creator: hook slides + image generation + multi-platform export",
        "code": TIKTOK_SLIDESHOW_TEMPLATE,
    },
    "faceless": {
        "name": "Faceless Content Studio",
        "description": "Turn any topic into a faceless video. Script → Voice → Video for YouTube/TikTok/Instagram.",
        "code": FACELESS_TEMPLATE,
    },
    "saas-dashboard": {
        "name": "SaaS Dashboard",
        "description": "MRR tracker with metrics, charts, and cohort analysis. For SaaS founders who want to track their numbers.",
        "code": SAAS_TEMPLATE,
    },
    "portfolio": {
        "name": "Developer Portfolio",
        "description": "Showcase your projects and skills. Clean, minimal, deploy-and-go.",
        "code": PORTFOLIO_TEMPLATE,
    },
}


def get_template(name: str):
    """Get a template by name."""
    return TEMPLATES.get(name)
