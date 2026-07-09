"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, LogOut, Trash2, Sparkles } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const DEFAULT_MODEL = "glm-5.2:cloud";

export default function ByoChatPage() {
  const router = useRouter();
  const [models, setModels] = useState<string[]>([DEFAULT_MODEL]);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/byo/session")
      .then((r) => r.json())
      .then((data) => {
        setAuthed(!!data.authenticated);
        if (!data.authenticated) {
          router.replace("/byo");
        }
      });
  }, [router]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function logout() {
    await fetch("/api/byo/session", { method: "DELETE" });
    router.replace("/byo");
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || busy) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`/api/byo/chat?model=${encodeURIComponent(model)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      if (!res.ok || !res.body) {
        const txt = await res.text();
        setError(`request failed: ${res.status} ${txt}`);
        setBusy(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((cur) => [...cur, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snap = acc;
        setMessages((cur) => {
          const copy = [...cur];
          copy[copy.length - 1] = { role: "assistant", content: snap };
          return copy;
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "stream error");
    } finally {
      setBusy(false);
    }
  }

  if (authed === null) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F7F8F6] text-[#4A5361]">
        loading…
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#F7F8F6] text-[#171D26]">
      {/* Header — ForgeWith sticky pattern */}
      <header className="border-b border-[#DDE2E0] bg-[rgba(247,248,246,.88)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/byo" className="flex items-center gap-2.5">
              <span className="grid grid-cols-3 gap-0.5" aria-hidden="true">
                <span className="block h-2 w-2 rounded-sm bg-[#7C5CFF]" />
                <span className="block h-2 w-2 rounded-sm bg-[#1FA971]" />
                <span className="block h-2 w-2 rounded-sm bg-[#2E7CF6]" />
              </span>
              <span className="font-semibold tracking-tight">
                BYO<span className="font-normal">-LLM</span>
              </span>
            </Link>
            <span className="text-[#DDE2E0]">/</span>
            <span className="text-sm text-[#4A5361]">chat</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="rounded-full border border-[#DDE2E0] bg-white px-3 py-1.5 font-mono text-xs focus:border-[#7C5CFF] focus:outline-none"
            >
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <button
              onClick={() => setMessages([])}
              className="rounded-full border border-[#DDE2E0] bg-white p-2 text-[#4A5361] hover:border-[#7C5CFF] hover:text-[#171D26]"
              title="clear"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={logout}
              className="rounded-full border border-[#DDE2E0] bg-white p-2 text-[#4A5361] hover:border-[#ef4444] hover:text-[#ef4444]"
              title="sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat scroll area */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-dashed border-[#DDE2E0] bg-white p-12 text-center"
            >
              <div
                className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full"
                style={{ background: "#F1EDFF" }}
              >
                <Sparkles className="h-5 w-5" style={{ color: "#7C5CFF" }} />
              </div>
              <p className="text-base font-semibold text-[#171D26]">
                Ask anything.
              </p>
              <p className="mt-1 text-sm text-[#4A5361]">
                Your key stays server-side. Encrypted, signed, HttpOnly.
              </p>
            </motion.div>
          )}
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} content={m.content} />
          ))}
          {error && (
            <div className="rounded-2xl border border-[#ef4444]/30 bg-[#FEF2F2] px-4 py-3 text-sm text-[#ef4444]">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <form
        onSubmit={send}
        className="border-t border-[#DDE2E0] bg-white px-6 py-4"
      >
        <div className="mx-auto flex max-w-3xl gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message…"
            disabled={busy}
            className="flex-1 rounded-full border border-[#DDE2E0] bg-[#F7F8F6] px-5 py-2.5 text-sm focus:border-[#7C5CFF] focus:bg-white focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[#171D26] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2E7CF6] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

function ChatBubble({ role, content }: Msg) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-[#7C5CFF] text-white"
            : "border border-[#DDE2E0] bg-white text-[#171D26]"
        }`}
      >
        {content || <span className="animate-pulse text-[#4A5361]">▍</span>}
      </div>
    </motion.div>
  );
}
