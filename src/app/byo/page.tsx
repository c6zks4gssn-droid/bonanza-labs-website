import Link from "next/link";
import { ArrowUpRight, Code } from "lucide-react";
import { Anatomy } from "@/components/byo/anatomy";
import { CodeBlock } from "@/components/byo/code-block";

export const metadata = {
  title: "BYO-LLM — Bring Your Own Subscription",
  description:
    "Login with your own LLM provider. Encrypted HttpOnly cookie, server-side proxy, zero key in the browser.",
};

export default function ByoLanding() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-bone">
      {/* grid + noise backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />

      {/* top bar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-mono-c text-xs uppercase tracking-widest text-bone-dim hover:text-bone"
        >
          ← bonanza labs / byo-llm
        </Link>
        <nav className="flex items-center gap-4 font-mono-c text-[11px] uppercase tracking-widest text-zinc-500">
          <Link href="#how" className="hover:text-bone">
            how
          </Link>
          <Link href="#code" className="hover:text-bone">
            code
          </Link>
          <Link href="#security" className="hover:text-bone">
            security
          </Link>
          <Link
            href="/api/byo/session"
            className="flex items-center gap-1 text-bone-dim hover:text-lime-400"
          >
            api <ArrowUpRight className="h-3 w-3" />
          </Link>
        </nav>
      </header>

      {/* Hero: asymmetric split */}
      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-8 lg:grid-cols-12">
        <div className="reveal lg:col-span-7" style={{ animationDelay: "0ms" }}>
          <div className="inline-flex items-center gap-2 font-mono-c text-[10px] uppercase tracking-widest text-lime-400">
            <span className="h-px w-6 bg-lime-400" /> v0.1 · open alpha
          </div>
          <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-tight">
            Bring your own
            <br />
            <em className="text-bone-dim">subscription</em>
            <span className="text-lime-400">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance font-mono-c text-sm leading-relaxed text-bone-dim">
            Users log in with their own Ollama Cloud account. Tokens never reach the
            browser — only an encrypted, signed HttpOnly cookie stays on this server
            for 24&nbsp;hours. You ship the product, they pay the inference.
          </p>

          {/* CTA row */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/byo/chat"
              className="group inline-flex items-center gap-2 rounded-md bg-lime-400 px-4 py-2 font-mono-c text-xs font-medium uppercase tracking-widest text-ink transition hover:bg-lime-300"
            >
              try the demo
              <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://github.com/c6zks4gssn-droid/bonanza-labs-website/tree/main/src/app/byo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-800 px-4 py-2 font-mono-c text-xs uppercase tracking-widest text-bone-dim transition hover:border-zinc-700 hover:text-bone"
            >
              <Code className="h-3.5 w-3.5" /> src
            </a>
          </div>

          {/* stat strip */}
          <dl className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-zinc-800 bg-zinc-800/40 font-mono-c">
            {[
              { v: "0", l: "trusted blindly" },
              { v: "AES-256-GCM", l: "at rest" },
              { v: "HttpOnly", l: "in transit" },
            ].map((s) => (
              <div key={s.l} className="bg-ink p-4">
                <dt className="text-[10px] uppercase tracking-widest text-zinc-500">
                  {s.l}
                </dt>
                <dd className="mt-1 font-display text-2xl tracking-tight">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Anatomy diagram */}
        <aside className="reveal lg:col-span-5" style={{ animationDelay: "180ms" }}>
          <div className="rounded-lg border border-zinc-800 bg-black/40 p-6 backdrop-blur">
            <div className="mb-3 flex items-center justify-between font-mono-c text-[10px] uppercase tracking-widest text-zinc-500">
              <span>anatomy</span>
              <span>hover a node</span>
            </div>
            <Anatomy />
          </div>
        </aside>
      </section>

      {/* The differentiator strip — what this is not */}
      <section
        id="how"
        className="relative z-10 border-y border-zinc-900 bg-black/30 py-16"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="font-mono-c text-[10px] uppercase tracking-widest text-lime-400">
              § 01 — what it isn't
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">
              Not another wrapper.
            </h2>
          </div>
          <div className="font-mono-c text-sm leading-relaxed text-bone-dim lg:col-span-9">
            <div className="grid gap-6 sm:grid-cols-3">
              <Diff
                title="✗ Stored in localStorage"
                body="XSS steals it the moment it lands. We don't."
              />
              <Diff
                title="✗ Passed through your server"
                body="The chat proxy uses your key, decrypts with your key, never persists."
              />
              <Diff
                title="✗ Paywalled by Bonanza"
                body="User brings the model. You bring the product. Inference paid by them."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Code, dark-terminal style */}
      <section id="code" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-mono-c text-[10px] uppercase tracking-widest text-lime-400">
            § 02 — the receipt
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight">
            Two routes. One cookie.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <CodeBlock
              lang="ts"
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
            <CodeBlock
              lang="ts"
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

      {/* Security block — spec sheet */}
      <section id="security" className="relative z-10 border-t border-zinc-900 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono-c text-[10px] uppercase tracking-widest text-lime-400">
              § 03 — threat model
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight">
              What we promise,
              <br />
              and what we don&apos;t.
            </h2>
            <p className="mt-4 font-mono-c text-sm leading-relaxed text-bone-dim">
              A short, boring, explicit list. No &quot;bank-grade encryption&quot;
              marketing copy.
            </p>
          </div>

          <div className="lg:col-span-8">
            <table className="w-full border-collapse font-mono-c text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-[10px] uppercase tracking-widest text-zinc-500">
                  <th className="pb-3 pr-4 font-normal">Threat</th>
                  <th className="pb-3 pr-4 font-normal">Mitigation</th>
                  <th className="pb-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="text-bone-dim">
                {SECURITY_ROWS.map((row, i) => (
                  <tr
                    key={row.threat}
                    className={i % 2 ? "bg-black/20" : ""}
                  >
                    <td className="py-3 pr-4 align-top text-bone">
                      {row.threat}
                    </td>
                    <td className="py-3 pr-4 align-top">{row.mitigation}</td>
                    <td className="py-3 align-top">
                      <StatusPill value={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative z-10 border-t border-zinc-900 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <p className="font-display text-3xl tracking-tight">
            Stop subsidising inference.
          </p>
          <div className="flex gap-3">
            <Link
              href="/byo/chat"
              className="inline-flex items-center gap-2 rounded-md bg-lime-400 px-5 py-2.5 font-mono-c text-xs uppercase tracking-widest text-ink hover:bg-lime-300"
            >
              try the demo
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-800 px-5 py-2.5 font-mono-c text-xs uppercase tracking-widest text-bone-dim hover:border-zinc-700 hover:text-bone"
            >
              back to home
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-zinc-900 px-6 py-6 font-mono-c text-[10px] uppercase tracking-widest text-zinc-600">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>bonanza labs / byo-llm</span>
          <span>apache-2.0 · no telemetry</span>
        </div>
      </footer>
    </main>
  );
}

function Diff({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-l-2 border-zinc-800 pl-4">
      <p className="text-bone">{title}</p>
      <p className="mt-2 leading-relaxed">{body}</p>
    </div>
  );
}

function StatusPill({ value }: { value: "shipped" | "next" | "no" }) {
  const map = {
    shipped: { label: "shipped", cls: "border-lime-400/40 text-lime-400" },
    next: { label: "next", cls: "border-zinc-700 text-zinc-400" },
    no: { label: "no", cls: "border-red-400/30 text-red-400" },
  } as const;
  const m = map[value];
  return (
    <span
      className={`inline-block rounded-sm border bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-widest ${m.cls}`}
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
