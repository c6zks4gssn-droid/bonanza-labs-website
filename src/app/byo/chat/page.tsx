"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, LogOut, Trash2 } from "lucide-react";

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
      // append empty assistant message that grows as we read
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
    return <div className="min-h-screen bg-black text-white p-8">loading…</div>;
  }

  return (
    <main className="flex h-screen flex-col bg-black text-white">
      <header className="flex items-center justify-between border-b border-zinc-900 px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
            bonanza labs
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm font-medium">BYO chat</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs focus:border-violet-500 focus:outline-none"
          >
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button
            onClick={() => setMessages([])}
            className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-400 hover:text-white"
            title="clear"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={logout}
            className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-400 hover:text-white"
            title="sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/30 p-8 text-center text-zinc-500"
            >
              Ask anything. Your key stays server-side.
            </motion.div>
          )}
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} content={m.content} />
          ))}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={send}
        className="border-t border-zinc-900 bg-zinc-950/60 px-6 py-4"
      >
        <div className="mx-auto flex max-w-3xl gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message…"
            disabled={busy}
            className="flex-1 rounded-lg border border-zinc-800 bg-black px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-lg bg-violet-600 px-4 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </main>
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
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-violet-600 text-white"
            : "border border-zinc-800 bg-zinc-950/60 text-zinc-100"
        }`}
      >
        {content || <span className="animate-pulse text-zinc-500">▍</span>}
      </div>
    </motion.div>
  );
}
