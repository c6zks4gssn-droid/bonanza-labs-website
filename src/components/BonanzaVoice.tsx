"use client";

import { useEffect, useRef, useState } from "react";

const WIDGET_SCRIPT_URL = "https://unpkg.com/@elevenlabs/convai-widget-embed";
const WIDGET_AVATAR_URL = "https://www.bonanza-labs.com/logo-256.png";

/**
 * Bonanza Voice — ElevenLabs voice agent, embedded site-wide.
 *
 * The agent-id is public (auth disabled, allowlisted to bonanza-labs.com),
 * so it is safe to expose via NEXT_PUBLIC_*. Widget appearance, CTA text and
 * voice are configured on the agent itself in the ElevenLabs dashboard/API.
 *
 * Privacy-by-design: nothing is loaded from ElevenLabs or unpkg.com until the
 * visitor clicks the "Praat met Bonanza Voice" button.
 *
 * Renders nothing when NEXT_PUBLIC_ELEVENLABS_AGENT_ID is unset, so the widget
 * is inert until the env var is present (Vercel / .env.local).
 */
export default function BonanzaVoice() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const containerRef = useRef<HTMLDivElement>(null);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!activated || !agentId || !containerRef.current) return;

    // Mount the web component before loading the widget script so the browser
    // upgrades the custom element once the script defines it.
    const el = document.createElement("elevenlabs-convai");
    el.setAttribute("agent-id", agentId);
    el.setAttribute("avatar-image-url", WIDGET_AVATAR_URL);
    el.setAttribute("action-text", "Praat met Bonanza Voice");
    el.setAttribute("start-call-text", "Start gesprek");
    el.setAttribute("end-call-text", "Gesprek stoppen");
    el.setAttribute("expand-text", "Open Bonanza Voice");
    el.setAttribute("listening-text", "Ik luister...");
    el.setAttribute("speaking-text", "Bonanza Voice spreekt");
    containerRef.current.appendChild(el);

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGET_SCRIPT_URL}"]`,
    );
    if (!script) {
      script = document.createElement("script");
      script.src = WIDGET_SCRIPT_URL;
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    return () => {
      el.remove();
    };
  }, [activated, agentId]);

  if (!agentId) return null;

  if (!activated) {
    return (
      <button
        type="button"
        onClick={() => setActivated(true)}
        aria-label="Praat met Bonanza Voice. Bij klikken wordt de spraakwidget van ElevenLabs geladen."
        title="Bij klikken wordt de spraakwidget van ElevenLabs geladen"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-black shadow-lg hover:bg-amber-300"
      >
        Praat met Bonanza Voice
      </button>
    );
  }

  return <div ref={containerRef} />;
}
