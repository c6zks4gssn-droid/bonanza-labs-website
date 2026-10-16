"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck, RotateCcw, Send, Store, User } from "lucide-react";
import ChatLog, { type ChatItem } from "./ChatLog";
import { initialState, respond, RESTAURANT, type Reply } from "@/lib/demos/serveflow-demo";

const WELCOME = "Welkom bij De Voorbeeldkeuken! Ik kan een tafel voor u reserveren of vragen beantwoorden over openingstijden, het menu en allergenen.";
const CHIPS: { label: string; text: string }[] = [
  { label: "Tafel reserveren", text: "Ik wil een tafel reserveren" },
  { label: "Openingstijden", text: "Wat zijn jullie openingstijden?" },
  { label: "Menu", text: "Wat staat er op het menu?" },
  { label: "Allergenen", text: "Welke allergenen zitten in de gerechten?" },
];
const wrap = (me: boolean, text: string): ChatItem => ({ me, text, srLabel: me ? "U" : "Restaurant" });

export default function ServeFlowDemo() {
  const [msgs, setMsgs] = useState<ChatItem[]>([wrap(false, WELCOME)]);
  const [state, setState] = useState(initialState());
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [conf, setConf] = useState<Reply["confirmation"]>();
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function send(text: string, focus = true) {
    const clean = text.trim();
    if (!clean || typing) return;
    const r = respond(clean, state);
    setMsgs((m) => [...m, wrap(true, clean)]);
    setInput("");
    setTyping(true);
    setState(r.state);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(() => {
      setMsgs((m) => [...m, wrap(false, r.text)]);
      setTyping(false);
      if (r.confirmation) setConf(r.confirmation);
      if (focus) inputRef.current?.focus();
    }, reduce ? 150 : 650 + Math.min(r.text.length * 4, 600));
  }

  function reset() {
    window.clearTimeout(timer.current);
    setMsgs([wrap(false, WELCOME)]);
    setState(initialState());
    setConf(undefined);
    setTyping(false);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div className="dm-grid">
      <div className="dm-card">
        <div className="dm-head">
          <div><p className="dm-title">{RESTAURANT}</p><p className="dm-sub">Chat · voorbeeldgegevens</p></div>
          <button type="button" onClick={reset} className="dm-btn ghost sm" data-testid="restart"><RotateCcw className="h-4 w-4" aria-hidden /> Opnieuw beginnen</button>
        </div>
        <ChatLog items={msgs} typing={typing} label="Chatgesprek met het restaurant" typingLabel="Restaurant typt…" meIcon={<User className="h-4 w-4" />} otherIcon={<Store className="h-4 w-4" />} />
        <div className="dm-chips" role="group" aria-label="Snelle vragen">
          {CHIPS.map((c) => (
            <button key={c.label} type="button" disabled={typing} onClick={() => send(c.text)} className="dm-chip">{c.label}</button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="dm-form">
          <label htmlFor="serveflow-input" className="sr-only">Uw bericht</label>
          <input ref={inputRef} id="serveflow-input" value={input} onChange={(e) => setInput(e.target.value)} maxLength={200} placeholder="Bijv. zaterdag om 19:00 met 4 personen" className="dm-input" autoComplete="off" enterKeyHint="send" />
          <button type="submit" className="dm-btn" disabled={typing || !input.trim()}><Send className="h-4 w-4" aria-hidden /> Stuur</button>
        </form>
      </div>

      <aside className="dm-side" aria-labelledby="sf-conf-title">
        <p id="sf-conf-title" className="dm-eyebrow">Reserveringsbevestiging</p>
        {!conf ? (
          <p className="mt-3 text-sm">Rond een reservering af in de chat. Hier ziet u dan de bevestiging die de gast zou krijgen.</p>
        ) : (
          <div className="mt-3" data-testid="serveflow-confirmation" role="status">
            <CalendarCheck className="h-8 w-8" style={{ color: "#087b63" }} aria-hidden />
            <dl>
              <div><dt>Naam</dt><dd>{conf.name}</dd></div>
              <div><dt>Datum</dt><dd>{conf.label}</dd></div>
              <div><dt>Tijd</dt><dd>{conf.time}</dd></div>
              <div><dt>Personen</dt><dd>{conf.persons}</dd></div>
              <div><dt>Code</dt><dd className="font-mono">{conf.code}</dd></div>
            </dl>
          </div>
        )}
        <p className="dm-note">Demo met voorbeeldgegevens en een fictief restaurant. Er wordt niets gereserveerd, opgeslagen of verstuurd.</p>
      </aside>
    </div>
  );
}
