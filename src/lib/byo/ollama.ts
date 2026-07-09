// Native Ollama streaming. Avoids AI SDK provider version conflicts.
// Ollama accepts both Bearer API keys (ollama_...) and Basic-auth user:pass from Pro.

export interface OllamaConfig {
  apiKey: string;
  model: string;
}

function authHeader(apiKey: string): string {
  if (apiKey.includes(":")) {
    // basic-auth: user:pass from Ollama Pro account
    return `Basic ${Buffer.from(apiKey).toString("base64")}`;
  }
  return `Bearer ${apiKey}`;
}

// Validate by calling a protected endpoint. Ollama's /api/ps returns 200 only with valid auth.
export async function validateOllamaKey(apiKey: string): Promise<{ ok: true; models: string[] } | { ok: false; reason: string }> {
  const base = process.env.BYO_LLM_OLLAMA_BASE_URL || "https://ollama.com";
  if (apiKey.length < 1 || apiKey.length > 200) {
    return { ok: false, reason: "key length out of range" };
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const headers: Record<string, string> = apiKey === "none" ? {} : { Authorization: authHeader(apiKey) };
    const res = await fetch(`${base}/api/ps`, {
      headers,
      cache: "no-store",
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const tags = await fetch(`${base}/api/tags`, { cache: "no-store" });
    const data = (await tags.json()) as { models?: { name: string }[] };
    return { ok: true, models: (data.models ?? []).map((m) => m.name) };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "network error" };
  }
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OllamaStreamRequest {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
}

export async function streamOllamaChat(
  req: OllamaStreamRequest,
): Promise<ReadableStream<Uint8Array>> {
  const base = process.env.BYO_LLM_OLLAMA_BASE_URL || "https://ollama.com";
  const body = JSON.stringify({
    model: req.model,
    messages: req.messages,
    stream: true,
  });
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (req.apiKey !== "none") {
    headers.Authorization = authHeader(req.apiKey);
  }
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers,
    body,
    signal: req.signal,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new OllamaError(`HTTP ${res.status}: ${text.slice(0, 200)}`, res.status);
  }
  if (!res.body) throw new OllamaError("no response body", 502);
  return res.body;
}

export class OllamaError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

// Translate Ollama's NDJSON stream into a plain text stream for our chat UI.
// Ollama lines look like { "message": { "content": "..." }, "done": false }
// We emit only the text chunks.
export function ndjsonToTextStream(src: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = src.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line) continue;
            try {
              const obj = JSON.parse(line) as {
                message?: { content?: string };
                done?: boolean;
                error?: string;
              };
              if (obj.error) {
                controller.error(new Error(obj.error));
                return;
              }
              const chunk = obj.message?.content ?? "";
              if (chunk) controller.enqueue(encoder.encode(chunk));
              if (obj.done) {
                controller.close();
                return;
              }
            } catch {
              // ignore malformed line
            }
          }
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}

export const DEFAULT_OLLAMA_MODEL = "glm-5.2:cloud";
