"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export type ChatItem = { me: boolean; text: string; srLabel: string };

export default function ChatLog({ items, typing, label, empty, meIcon, otherIcon, typingLabel }: { items: ChatItem[]; typing: boolean; label: string; empty?: ReactNode; meIcon: ReactNode; otherIcon: ReactNode; typingLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight; // alleen het chatvak scrollen, niet de pagina
  }, [items.length, typing]);
  return (
    <div ref={ref} className="dm-log" role="log" aria-live="polite" aria-relevant="additions" aria-label={label} tabIndex={0} data-testid="chat-log">
      {items.length === 0 && !typing && empty}
      <ul>
        {items.map((m, i) => (
          <li key={i} className={`dm-row${m.me ? " me" : ""}`}>
            {!m.me && <span className="dm-ava" aria-hidden>{otherIcon}</span>}
            <div className="dm-bubble"><span className="sr-only">{m.srLabel}: </span>{m.text}</div>
            {m.me && <span className="dm-ava" aria-hidden>{meIcon}</span>}
          </li>
        ))}
        {typing && (
          <li className="dm-row" data-testid="typing">
            <span className="dm-ava" aria-hidden>{otherIcon}</span>
            <div className="dm-bubble" style={{ padding: 0 }}><span className="dm-typing" aria-hidden><i /><i /><i /></span><span className="sr-only">{typingLabel}</span></div>
          </li>
        )}
      </ul>
    </div>
  );
}
