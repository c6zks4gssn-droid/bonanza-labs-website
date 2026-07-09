import { NextRequest, NextResponse } from "next/server";
import { buildCookieValue, readByoSession, ByoProvider } from "@/lib/byo/cookie";
import { validateOllamaKey } from "@/lib/byo/ollama";

export const runtime = "nodejs";

const SUPPORTED: ByoProvider[] = ["ollama"];

interface LoginBody {
  provider?: string;
  apiKey?: string;
  model?: string;
}

export async function POST(req: NextRequest) {
  let body: LoginBody;
  try {
    body = (await req.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const provider = body.provider as ByoProvider | undefined;
  const apiKey = body.apiKey?.trim();
  if (!provider || !SUPPORTED.includes(provider)) {
    return NextResponse.json({ error: "unsupported provider" }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: "api key required" }, { status: 400 });
  }
  if (apiKey.length < 1 || apiKey.length > 512) {
    return NextResponse.json({ error: "key looks wrong length" }, { status: 400 });
  }
  // "none" = local Ollama (no auth); only allowed via dev env override
  if (apiKey === "none" && !process.env.BYO_LLM_ALLOW_LOCAL) {
    return NextResponse.json(
      { error: "'none' is only valid when BYO_LLM_ALLOW_LOCAL is set" },
      { status: 400 },
    );
  }

  // validate before storing
  if (provider === "ollama") {
    const v = await validateOllamaKey(apiKey);
    if (!v.ok) {
      return NextResponse.json({ error: `ollama key invalid: ${v.reason}` }, { status: 401 });
    }
    const c = buildCookieValue({ provider, apiKey });
    const res = NextResponse.json({
      ok: true,
      provider,
      model: body.model ?? "glm-5.2:cloud",
      availableModels: v.models,
    });
    res.cookies.set(c.name, c.value, c.options);
    return res;
  }
  return NextResponse.json({ error: "unsupported provider" }, { status: 400 });
}

export async function GET() {
  const session = await readByoSession();
  if (!session) return NextResponse.json({ authenticated: false });
  // never return the key
  return NextResponse.json({
    authenticated: true,
    provider: session.provider,
    expiresAt: session.expiresAt,
  });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete({
    name: "byo_llm_session",
    path: "/",
  });
  return res;
}
