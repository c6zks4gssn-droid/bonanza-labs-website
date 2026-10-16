"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck, RotateCcw, Send } from "lucide-react";
import { initialState, respond, RESTAURANT, type Reply } from "@/lib/demos/serveflow-demo";

type Msg = { from: "gast" | "restaurant"; text: string };
const welcome: Msg = { from: "restaurant", text: "Welkom bij De Voorbeeldkeuken! Ik kan een tafel voor u reserveren of vragen beantwoorden over openingstijden, het menu en allergenen." };
const suggestions = ["Ik wil een tafel reserveren", "Zaterdag om 19:00 met 4 personen", "Wat zijn jullie openingstijden?", "Wat kan ik eten zonder melk?", "Hebben jullie vegetarische gerechten?"];

export default function ServeFlowDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([welcome]);
  const [state, setState] = useState(initialState());
  const [input, setInput] = useState("");
  const [conf, setConf] = useState<Reply["confirmation"]>();
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), [msgs, conf]);

  function send(text: string) {
    if (!text.trim()) return;
    const r = respond(text, state);
    setMsgs((m) => [...m, { from: "gast", text }, { from: "restaurant", text: r.text }]);
    setState(r.state);
    if (r.confirmation) setConf(r.confirmation);
    setInput("");
  }

  function reset() {
    setMsgs([welcome]);
    setState(initialState());
    setConf(undefined);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold">{RESTAURANT}</p>
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-sm"><RotateCcw className="h-4 w-4" aria-hidden /> Opnieuw</button>
        </div>
        <div className="mt-4 h-[400px] overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-4" aria-live="polite" aria-label="Chatgesprek">
          <ul className="space-y-3">
            {msgs.map((m, i) => (
              <li key={i} className={`flex ${m.from === "gast" ? "justify-end" : ""}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${m.from === "gast" ? "bg-amber-400 text-black" : "bg-white/10"}`}>
                  <span className="sr-only">{m.from === "gast" ? "U: " : "Restaurant: "}</span>
                  {m.text}
                </div>
              </li>
            ))}
          </ul>
          <div ref={endRef} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Voorbeeldvragen">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white/5">{s}</button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex gap-2">
          <label htmlFor="serveflow-input" className="sr-only">Uw bericht</label>
          <input id="serveflow-input" value={input} onChange={(e) => setInput(e.target.value)} maxLength={200} placeholder="Typ uw vraag of reservering…" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm" autoComplete="off" />
          <button type="submit" className="inline-flex items-center gap-1 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black hover:bg-amber-300"><Send className="h-4 w-4" aria-hidden /> Stuur</button>
        </form>
      </div>

      <aside className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-5 md:p-6" aria-label="Reserveringsbevestiging">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Reserveringsbevestiging</p>
        {!conf ? (
          <p className="mt-4 text-sm text-gray-400">Rond een reservering af in de chat. Hier ziet u dan de bevestiging die de gast zou krijgen.</p>
        ) : (
          <div className="mt-4" data-testid="serveflow-confirmation">
            <CalendarCheck className="h-8 w-8 text-amber-300" aria-hidden />
            <dl className="mt-3 space-y-2 text-sm">
              <div><dt className="text-gray-400">Naam</dt><dd className="font-semibold">{conf.name}</dd></div>
              <div><dt className="text-gray-400">Datum</dt><dd className="font-semibold">{conf.label}</dd></div>
              <div><dt className="text-gray-400">Tijd</dt><dd className="font-semibold">{conf.time}</dd></div>
              <div><dt className="text-gray-400">Personen</dt><dd className="font-semibold">{conf.persons}</dd></div>
              <div><dt className="text-gray-400">Code</dt><dd className="font-mono font-semibold">{conf.code}</dd></div>
            </dl>
          </div>
        )}
        <p className="mt-6 text-xs text-gray-400">Demo met een fictief restaurant en voorbeeldgegevens. Er wordt niets gereserveerd, opgeslagen of verstuurd.</p>
      </aside>
    </div>
  );
}
