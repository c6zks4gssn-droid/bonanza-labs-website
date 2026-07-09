import Link from "next/link";
import { ArrowUpRight, Code, Lock, Gauge, Wallet, FileText, Github, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "mcp-guard — MCP Security Gateway",
  description:
    "Auth, rate limits, spend caps, and audit logs in front of any MCP server. Drop-in replacement, zero code changes. Apache-2.0 open source.",
};

const FEATURES = [
  {
    icon: Lock,
    title: "API-key & JWT auth",
    body: "Reject anonymous calls before they reach the upstream MCP server. Rotate keys without redeploying.",
  },
  {
    icon: Gauge,
    title: "Per-agent rate limits",
    body: "Sliding-window limits per agent, per tool, or per session. Configurable in YAML.",
  },
  {
    icon: Wallet,
    title: "Spend caps (x402)",
    body: "Cap how much any agent can spend per hour, per day, or per tool-call. Block + alert on overage.",
  },
  {
    icon: FileText,
    title: "JSONL audit logs",
    body: "Every call: who, what, when, payload hash, response code, latency. Stream to Loki, Datadog, or a file.",
  },
  {
    icon: Github,
    title: "GitHub Action for PRs",
    body: "Scan MCP configs in CI. Block PRs that introduce unauthenticated tools or undeclared capabilities.",
  },
  {
    icon: ShieldCheck,
    title: "Zero dependencies",
    body: "Single binary, ~12MB. Runs on Linux, macOS, ARM, x86. No Docker, no Node, no Python runtime.",
  },
];

export default function McpGuardPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[rgba(5,5,8,.88)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 text-xs font-black">
              🔐
            </span>
            <span>mcp-guard</span>
            <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/60">
              v0.1.1
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-white/60">
            <a href="#features" className="hover:text-white">features</a>
            <a href="#install" className="hover:text-white">install</a>
            <a
              href="https://github.com/c6zks4gssn-droid/mcp-guard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-white"
            >
              github <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#050508] hover:bg-orange-400"
            >
              back to bonanza labs
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-orange-400">
            flagship · mcp security gateway
          </p>
          <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
            Your MCP server
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              has no auth.
            </span>
            <br />
            <span className="text-white/40">Yet.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            mcp-guard sits in front of any Model Context Protocol server. Auth,
            rate limits, spend caps, audit logs — drop-in, zero code changes to
            the server. Apache-2.0, no telemetry.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <code className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 font-mono text-sm">
              pip install bonanza-mcp-guard
            </code>
            <a
              href="https://github.com/c6zks4gssn-droid/mcp-guard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#050508] hover:bg-orange-400"
            >
              <Code className="h-4 w-4" /> view source
            </a>
          </div>

          {/* Stat strip */}
          <dl className="mt-12 grid grid-cols-4 gap-3">
            {[
              { v: "0", l: "code changes", color: "text-red-400" },
              { v: "12MB", l: "single binary", color: "text-orange-400" },
              { v: "Apache-2.0", l: "license", color: "text-yellow-400" },
              { v: "<5ms", l: "overhead p99", color: "text-amber-400" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <dt className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {s.l}
                </dt>
                <dd className={`mt-1 text-2xl font-bold tracking-tight ${s.color}`}>
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-orange-400">
            § 01 — what it does
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Six things. One binary.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
                  <Icon className="h-4 w-4 text-orange-400" />
                </div>
                <p className="text-base font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Install snippet */}
      <section id="install" className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-orange-400">
            § 02 — drop in
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Two lines. Anywhere.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-2.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  $ mcp-guard init
                </p>
                <span className="font-mono text-[10px] text-white/40">shell</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-white/80">
{`$ pip install bonanza-mcp-guard
$ mcp-guard init
  → Created mcp-guard.yaml
  → Detected 1 MCP server in claude_desktop_config.json
  → Wrapping with auth + rate-limit

$ mcp-guard serve
  → Listening on :8400
  → Proxying to upstream MCP server
  → Auth: api-key
  → Rate limit: 60 req/min/agent
  → Spend cap: $5/day
  → Audit log: stdout (JSONL)`}
              </pre>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-2.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  mcp-guard.yaml
                </p>
                <span className="font-mono text-[10px] text-white/40">config</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-white/80">
{`upstream: http://localhost:8000
listen: 0.0.0.0:8400

auth:
  type: api-key
  header: X-Agent-Key
  keys:
    - agent: claude-prod-1
      key: sk_***
    - agent: gpt-bot
      key: sk_***

rate_limit:
  window: 60s
  max: 100
  scope: agent

spend_cap:
  window: 24h
  max_usd: 5.00
  on_breach: block

audit:
  format: jsonl
  output: stdout`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-3xl font-bold tracking-tight">Ship a secure MCP server today.</p>
            <p className="mt-1 text-sm text-white/60">
              Apache-2.0. No telemetry. No SaaS lock-in.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://github.com/c6zks4gssn-droid/mcp-guard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#050508] hover:bg-orange-400"
            >
              <Code className="h-4 w-4" /> github
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 hover:border-orange-400 hover:text-white"
            >
              back to bonanza labs
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-6 font-mono text-[10px] uppercase tracking-widest text-white/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span>bonanza labs / mcp-guard</span>
          <span>apache-2.0 · no telemetry</span>
        </div>
      </footer>
    </div>
  );
}
