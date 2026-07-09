import { NextRequest } from "next/server";
import { readByoSession } from "@/lib/byo/cookie";
import {
  DEFAULT_OLLAMA_MODEL,
  ndjsonToTextStream,
  OllamaError,
  streamOllamaChat,
  ChatMessage,
} from "@/lib/byo/ollama";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_HISTORY = 20;
const MAX_INPUT_CHARS = 8000;

export async function POST(req: NextRequest) {
  const session = await readByoSession();
  if (!session) {
    return new Response("not authenticated", { status: 401 });
  }

  let body: { messages?: ChatMessage[]; model?: string };
  try {
    body = (await req.json()) as { messages?: ChatMessage[]; model?: string };
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-MAX_HISTORY);
  if (messages.length === 0) {
    return new Response("no messages", { status: 400 });
  }
  if (messages.some((m) => !m.content || m.content.length > MAX_INPUT_CHARS)) {
    return new Response("message too long", { status: 400 });
  }

  if (session.provider === "ollama") {
    const model = req.nextUrl.searchParams.get("model") || DEFAULT_OLLAMA_MODEL;
    try {
      const raw = await streamOllamaChat({
        apiKey: session.apiKey,
        model,
        messages,
        signal: req.signal,
      });
      const textStream = ndjsonToTextStream(raw);
      return new Response(textStream, {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
          "x-accel-buffering": "no",
        },
      });
    } catch (e) {
      const status = e instanceof OllamaError ? e.status : 502;
      const msg = e instanceof Error ? e.message : "unknown";
      const isAuth = status === 401 || /unauthor|invalid.*key/i.test(msg);
      return new Response(
        isAuth ? "ollama rejected the key (401). Sign out and sign back in." : `ollama error: ${msg}`,
        { status: isAuth ? 401 : 502 },
      );
    }
  }

  return new Response("unsupported provider", { status: 400 });
}
