"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Phone, Play, RotateCcw, Send, Square, User } from "lucide-react";
import ChatLog, { type ChatItem } from "./ChatLog";
import { buildSummary, buildTranscript, QUESTIONS, SCENARIOS, type Line, type VoiceAnswers, type VoiceSummary } from "@/lib/demos/voice-demo";

const empty: VoiceAnswers = { naam: "", plaats: "", klus: "", probleem: "", urgentie: "", terugbelmoment: "" };
const toItem = (l: Line): ChatItem => ({ me: l.speaker === "beller", text: l.text, srLabel: l.speaker === "beller" ? "Beller" : "Assistent" });
type SpeechSupport = "checking" | "ok" | "no-voice" | "unsupported";

export default function VoiceDemo() {
  const [mode, setMode] = useState<"kies" | "zelf">("kies");
  const [active, setActive] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [summary, setSummary] = useState<VoiceSummary | null>(null);
  const [running, setRunning] = useState(false);
  const [typing, setTyping] = useState(false);
  const [speak, setSpeak] = useState(false);
  const [speech, setSpeech] = useState<SpeechSupport>("checking");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<VoiceAnswers>(empty);
  const [input, setInput] = useState("");
  const timers = useRef<number[]>([]);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") { setSpeech("unsupported"); return; }
    const pick = () => {
      const v = window.speechSynthesis.getVoices();
      const nl = v.find((x) => x.lang?.toLowerCase().replace("_", "-") === "nl-nl") || v.find((x) => x.lang?.toLowerCase().startsWith("nl"));
      voice.current = nl ?? null;
      if (nl) setSpeech("ok");
      else if (v.length) setSpeech("no-voice");
    };
    pick();
    window.speechSynthesis.addEventListener?.("voiceschanged", pick);
    const t = window.setTimeout(() => setSpeech((s) => (s === "checking" ? "no-voice" : s)), 1500);
    return () => { window.clearTimeout(t); window.speechSynthesis.removeEventListener?.("voiceschanged", pick); };
  }, []);
  useEffect(() => () => clearAll(), []);

  function say(text: string) {
    if (!speak || speech !== "ok" || !voice.current) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice.current.lang;
    u.voice = voice.current;
    window.speechSynthesis.speak(u);
  }

  function clearAll() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function stop() {
    clearAll();
    setRunning(false);
    setTyping(false);
  }

  function reset() {
    stop();
    setLines([]);
    setSummary(null);
    setStep(0);
    setAnswers(empty);
    setInput("");
    setActive(null);
  }

  function finish(s: VoiceSummary) {
    setSummary(s);
    window.setTimeout(() => summaryRef.current?.focus({ preventScroll: window.innerWidth >= 1024 }), 50);
  }

  function playScenario(id: string, a: VoiceAnswers) {
    reset();
    setMode("kies");
    setActive(id);
    setRunning(true);
    const all = buildTranscript(a);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let delay = 200;
    all.forEach((l, i) => {
      if (l.speaker === "assistent") timers.current.push(window.setTimeout(() => setTyping(true), delay));
      delay += reduce ? 120 : speak ? Math.max(1800, l.text.length * 65) : 700 + Math.min(l.text.length * 6, 700);
      timers.current.push(
        window.setTimeout(() => {
          setTyping(false);
          setLines((prev) => [...prev, l]);
          say(l.text);
          if (i === all.length - 1) { setRunning(false); finish(buildSummary(a)); }
        }, delay),
      );
    });
  }

  function startSelf() {
    reset();
    setMode("zelf");
    const first: Line = { speaker: "assistent", text: QUESTIONS[0].ask };
    setLines([first]);
    say(first.text);
    window.setTimeout(() => inputRef.current?.focus(), 30);
  }

  function answer(value: string) {
    if (step >= QUESTIONS.length || typing) return;
    const q = QUESTIONS[step];
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    setLines((p) => [...p, { speaker: "beller", text: value.trim() || "(geen antwoord)" }]);
    setInput("");
    setTyping(true);
    const reply: Line = step + 1 < QUESTIONS.length ? { speaker: "assistent", text: QUESTIONS[step + 1].ask } : buildTranscript(next).at(-1)!;
    const last = step + 1 >= QUESTIONS.length;
    setStep(step + 1);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(window.setTimeout(() => {
      setTyping(false);
      setLines((p) => [...p, reply]);
      say(reply.text);
      if (last) finish(buildSummary(next));
      else inputRef.current?.focus();
    }, reduce ? 120 : 700));
  }

  const exampleValue = mode === "zelf" && step < QUESTIONS.length ? QUESTIONS[step].placeholder.replace(/^Bijv\.\s*/, "") : "";

  return (
    <div className="dm-grid">
      <div className="dm-card">
        <div className="dm-head">
          <div><p className="dm-title">Installatiebedrijf Voorbeeld (fictief)</p><p className="dm-sub">Telefoongesprek als tekst · voorbeeldgegevens</p></div>
          <button type="button" onClick={() => (mode === "zelf" ? startSelf() : reset())} className="dm-btn ghost sm" disabled={lines.length === 0 && !running} data-testid="restart"><RotateCcw className="h-4 w-4" aria-hidden /> Opnieuw beginnen</button>
        </div>

        <p className="mt-4 text-sm" id="voice-pick">Kies een voorbeeldgesprek of speel zelf de beller:</p>
        <div className="dm-scen" role="group" aria-labelledby="voice-pick">
          {SCENARIOS.map((s) => (
            <button key={s.id} type="button" disabled={running} aria-pressed={active === s.id} onClick={() => playScenario(s.id, s.answers)} className="dm-chip" data-testid={`scenario-${s.id}`}>
              <Play className="h-4 w-4" aria-hidden /> {s.label}
            </button>
          ))}
        </div>
        <div className="dm-actions">
          <button type="button" onClick={startSelf} disabled={running} aria-pressed={mode === "zelf"} className="dm-chip" data-testid="self"><Phone className="h-4 w-4" aria-hidden /> Zelf de beller zijn</button>
          {running && <button type="button" onClick={stop} className="dm-btn ghost sm"><Square className="h-4 w-4" aria-hidden /> Stop</button>}
        </div>
        <div className="mt-3">
          <label className="dm-toggle">
            <input type="checkbox" checked={speak && speech === "ok"} disabled={speech !== "ok"} onChange={(e) => setSpeak(e.target.checked)} aria-describedby="voice-tts-note" data-testid="tts" />
            Voorlezen (browserstem)
          </label>
          <p id="voice-tts-note" className="text-xs" data-testid="tts-note">
            {speech === "ok" ? "Gebruikt de Nederlandse stem van uw browser; dat is niet de stem van Bonanza Voice." : speech === "checking" ? "Bezig met controleren of uw browser kan voorlezen…" : speech === "unsupported" ? "Voorlezen is niet beschikbaar: deze browser ondersteunt geen spraak." : "Voorlezen is niet beschikbaar: deze browser heeft geen Nederlandse stem."}
          </p>
        </div>

        <ChatLog
          items={lines.map(toItem)}
          typing={typing}
          label="Gespreksverslag"
          typingLabel="Assistent praat…"
          meIcon={<User className="h-4 w-4" />}
          otherIcon={<Bot className="h-4 w-4" />}
          empty={<p className="dm-empty"><Phone className="h-4 w-4" aria-hidden /> Kies een voorbeeldgesprek of speel zelf de beller.</p>}
        />

        {mode === "zelf" && step < QUESTIONS.length && (
          <>
            <form onSubmit={(e) => { e.preventDefault(); answer(input); }} className="dm-form">
              <label htmlFor="voice-answer" className="sr-only">Uw antwoord als beller</label>
              <input ref={inputRef} id="voice-answer" value={input} onChange={(e) => setInput(e.target.value)} placeholder={QUESTIONS[step].placeholder} maxLength={160} className="dm-input" autoComplete="off" enterKeyHint="send" />
              <button type="submit" className="dm-btn" disabled={typing}><Send className="h-4 w-4" aria-hidden /> Antwoord</button>
            </form>
            <div className="dm-chips">
              <button type="button" className="dm-chip" disabled={typing} onClick={() => answer(exampleValue)} data-testid="use-example">Gebruik voorbeeld: {exampleValue}</button>
            </div>
          </>
        )}
      </div>

      <aside className="dm-side" aria-labelledby="voice-sum-title">
        <p id="voice-sum-title" className="dm-eyebrow">Samenvatting voor de installateur</p>
        {!summary ? (
          <p className="mt-3 text-sm">Na het gesprek verschijnt hier de samenvatting die de installateur zou ontvangen.</p>
        ) : (
          <div ref={summaryRef} tabIndex={-1} role="status" aria-label="Samenvatting klaar" data-testid="voice-summary">
            <dl>
              {([
                ["Naam", summary.naam],
                ["Adres / plaats", summary.plaats],
                ["Type klus", summary.typeKlus],
                ["Omschrijving", summary.omschrijving],
                ["Urgentie (zoals de beller aangeeft)", summary.urgentie],
                ["Gewenst terugbelmoment", summary.terugbelmoment],
                ["Voorgestelde vervolgstap", summary.vervolg],
              ] as const).map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
        )}
        <p className="dm-note">Demo met voorbeeldgegevens. Er wordt niets opgeslagen of verstuurd. De assistent zegt geen prijs of planning toe en beoordeelt geen urgentie; een medewerker belt terug.</p>
      </aside>
    </div>
  );
}
