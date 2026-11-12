"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Eerste-party analytics-tracker.
//
// Geen cookie, geen localStorage, geen IP, geen user-agent. De tracker stuurt
// alleen het eventnaam, een vrij label, het pad en eventuele UTM-parameters
// naar /api/analytics. De server bewaart dat in dezelfde Redis als de leads.
//
// Waarom een apart component en geen inline script: het volgt de Next.js
// App Router, overleeft client-side navigatie en komt niet in de SSR-markup,
// dus er komt geen tracker-HTML in de crawlers te zien.
//
// De events worden in een buffer verzameld en in één keer verstuurd. Dat
// houdt het aantal verzoeken laag en voorkomt dat elke klik een eigen
// netwerkverzoek start.

const FLUSH_INTERVAL_MS = 4000;

interface TrackedEvent {
  name: string;
  label?: string;
  path?: string;
  source?: string;
  campaign?: string;
}

function readUtm(): { source?: string; campaign?: string } {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get("utm_source") || undefined,
      campaign: params.get("utm_campaign") || undefined,
    };
  } catch {
    return {};
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const buffer = useRef<TrackedEvent[]>([]);
  const utm = useRef(readUtm());
  const lastPath = useRef<string>("");

  useEffect(() => {
    // Een page_view bij elke navigatie, ook client-side.
    if (pathname && pathname !== lastPath.current) {
      lastPath.current = pathname;
      buffer.current.push({
        name: "page_view",
        path: pathname,
        source: utm.current.source,
        campaign: utm.current.campaign,
      });
    }
  }, [pathname]);

  useEffect(() => {
    const flush = async () => {
      if (buffer.current.length === 0) return;
      const events = buffer.current.splice(0, buffer.current.length);
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ events }),
          keepalive: true,
        });
      } catch {
        // Analytics mag nooit de site hinderen. Bij een fout laten we het
        // bij deze gebeurtenissen; de volgende flush probeert opnieuw.
        buffer.current.unshift(...events);
      }
    };

    const timer = setInterval(flush, FLUSH_INTERVAL_MS);
    const onHide = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    document.addEventListener("visibilitychange", onHide);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onHide);
      void flush();
    };
  }, []);

  // Kliks op elementen met data-track worden automatisch als cta_click
  // geregistreerd. Zo hoeft niemand per knop componentlogica te schrijven.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest?.("[data-track]");
      if (!(target instanceof HTMLElement)) return;

      const name = target.dataset.track;
      if (!name) return;

      buffer.current.push({
        name: "cta_click",
        label: target.dataset.trackLabel || name,
        path: window.location.pathname,
        source: utm.current.source,
        campaign: utm.current.campaign,
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
