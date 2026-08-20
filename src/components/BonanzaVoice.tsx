"use client";

import { useEffect, useRef } from "react";

const WIDGET_SCRIPT_URL = "https://unpkg.com/@elevenlabs/convai-widget-embed";
const WIDGET_AVATAR_URL = "https://www.bonanza-labs.com/logo-256.png";

/**
 * Bonanza Voice — ElevenLabs voice agent, embedded site-wide.
 *
 * The agent-id is public (auth disabled, allowlisted to bonanza-labs.com),
 * so it is safe to expose via NEXT_PUBLIC_*. Widget appearance, CTA text and
 * voice are configured on the agent itself in the ElevenLabs dashboard/API.
 *
 * Renders nothing when NEXT_PUBLIC_ELEVENLABS_AGENT_ID is unset, so the widget
 * is inert until the env var is present (Vercel / .env.local).
 */
export default function BonanzaVoice() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!agentId || !containerRef.current) return;

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
  }, [agentId]);

  if (!agentId) return null;

  return <div ref={containerRef} />;
}
