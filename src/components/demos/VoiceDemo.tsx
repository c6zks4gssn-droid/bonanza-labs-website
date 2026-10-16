"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Play, RotateCcw, Square, User, Bot } from "lucide-react";
import { buildSummary, buildTranscript, QUESTIONS, SCENARIOS, type Line, type VoiceAnswers, type VoiceSummary } from "@/lib/demos/voice-demo";

const empty: VoiceAnswers = { naam: "", plaats: "", klus: "", probleem: "", urgentie: "", terugbelmoment: "" };

export default function VoiceDemo() {
  const [mode, setMode] = useState<"kies" | "zelf">("kies");
  const [lines, setLines] = useState<Line[]>([]);
  const [summary, setSummary] = useState<VoiceSummary | null>(null);
  const [running, setRunning] = useState(false);
  const [speak, setSpeak] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<VoiceAnswers>(empty);
  const [input, setInput] = useState("");
  const timers = useRef<number[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [lines, summary]);
  useEffect(() => () => stop(), []);

  function say(text: string) {
    if (!speak || !canSpeak) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "nl-NL";
    window.speechSynthesis.speak(u);
  }

  function stop() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setRunning(false);
  }

  function reset() {
    stop();
    setLines([]);
    setSummary(null);
    setStep(0);
    setAnswers(empty);
    setInput("");
  }

  function playScenario(a: VoiceAnswers) {
    reset();
    setRunning(true);
    const all = buildTranscript(a);
    let delay = 300;
    all.forEach((l, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setLines((prev) => [...prev, l]);
          say(l.text);
          if (i === all.length - 1) {
            setSummary(buildSummary(a));
            setRunning(false);
          }
        }, delay),
      );
      delay += speak ? Math.max(1800, l.text.length * 65) : 1100;
    });
  }

  function startSelf() {
    reset();
    setMode("zelf");
    const first: Line = { speaker: "assistent", text: QUESTIONS[0].ask };
    setLines([first]);
    say(first.text);
  }

  function submitSelf(e: React.FormEvent) {
    e.preventDefault();
    if (step >= QUESTIONS.length) return;
    const q = QUESTIONS[step];
    const next = { ...answers, [q.key]: input };
    setAnswers(next);
    const newLines: Line[] = [{ speaker: "beller", text: input.trim() || "(geen antwoord)" }];
    if (step + 1 < QUESTIONS.length) newLines.push({ speaker: "assistent", text: QUESTIONS[step + 1].ask });
    else newLines.push(buildTranscript(next).at(-1)!);
    setLines((p) => [...p, ...newLines]);
    say(newLines[newLines.length - 1].text);
    setInput("");
    setStep(step + 1);
    if (step + 1 >= QUESTIONS.length) setSummary(buildSummary(next));
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Kies een manier">
          <button type="button" onClick={() => { reset(); setMode("kies"); }} aria-pressed={mode === "kies"} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "kies" ? "bg-amber-400 text-black" : "border border-white/15"}`}>Voorbeeldgesprek</button>
          <button type="button" onClick={startSelf} aria-pressed={mode === "zelf"} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "zelf" ? "bg-amber-400 text-black" : "border border-white/15"}`}>Zelf de beller zijn</button>
          {canSpeak && (
            <label className="ml-auto inline-flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={speak} onChange={(e) => setSpeak(e.target.checked)} className="h-4 w-4" />
              Voorlezen (browserstem)
            </label>
          )}
        </div>

        {mode === "kies" && (
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {SCENARIOS.map((s) => (
              <button key={s.id} type="button" disabled={running} onClick={() => playScenario(s.answers)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-3 text-sm font-semibold hover:bg-white/5 disabled:opacity-50" data-testid={`scenario-${s.id}`}>
                <Play className="h-4 w-4" aria-hidden /> {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 h-[420px] overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-4" aria-live="polite" aria-label="Gespreksverslag">
          {lines.length === 0 && (
            <p className="flex h-full items-center justify-center text-center text-sm text-gray-400">
              <Phone className="mr-2 h-4 w-4" aria-hidden /> Kies een voorbeeldgesprek of speel zelf de beller.
            </p>
          )}
          <ul className="space-y-3">
            {lines.map((l, i) => (
              <li key={i} className={`flex gap-2 ${l.speaker === "beller" ? "justify-end" : ""}`}>
                {l.speaker === "assistent" && <Bot className="mt-1 h-5 w-5 shrink-0 text-amber-300" aria-hidden />}
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${l.speaker === "beller" ? "bg-amber-400 text-black" : "bg-white/10"}`}>
                  <span className="sr-only">{l.speaker === "beller" ? "Beller: " : "Assistent: "}</span>
                  {l.text}
                </div>
                {l.speaker === "beller" && <User className="mt-1 h-5 w-5 shrink-0 text-gray-400" aria-hidden />}
              </li>
            ))}
          </ul>
          <div ref={endRef} />
        </div>

        {mode === "zelf" && step < QUESTIONS.length && (
          <form onSubmit={submitSelf} className="mt-3 flex gap-2">
            <label htmlFor="voice-answer" className="sr-only">Uw antwoord</label>
            <input id="voice-answer" value={input} onChange={(e) => setInput(e.target.value)} placeholder={QUESTIONS[step].placeholder} maxLength={160} className="min-w-0 flex-1 rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm" autoComplete="off" />
            <button type="submit" className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black hover:bg-amber-300">Antwoord</button>
          </form>
        )}

        <div className="mt-3 flex gap-2">
          {running && <button type="button" onClick={stop} className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-sm"><Square className="h-4 w-4" aria-hidden /> Stop</button>}
          {lines.length > 0 && <button type="button" onClick={() => (mode === "zelf" ? startSelf() : reset())} className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-sm"><RotateCcw className="h-4 w-4" aria-hidden /> Opnieuw</button>}
        </div>
      </div>

      <aside className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-5 md:p-6" aria-label="Samenvatting voor de installateur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Samenvatting voor de installateur</p>
        {!summary ? (
          <p className="mt-4 text-sm text-gray-400">Na het gesprek verschijnt hier de samenvatting die de installateur zou ontvangen.</p>
        ) : (
          <dl className="mt-4 space-y-3 text-sm" data-testid="voice-summary">
            {([
              ["Naam", summary.naam],
              ["Adres / plaats", summary.plaats],
              ["Type klus", summary.typeKlus],
              ["Omschrijving", summary.omschrijving],
              ["Urgentie (zoals beller aangeeft)", summary.urgentie],
              ["Gewenst terugbelmoment", summary.terugbelmoment],
              ["Voorgestelde vervolgstap", summary.vervolg],
            ] as const).map(([k, v]) => (
              <div key={k}>
                <dt className="text-gray-400">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="mt-6 text-xs text-gray-400">Demo met voorbeeldgegevens. Er wordt niets opgeslagen of verstuurd. De assistent zegt geen prijs of planning toe; een medewerker belt terug.</p>
      </aside>
    </div>
  );
}
