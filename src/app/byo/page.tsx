import Link from "next/link";
import { ArrowUpRight, Code, Lock, KeyRound, Server, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "BYO-LLM — Bring Your Own Subscription",
  description:
    "Login with your own LLM provider. Encrypted HttpOnly cookie, server-side proxy, zero key in the browser.",
};

export default function ByoLanding() {
  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#171D26]">
      {/* sticky nav — ForgeWith pattern */}
      <header className="sticky top-0 z-50 border-b border-[#DDE2E0] bg-[rgba(247,248,246,.88)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="grid grid-cols-3 gap-0.5" aria-hidden="true">
              <span className="block h-2.5 w-2.5 rounded-sm bg-[#7C5CFF]" />
              <span className="block h-2.5 w-2.5 rounded-sm bg-[#1FA971]" />
              <span className="block h-2.5 w-2.5 rounded-sm bg-[#2E7CF6]" />
            </span>
            <span>BYO<span className="font-normal">-LLM</span></span>
            <span className="ml-2 rounded-full border border-[#DDE2E0] bg-white px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#4A5361]">
              v0.1 · alpha
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-[#4A5361]">
            <a href="#how" className="hover:text-[#171D26]">how</a>
            <a href="#code" className="hover:text-[#171D26]">code</a>
            <a href="#security" className="hover:text-[#171D26]">security</a>
            <Link
              href="/byo/chat"
              className="inline-flex items-center gap-1 rounded-full bg-[#171D26] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#2E7CF6]"
            >
              try demo <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1FA971]">
              bring your own subscription
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Stop subsidising{" "}
              <span className="text-[#7C5CFF]">inference</span>.
              <br />
              <span className="text-[#4A5361]">They pay for the model.</span>
              <br />
              You ship the product.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#4A5361]">
              Users log in with their own Ollama Cloud account. Tokens never reach
              the browser — only an encrypted, signed HttpOnly cookie stays on this
              server for 24 hours. Inference paid by them.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/byo/chat"
                className="inline-flex items-center gap-2 rounded-full bg-[#171D26] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2E7CF6]"
              >
                try the demo <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/c6zks4gssn-droid/bonanza-labs-website/tree/main/src/app/byo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#DDE2E0] bg-white px-5 py-2.5 text-sm font-medium text-[#171D26] hover:border-[#7C5CFF]"
              >
                <Code className="h-4 w-4" /> source
              </a>
            </div>

            {/* stat strip */}
            <dl className="mt-12 grid grid-cols-3 gap-4">
              {[
                { v: "0", l: "trusted blindly", color: "#7C5CFF" },
                { v: "AES-256-GCM", l: "at rest", color: "#1FA971" },
                { v: "HttpOnly", l: "in transit", color: "#2E7CF6" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl border border-[#DDE2E0] bg-white p-4"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-[#4A5361]">
                    {s.l}
                  </dt>
                  <dd
                    className="mt-1 text-2xl font-bold tracking-tight"
                    style={{ color: s.color }}
                  >
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual: flow diagram */}
          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-[#DDE2E0] bg-white p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#4A5361]">
                anatomy
              </p>
              <div className="mt-6 space-y-4">
                <Node
                  icon={<KeyRound className="h-4 w-4" />}
                  label="User pastes Ollama key"
                  sub="HTTPS POST → /api/byo/session"
                  color="#7C5CFF"
                />
                <Arrow />
                <Node
                  icon={<Lock className="h-4 w-4" />}
                  label="AES-256-GCM + HMAC signed"
                  sub="server-side, BYO_LLM_ENCRYPTION_KEY"
                  color="#1FA971"
                />
                <Arrow />
                <Node
                  icon={<Server className="h-4 w-4" />}
                  label="HttpOnly cookie set"
                  sub="JS cannot read. 24h max-age."
                  color="#2E7CF6"
                />
                <Arrow />
                <Node
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Chat proxy decrypts on demand"
                  sub="key never touches the client"
                  color="#1FA971"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* What this is not */}
      <section id="how" className="border-y border-[#DDE2E0] bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
                § 01 — what it isn't
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Not another wrapper.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3 lg:col-span-8">
              <Diff
                title="✗ Stored in localStorage"
                body="XSS steals it the moment it lands. We don't."
                color="#ef4444"
              />
              <Diff
                title="✗ Passed through your server"
                body="The chat proxy uses your key, decrypts with your key, never persists."
                color="#ef4444"
              />
              <Diff
                title="✗ Paywalled by Bonanza"
                body="User brings the model. You bring the product. Inference paid by them."
                color="#ef4444"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Code, clean cards */}
      <section id="code" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#1FA971]">
            § 02 — the receipt
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Two routes. One cookie.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <CodeCard
              caption="/api/byo/session POST"
              code={`// server validates, encrypts, signs
import { encryptKey, signCookie } from "@/lib/byo";

export async function POST(req: Request) {
  const { provider, apiKey } = await req.json();
  const ok = await validate(provider, apiKey);
  if (!ok) return new Response("invalid", { status: 401 });

  const expiresAt = Date.now() / 1000 + 86400;
  const encKey = encryptKey(apiKey);
  const sig = signCookie(provider, expiresAt);

  const res = Response.json({ ok: true });
  res.headers.append("Set-Cookie",
    \`byo_llm_session=...; HttpOnly; SameSite=Lax; Max-Age=86400\`);
  return res;
}`}
            />
            <CodeCard
              caption="/api/byo/chat POST"
              code={`// server proxies the stream
import { readByoSession } from "@/lib/byo";
import { streamOllamaChat, ndjsonToTextStream } from "@/lib/byo/ollama";

export async function POST(req: Request) {
  const session = await readByoSession();
  if (!session) return new Response("no", { status: 401 });

  const { messages } = await req.json();
  const raw = await streamOllamaChat({
    apiKey: session.apiKey,        // decrypted from cookie
    model: "glm-5.2:cloud",
    messages,
  });

  return new Response(ndjsonToTextStream(raw), {
    headers: { "content-type": "text/plain" },
  });
}`}
            />
          </div>
        </div>
      </section>

      {/* Security block */}
      <section id="security" className="border-t border-[#DDE2E0] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[#2E7CF6]">
                § 03 — threat model
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight">
                What we promise,
                <br /> and what we don't.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#4A5361]">
                A short, boring, explicit list. No "bank-grade encryption"
                marketing copy.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-2xl border border-[#DDE2E0] bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#DDE2E0] bg-[#F7F8F6] text-left font-mono text-[10px] uppercase tracking-widest text-[#4A5361]">
                      <th className="px-5 py-3 font-normal">Threat</th>
                      <th className="px-5 py-3 font-normal">Mitigation</th>
                      <th className="px-5 py-3 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SECURITY_ROWS.map((row, i) => (
                      <tr
                        key={row.threat}
                        className={i % 2 === 0 ? "" : "bg-[#F7F8F6]/50"}
                      >
                        <td className="px-5 py-4 align-top text-sm font-medium text-[#171D26]">
                          {row.threat}
                        </td>
                        <td className="px-5 py-4 align-top text-sm text-[#4A5361]">
                          {row.mitigation}
                        </td>
                        <td className="px-5 py-4 align-top">
                          <StatusPill value={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-[#DDE2E0] py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-3xl font-bold tracking-tight">Ready to test?</p>
            <p className="mt-1 text-sm text-[#4A5361]">
              Bring an Ollama Cloud key. Try the chat. No telemetry.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/byo/chat"
              className="inline-flex items-center gap-2 rounded-full bg-[#171D26] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2E7CF6]"
            >
              try the demo <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#DDE2E0] bg-white px-5 py-2.5 text-sm font-medium text-[#171D26] hover:border-[#7C5CFF]"
            >
              back to home
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#DDE2E0] px-6 py-6 font-mono text-[10px] uppercase tracking-widest text-[#4A5361]">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span>bonanza labs / byo-llm</span>
          <span>apache-2.0 · no telemetry</span>
        </div>
      </footer>
    </div>
  );
}

function Node({
  icon,
  label,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#DDE2E0] bg-[#F7F8F6] p-3">
      <div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
        style={{ background: color }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#171D26]">{label}</p>
        <p className="mt-0.5 font-mono text-[11px] text-[#4A5361]">{sub}</p>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center">
      <div className="h-4 w-px bg-[#DDE2E0]" />
    </div>
  );
}

function Diff({
  title,
  body,
  color,
}: {
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-[#DDE2E0] bg-white p-5">
      <p className="text-sm font-semibold" style={{ color }}>
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#4A5361]">{body}</p>
    </div>
  );
}

function CodeCard({ caption, code }: { caption: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#DDE2E0] bg-white">
      <div className="flex items-center justify-between border-b border-[#DDE2E0] bg-[#F7F8F6] px-5 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#4A5361]">
          {caption}
        </p>
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#DDE2E0]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#DDE2E0]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#1FA971]" />
        </div>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-[#171D26]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StatusPill({ value }: { value: "shipped" | "next" | "no" }) {
  const map = {
    shipped: { label: "shipped", bg: "#1FA971", text: "white" },
    next: { label: "next", bg: "#F7F8F6", text: "#4A5361" },
    no: { label: "no", bg: "#FEF2F2", text: "#ef4444" },
  } as const;
  const m = map[value];
  return (
    <span
      className="inline-block rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest"
      style={{ background: m.bg, color: m.text }}
    >
      {m.label}
    </span>
  );
}

const SECURITY_ROWS = [
  {
    threat: "XSS key exfil",
    mitigation:
      "Key never enters the document. Only HttpOnly cookie crosses HTTPS, no JS access.",
    status: "shipped" as const,
  },
  {
    threat: "Cookie tampering",
    mitigation:
      "HMAC-SHA256 signature on provider + expiresAt. Tampered cookies fail signature check.",
    status: "shipped" as const,
  },
  {
    threat: "Replay after sign-out",
    mitigation:
      "Cookie is wiped server-side; client-side deleted; max-age 24h hard ceiling.",
    status: "shipped" as const,
  },
  {
    threat: "Provider over-billing",
    mitigation: "Per-request token budget and cost cap wired into the proxy.",
    status: "next" as const,
  },
  {
    threat: "Keylogging",
    mitigation: "Out of scope. We can't fix your user's compromised laptop.",
    status: "no" as const,
  },
];
