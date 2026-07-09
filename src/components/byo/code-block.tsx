"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  lang?: string;
  caption?: string;
}

export function CodeBlock({ code, lang = "ts", caption }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <figure className="group relative overflow-hidden rounded-md border border-zinc-800 bg-ink">
      <header className="flex items-center justify-between border-b border-zinc-800 px-3 py-1.5 text-[10px] uppercase tracking-widest text-zinc-500">
        <span>{lang}</span>
        {caption && <span className="font-mono-c text-zinc-600">{caption}</span>}
        <button
          onClick={handleCopy}
          className="font-mono-c text-[10px] text-zinc-500 hover:text-bone"
          aria-label="copy code"
        >
          {copied ? <Check className="inline h-3 w-3 text-lime-400" /> : <Copy className="inline h-3 w-3" />}
        </button>
      </header>
      <pre className="overflow-x-auto p-4 font-mono-c text-[12.5px] leading-relaxed text-bone-dim">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
