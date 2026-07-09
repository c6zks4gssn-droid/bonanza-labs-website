"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Cookie, Server, KeyRound, ShieldCheck } from "lucide-react";

type Step = "input" | "encrypt" | "cookie" | "proxy" | "provider";

const STEPS: { id: Step; label: string; sub: string; icon: React.ReactNode; y: number }[] = [
  { id: "input", label: "01 — paste key", sub: "ollama_…", icon: <KeyRound className="h-3.5 w-3.5" />, y: 0 },
  { id: "encrypt", label: "02 — AES-256-GCM", sub: "at rest", icon: <Lock className="h-3.5 w-3.5" />, y: 1 },
  { id: "cookie", label: "03 — HttpOnly", sub: "signed, 24h", icon: <Cookie className="h-3.5 w-3.5" />, y: 2 },
  { id: "proxy", label: "04 — server proxy", sub: "auth + stream", icon: <Server className="h-3.5 w-3.5" />, y: 3 },
  { id: "provider", label: "05 — ollama.com", sub: "Bearer header", icon: <ShieldCheck className="h-3.5 w-3.5" />, y: 4 },
];

export function Anatomy() {
  const [hovered, setHovered] = useState<Step | null>("cookie");

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 400 460"
        className="w-full"
        fill="none"
        aria-hidden="true"
      >
        {/* vertical dashed flow */}
        <line
          x1="200"
          y1="30"
          x2="200"
          y2="430"
          stroke="#3f3f46"
          strokeWidth="1"
        />
        <line
          x1="200"
          y1="30"
          x2="200"
          y2="430"
          stroke="#a3e635"
          strokeWidth="1.5"
          strokeOpacity={hovered ? "0.7" : "0"}
          className="flow-dash"
          style={{ filter: hovered ? "drop-shadow(0 0 4px #a3e635)" : undefined }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col">
        {STEPS.map((step, i) => {
          const active = hovered === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onMouseEnter={() => setHovered(step.id)}
              onMouseLeave={() => setHovered((h) => (h === step.id ? null : h))}
              onFocus={() => setHovered(step.id)}
              onBlur={() => setHovered(null)}
              className="group flex-1 flex items-center justify-between gap-3 px-2 text-left focus:outline-none"
              aria-label={step.label}
            >
              <motion.div
                animate={{
                  opacity: active ? 1 : 0.55,
                  scale: active ? 1 : 0.97,
                }}
                transition={{ duration: 0.18 }}
                className={`flex items-center gap-2 rounded-md border bg-black/80 px-3 py-2 font-mono-c text-[11px] tracking-tight transition-colors ${
                  active
                    ? "border-lime-400/60 text-bone"
                    : "border-zinc-800 text-zinc-400"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-sm ${
                    active ? "bg-lime-400 text-ink" : "bg-zinc-900 text-zinc-500"
                  }`}
                >
                  {step.icon}
                </span>
                <div className="flex flex-col leading-none">
                  <span className="font-display text-[13px] tracking-tight">
                    {step.label}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500">
                    {step.sub}
                  </span>
                </div>
              </motion.div>

              {/* node on spine */}
              <div
                className={`relative z-10 h-2 w-2 rounded-full transition-all ${
                  active
                    ? "bg-lime-400 shadow-[0_0_10px_2px_rgba(163,230,53,0.6)]"
                    : "bg-zinc-700"
                }`}
              />
            </button>
          );
        })}
      </div>

      <p className="mt-4 font-mono-c text-[10px] uppercase tracking-widest text-zinc-600">
        fig 01 — token path, browser to provider
      </p>
    </div>
  );
}
