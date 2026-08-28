"use client";

import { useEffect, useState } from "react";

type ToolInput = {
  requestedAt: string;
  partySize: number;
};

type ModelContextTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
  execute: (input: ToolInput, context?: { signal?: AbortSignal }) => Promise<string>;
};

type ModelContext = {
  registerTool: (
    tool: ModelContextTool,
    options?: { signal?: AbortSignal },
  ) => Promise<void>;
};

declare global {
  interface Document {
    modelContext?: ModelContext;
  }
}

const tool: ModelContextTool = {
  name: "check_demo_availability",
  description:
    "Controleer read-only of de ServeFlow restaurantdemo ruimte heeft voor een gezelschap op een gekozen datum en tijd. Geeft alleen beschikbaarheid; maakt geen reservering.",
  inputSchema: {
    type: "object",
    properties: {
      requestedAt: {
        type: "string",
        description: "Gewenste ISO 8601-datum en tijd met tijdzone, bijvoorbeeld 2026-09-01T19:00:00+02:00.",
      },
      partySize: {
        type: "integer",
        minimum: 1,
        maximum: 20,
        description: "Aantal gasten, van 1 tot en met 20.",
      },
    },
    required: ["requestedAt", "partySize"],
    additionalProperties: false,
  },
  annotations: {
    readOnlyHint: true,
    untrustedContentHint: false,
  },
  execute: async ({ requestedAt, partySize }, context) => {
    const query = new URLSearchParams({
      requestedAt,
      partySize: String(partySize),
    });
    const response = await fetch(`/api/reservations/availability?${query}`, {
      signal: context?.signal,
      headers: { Accept: "application/json" },
    });
    const result = (await response.json()) as Record<string, unknown>;
    if (!response.ok || result.ok !== true) {
      throw new Error(String(result.error ?? "Beschikbaarheidscontrole mislukt."));
    }
    return JSON.stringify(result);
  },
};

export default function ServeFlowWebMCP() {
  const [state, setState] = useState<"checking" | "active" | "unsupported" | "error">("checking");

  useEffect(() => {
    if (!document.modelContext) {
      setState("unsupported");
      return;
    }

    const controller = new AbortController();
    document.modelContext
      .registerTool(tool, { signal: controller.signal })
      .then(() => setState("active"))
      .catch(() => setState("error"));

    return () => controller.abort();
  }, []);

  const labels = {
    checking: "WebMCP controleren…",
    active: "WebMCP-tool actief",
    unsupported: "WebMCP-ready demo",
    error: "WebMCP niet geregistreerd",
  };

  return (
    <aside
      className="mx-auto mt-8 max-w-2xl rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4 text-left"
      data-webmcp-status={state}
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-sm font-bold text-cyan-200">
        <span className="h-2 w-2 rounded-full bg-cyan-300" aria-hidden="true" />
        {labels[state]}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-white/55">
        Browser-agents kunnen hier veilig demo-beschikbaarheid controleren via
        <code className="mx-1 text-cyan-200">check_demo_availability</code>.
        De tool is read-only en maakt nooit zelfstandig een reservering.
      </p>
    </aside>
  );
}
