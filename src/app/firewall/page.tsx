"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Check, X, AlertTriangle, Clock, ReceiptText, RefreshCw, Menu } from "lucide-react";

type FirewallEvent = {
  id: string;
  requestId: string;
  agentId: string;
  merchant: string;
  merchantUrl: string;
  amountCents: number;
  currency: string;
  decision: "allow" | "deny" | "require_approval";
  status: "pending_approval" | "approved" | "denied" | "completed" | "canceled";
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  reasons: string[];
  createdAt: string;
  updatedAt: string;
  checkoutSessionId?: string;
};

type Summary = { pending: number; approved: number; denied: number; highRisk: number };

const fallbackSummary: Summary = { pending: 0, approved: 0, denied: 0, highRisk: 0 };

function money(cents: number, currency: string) {
  return `${currency} ${(cents / 100).toFixed(2)}`;
}

function badgeClass(value: string) {
  if (["allow", "approved", "completed", "low"].includes(value)) return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  if (["deny", "denied", "high"].includes(value)) return "border-red-500/30 bg-red-500/10 text-red-300";
  return "border-amber-500/30 bg-amber-500/10 text-amber-300";
}

export default function FirewallDashboard() {
  const [events, setEvents] = useState<FirewallEvent[]>([]);
  const [summary, setSummary] = useState<Summary>(fallbackSummary);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(() => typeof window === "undefined" ? "" : window.localStorage.getItem("bonanza_firewall_admin_token") || "");
  const [newRequestLoading, setNewRequestLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function authHeaders(): Record<string, string> {
    return adminToken ? { "x-admin-token": adminToken } : {};
  }

  async function load() {
    setLoading(true);
    const res = await fetch("/api/firewall", { cache: "no-store", headers: authHeaders() });
    const data = await res.json();
    setEvents(data.events || []);
    setSummary(data.summary || fallbackSummary);
    setLoading(false);
  }

  async function decide(requestId: string, action: "approve" | "deny") {
    await fetch("/api/firewall", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ requestId, action }),
    });
    await load();
  }

  async function createDemoRequest() {
    setNewRequestLoading(true);
    await fetch("/api/firewall/request", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        agentId: "research-agent",
        merchant: "OpenAI",
        merchantUrl: "https://openai.com",
        amountCents: 1200,
        currency: "USD",
      }),
    });
    setNewRequestLoading(false);
    await load();
  }

  useEffect(() => {
    const saved = window.localStorage.getItem("bonanza_firewall_admin_token") || "";
    let active = true;
    fetch("/api/firewall", { cache: "no-store", headers: saved ? { "x-admin-token": saved } : {} })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setEvents(data.events || []);
        setSummary(data.summary || fallbackSummary);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#050508] text-white px-4 md:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-white">← Back</Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''} md:flex items-center gap-4 text-sm text-gray-500`}>
            <Link href="/products" className="hover:text-white" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link href="/pricing" className="hover:text-white" onClick={() => setMenuOpen(false)}>Pricing</Link>
          </div>
        </nav>

        <section className="mt-10 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-white/[0.03] to-orange-500/10 p-5 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300 mb-5">
                <Shield className="w-4 h-4" /> Spending Firewall Dashboard
              </div>
              <h1 className="text-3xl md:text-6xl font-black tracking-tight">Approve agent spend before money moves.</h1>
              <p className="mt-5 max-w-2xl text-gray-400 text-lg">
                Test-mode control center for AI agent spending: policy decisions, risk scores, approval queue, and audit trail.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <input
                value={adminToken}
                onChange={(e) => {
                  setAdminToken(e.target.value);
                  window.localStorage.setItem("bonanza_firewall_admin_token", e.target.value);
                }}
                placeholder="Admin token if enabled"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none"
              />
              <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <button onClick={createDemoRequest} disabled={newRequestLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60">
                {newRequestLoading ? "Creating…" : "Create test request"}
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8">
          {[
            ["Pending", summary.pending, Clock, "text-amber-300"],
            ["Approved/Completed", summary.approved, Check, "text-emerald-300"],
            ["Denied", summary.denied, X, "text-red-300"],
            ["High risk", summary.highRisk, AlertTriangle, "text-orange-300"],
          ].map(([label, value, Icon, color]) => {
            const Cmp = Icon as typeof Clock;
            return (
              <div key={String(label)} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <Cmp className={`w-5 h-5 ${color}`} />
                <div className="mt-4 text-3xl font-black">{String(value)}</div>
                <div className="text-sm text-gray-500">{String(label)}</div>
              </div>
            );
          })}
        </section>

        {/* Interactive Demo */}
        <section className="mt-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-white/[0.03] to-cyan-500/10 p-5 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Try it now</h2>
          <p className="text-gray-400 mb-6">Install the Bonanza packages and see the firewall in action.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { pkg: "bonanza-x402", desc: "Spending firewall for HTTP 402 protocol", cmd: "pip install bonanza-x402" },
              { pkg: "bonanza-mcp", desc: "MCP server for AI agent payments (7 tools)", cmd: "pip install bonanza-mcp" },
              { pkg: "bonanza-guard", desc: "Security guardrails — 28 injection + 9 PII patterns", cmd: "pip install bonanza-guard" },
            ].map((p) => (
              <div key={p.pkg} className="rounded-2xl border border-white/5 bg-black/30 p-5">
                <div className="text-emerald-300 font-mono text-sm mb-2">{p.pkg}</div>
                <p className="text-gray-500 text-xs mb-3">{p.desc}</p>
                <code className="block rounded-lg bg-black/50 border border-white/5 px-3 py-2 text-xs text-green-400 font-mono">{p.cmd}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-6">
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Approval queue + audit log</h2>
              <span className="text-xs text-gray-500">Test mode</span>
            </div>
            <div className="divide-y divide-white/5">
              {loading && <div className="p-6 text-gray-500">Loading…</div>}
              {!loading && events.map((event) => (
                <div key={event.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${badgeClass(event.status)}`}>{event.status}</span>
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${badgeClass(event.riskLevel)}`}>risk {event.riskLevel} · {event.riskScore}/100</span>
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${badgeClass(event.decision)}`}>{event.decision}</span>
                      </div>
                      <h3 className="text-lg font-bold">{event.merchant}</h3>
                      <p className="text-sm text-gray-500">{event.agentId} · {money(event.amountCents, event.currency)} · {event.requestId}</p>
                      <ul className="mt-3 space-y-1 text-sm text-gray-400">
                        {event.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                      </ul>
                      {event.checkoutSessionId && <p className="mt-3 text-xs text-emerald-300">Checkout session: {event.checkoutSessionId}</p>}
                    </div>
                    {event.status === "pending_approval" && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => decide(event.requestId, "approve")} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-black hover:bg-emerald-400">Approve</button>
                        <button onClick={() => decide(event.requestId, "deny")} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-400">Deny</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="text-xl font-bold mb-4">Default policy</h2>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex justify-between"><span>Unknown vendors</span><span className="text-amber-300">approval</span></div>
                <div className="flex justify-between"><span>Above threshold</span><span className="text-amber-300">approval</span></div>
                <div className="flex justify-between"><span>Blocked vendors</span><span className="text-red-300">deny</span></div>
                <div className="flex justify-between"><span>Live payments</span><span className="text-red-300">blocked</span></div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-[#0a0a12] p-6 font-mono text-xs text-gray-400">
              <div className="flex items-center gap-2 text-white font-sans font-bold text-base mb-4"><ReceiptText className="w-4 h-4" /> Python demo</div>
              <p className="text-green-400">from bonanza_x402 import Firewall, Policy</p>
              <p className="mt-1 text-gray-500"># Configure the spending firewall</p>
              <p className="mt-1 text-green-400">policy = Policy(max_spend_usd=10,</p>
              <p className="text-green-400">  require_approval_above=5,</p>
              <p className="text-green-400">  trusted_vendors=["api.weather.com"])</p>
              <p className="mt-2 text-green-400">fw = Firewall(policy=policy)</p>
              <p className="mt-2 text-gray-500"># Evaluate a payment request</p>
              <p className="mt-1 text-green-400">result = fw.evaluate(amount=3.00,</p>
              <p className="text-green-400">  vendor="api.weather.com")</p>
              <p className="mt-2 text-emerald-300">→ approved · risk 0.20 · LOW</p>
              <p className="mt-3 text-green-400">result = fw.evaluate(amount=8.00,</p>
              <p className="text-green-400">  vendor="unknown.com")</p>
              <p className="mt-2 text-red-300">→ blocked · vendor not trusted</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
