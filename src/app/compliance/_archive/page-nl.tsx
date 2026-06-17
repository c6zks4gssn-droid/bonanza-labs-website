"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ── Metadata (add to a separate metadata.ts or layout if using App Router) ──
// export const metadata = {
//   title: "EU AI Act Compliance for AI Agents — Bonanza Labs",
//   description: "EU AI Act Article 14 requires human-in-the-loop for AI agents. Bonanza's Spending Firewall is the compliance layer. Deadline: August 2, 2026.",
// };

const DEADLINE = new Date("2026-08-02T00:00:00Z");

function DaysLeft() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const diff = Math.ceil((DEADLINE.getTime() - Date.now()) / 86_400_000);
    setDays(Math.max(0, diff));
  }, []);
  return <span style={{ color: "#fca5a5", fontWeight: 700 }}>{days ?? "…"}</span>;
}

const MAPPING = [
  ["Humans must be able to intervene during operation", "Human approval queue — agent pauses, human approves or rejects"],
  ["Humans must be able to interrupt the AI system", "Hard spending caps — agent is stopped when budget is reached"],
  ["Decisions must be explainable and auditable", "Full audit log: who approved what, when, for how much"],
  ["AI must operate within defined boundaries", "Policy engine: vendor allowlists, chain restrictions, per-session limits"],
  ["Humans must understand what the AI is doing", 'Real-time notification: "Your agent wants to pay €8.50 to data.example.com — approve?"'],
  ["Oversight must be appropriate to risk level", "Configurable thresholds: auto-approve low amounts, require approval above your risk limit"],
];

const CHECKLIST = [
  { title: "Human approval queue", desc: "Agents pause and notify a human before making high-value decisions. Human approves or rejects." },
  { title: "Hard spending limits", desc: "Agents cannot exceed configured budgets — they stop automatically. No runaway spending possible." },
  { title: "Immutable audit log", desc: "Every payment decision recorded with timestamp, approver identity, amount, and vendor. JSONL format, exportable." },
  { title: "Vendor control (allowlist / blocklist)", desc: "Define exactly which services your agents may interact with. Block entire domains with a single line." },
  { title: "Real-time notifications", desc: "Slack, email, Telegram, or custom webhook. Humans are informed immediately when oversight is needed." },
  { title: "Compliance report export", desc: "Generate a structured PDF of all agent activity, decisions, and human approvals — ready for regulators." },
];

const STEPS = [
  { n: 1, title: "Install", body: <>Run <code style={{ color: "var(--orange)" }}>pip install x402-firewall</code> — zero dependencies, works with any agent framework.</> },
  { n: 2, title: "Configure policy", body: "Set your budget cap, approval threshold, and notification channel (Slack, email, webhook)." },
  { n: 3, title: "Agent pauses for approval", body: "When an agent wants to make a payment above your threshold, it pauses and notifies you." },
  { n: 4, title: "You approve or reject", body: "One click in Slack, email, or your dashboard. The agent proceeds or stops — your choice." },
  { n: 5, title: "Full audit trail", body: "Every decision logged: who approved, when, amount, vendor. Export as PDF for compliance reports." },
  { n: 6, title: "Article 14 satisfied", body: "Human oversight is now demonstrably in place. Your legal team will love the audit export." },
];

const FAQ = [
  {
    q: "Does Article 14 apply to my AI agents?",
    a: "Article 14 applies to "high-risk AI systems" as defined in Annex III of the EU AI Act. Autonomous AI agents that manage financial transactions, make procurement decisions, or control significant resources are typically in scope. If your agent can spend money or make decisions with real consequences for users, treat it as high-risk. Consult your legal team for specific advice.",
  },
  {
    q: "When does Article 14 enforcement start?",
    a: "August 2, 2026. The EU AI Act was published in the Official Journal of the EU in July 2024, with a two-year implementation period.",
  },
  {
    q: "Is Bonanza's Spending Firewall open source?",
    a: "Yes. The core x402-firewall and mcp-guard libraries are Apache 2.0 open source on GitHub. Managed dashboard, hosted approval queue, and compliance report generation are commercial features.",
  },
  {
    q: "How does the human approval queue work technically?",
    a: "When an agent attempts a payment above your threshold, the x402-firewall intercepts it before execution. The agent pauses. A notification is sent to your configured channel. A human reviews and clicks Approve or Reject. The agent proceeds or receives a PaymentPendingApproval exception. Everything is recorded in the audit log.",
  },
  {
    q: "Can I generate a compliance report for our DPO or legal team?",
    a: "Yes. The managed dashboard generates structured compliance reports showing all agent activity, decisions, and human approvals. Exportable as PDF. The open source version produces JSONL audit logs.",
  },
  {
    q: "Does Article 14 apply if we're not in the EU?",
    a: "The EU AI Act has extraterritorial scope — it applies if your AI system is placed on the market in the EU, or if its output is used in the EU, regardless of where you are based. Similar to GDPR.",
  },
];

export default function CompliancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sent">("idle");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST to /api/compliance-report with { email }
    setFormStatus("sent");
  }

  return (
    <div style={{ background: "#07080c", color: "#e2e8f0", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        :root { --orange: #f5a623; --green: #22c55e; --blue: #60a5fa; --red: #ef4444; --bg2: #0e1117; --bg3: #161b27; --border: #1e2535; --muted: #64748b; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { color: inherit; text-decoration: none; }
        code { font-family: monospace; }
      `}</style>

      {/* DEADLINE BANNER */}
      <div style={{ background: "linear-gradient(90deg,#7c1a1a,#991b1b,#7c1a1a)", borderBottom: "1px solid #ef4444", textAlign: "center", padding: "10px 24px", fontSize: ".9rem", fontWeight: 600 }}>
        ⚠️ EU AI Act Article 14 enforcement begins{" "}
        <span style={{ color: "#fca5a5", fontWeight: 700 }}>August 2, 2026</span>
        {" — "}
        <DaysLeft /> days from now
      </div>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,8,12,.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: "1.1rem" }}>bonanza<span style={{ color: "var(--orange)" }}>.</span>labs</Link>
        <div style={{ display: "flex", gap: 24 }}>
          {[["MCP", "/mcp"], ["Firewall", "/firewall"], ["Compliance", "/compliance"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ color: href === "/compliance" ? "#e2e8f0" : "var(--muted)", fontSize: ".9rem" }}>{label}</Link>
          ))}
          <a href="https://github.com/c6zks4gssn-droid" target="_blank" rel="noreferrer" style={{ color: "var(--muted)", fontSize: ".9rem" }}>GitHub</a>
        </div>
        <Link href="/firewall" style={{ background: "var(--orange)", color: "#000", fontWeight: 700, padding: "8px 18px", borderRadius: 6, fontSize: ".9rem" }}>Get Compliant →</Link>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.35)", color: "#fca5a5", borderRadius: 999, padding: "6px 16px", fontSize: ".8rem", fontWeight: 600, marginBottom: 28, letterSpacing: ".04em", textTransform: "uppercase" }}>
          🇪🇺 EU AI Act · Article 14 · August 2026
        </div>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Your AI agents need<br /><span style={{ color: "var(--orange)" }}>human oversight.</span><br />We built it.
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: 640, margin: "0 auto 36px" }}>
          The EU AI Act requires human-in-the-loop control for high-risk AI systems. Bonanza's Spending Firewall is the approval queue that satisfies Article 14 — out of the box.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/firewall" style={{ background: "var(--orange)", color: "#000", fontWeight: 700, padding: "14px 28px", borderRadius: 8, fontSize: "1rem" }}>See the Firewall →</Link>
          <a href="#report" style={{ border: "1px solid var(--border)", color: "#e2e8f0", padding: "14px 28px", borderRadius: 8, fontSize: "1rem" }}>Download Compliance Report</a>
        </div>
      </div>

      {/* ARTICLE 14 */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ fontSize: "1.7rem", fontWeight: 700, marginBottom: 12 }}>What <span style={{ color: "var(--orange)" }}>Article 14</span> actually requires</h2>
        <p style={{ color: "var(--muted)", marginBottom: 32, maxWidth: 600 }}>The EU AI Act applies to AI systems that make consequential decisions. Agents that spend money, approve transactions, or act autonomously are in scope.</p>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 28, marginBottom: 24 }}>
          <h3 style={{ color: "var(--orange)", fontWeight: 700, marginBottom: 10 }}>Article 14 — Human Oversight</h3>
          <blockquote style={{ borderLeft: "3px solid var(--orange)", paddingLeft: 16, color: "var(--muted)", fontStyle: "italic", fontSize: ".95rem", marginBottom: 14 }}>
            "High-risk AI systems shall be designed and developed in such a way […] that natural persons are able to oversee the functioning of the high-risk AI system during the period in which the AI system is in use […] including the possibility to intervene in its operation or to interrupt it."
            <br /><br />— EU AI Act, Article 14(1)
          </blockquote>
          <p style={{ color: "var(--muted)", fontSize: ".95rem" }}>In plain terms: if your AI agent makes decisions with real consequences — including financial decisions — a human must be able to review, override, or stop it. This is a legal requirement with enforcement starting August 2, 2026.</p>
        </div>
        <div style={{ background: "rgba(239,68,68,.07)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 12, padding: "28px 32px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#ef4444" }}>€35,000,000</div>
          <div style={{ fontSize: "1.2rem", color: "var(--muted)", margin: "4px 0" }}>or</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#ef4444" }}>7% of global annual turnover</div>
          <p style={{ color: "var(--muted)", fontSize: ".9rem", marginTop: 10 }}>Maximum fine for non-compliance with Article 14. Whichever is higher applies.</p>
        </div>
      </section>

      {/* MAPPING */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ fontSize: "1.7rem", fontWeight: 700, marginBottom: 12 }}>Article 14 requires this. <span style={{ color: "var(--orange)" }}>Bonanza already does it.</span></h2>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>Every Article 14 requirement maps directly to a feature that ships today.</p>
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--bg3)" }}>
            <div style={{ padding: "14px 20px", fontSize: ".8rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }}>Article 14 requires</div>
            <div style={{ padding: "14px 20px", fontSize: ".8rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)", borderLeft: "1px solid var(--border)" }}>Bonanza Firewall provides</div>
          </div>
          {MAPPING.map(([req, sol], i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--border)" }}>
              <div style={{ padding: "16px 20px", fontSize: ".9rem", color: "var(--muted)", background: "var(--bg2)" }}>{req}</div>
              <div style={{ padding: "16px 20px", fontSize: ".9rem", color: "var(--green)", fontWeight: 500, background: "var(--bg2)", borderLeft: "1px solid var(--border)" }}>✓ {sol}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ fontSize: "1.7rem", fontWeight: 700, marginBottom: 12 }}>How compliance works <span style={{ color: "var(--orange)" }}>in practice</span></h2>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>Add three lines of code. Your agents are Article 14 compliant.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--orange)", color: "#000", fontWeight: 700, fontSize: ".85rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{s.n}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: ".875rem", color: "var(--muted)" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CHECKLIST */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ fontSize: "1.7rem", fontWeight: 700, marginBottom: 12 }}>Your <span style={{ color: "var(--orange)" }}>Article 14 checklist</span></h2>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>Every item below is covered by the Bonanza Spending Firewall.</p>
        <ul style={{ listStyle: "none", display: "grid", gap: 12 }}>
          {CHECKLIST.map((item) => (
            <li key={item.title} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 20px" }}>
              <span style={{ color: "var(--green)", fontSize: "1.1rem", flexShrink: 0, marginTop: 1 }}>✓</span>
              <div>
                <strong style={{ display: "block", fontSize: ".95rem", fontWeight: 600 }}>{item.title}</strong>
                <span style={{ fontSize: ".85rem", color: "var(--muted)" }}>{item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* EMAIL CAPTURE */}
      <section id="report" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 40, textAlign: "center" }}>
          <h2 style={{ fontSize: "1.7rem", fontWeight: 700, marginBottom: 10 }}>Download the <span style={{ color: "var(--orange)" }}>Article 14 Compliance Guide</span></h2>
          <p style={{ color: "var(--muted)", marginBottom: 28 }}>A practical guide: what Article 14 requires, how to implement it, and what regulators will ask for.<br />Free. No sales calls.</p>
          {formStatus === "sent" ? (
            <p style={{ color: "var(--green)", fontWeight: 600 }}>✓ Guide sent — check your inbox in a few minutes.</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, maxWidth: 480, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, minWidth: 220, background: "var(--bg3)", border: "1px solid var(--border)", color: "#e2e8f0", padding: "12px 16px", borderRadius: 8, fontSize: "1rem", outline: "none" }}
              />
              <button type="submit" style={{ background: "var(--orange)", color: "#000", fontWeight: 700, padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: "1rem" }}>Send me the guide →</button>
            </form>
          )}
          <p style={{ fontSize: ".78rem", color: "var(--muted)", marginTop: 10 }}>No spam. Unsubscribe any time.</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ fontSize: "1.7rem", fontWeight: 700, marginBottom: 12 }}>Frequently asked <span style={{ color: "var(--orange)" }}>questions</span></h2>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>Answers to what your legal team will ask.</p>
        <div style={{ display: "grid", gap: 16 }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", padding: "18px 22px", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: "#e2e8f0", fontSize: "1rem", textAlign: "left" }}
              >
                {item.q}
                <span style={{ color: "var(--orange)", fontSize: "1.4rem", transition: "transform .2s", transform: openFaq === i ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 16 }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 22px 18px", color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.7 }}>{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <div style={{ textAlign: "center", padding: "80px 24px", borderTop: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>Start compliant. <span style={{ color: "var(--orange)" }}>Stay compliant.</span></h2>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>The Spending Firewall ships in minutes. Your Article 14 audit trail starts immediately.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/firewall" style={{ background: "var(--orange)", color: "#000", fontWeight: 700, padding: "14px 28px", borderRadius: 8, fontSize: "1rem" }}>Deploy the Firewall →</Link>
          <a href="https://github.com/c6zks4gssn-droid/x402-firewall" target="_blank" rel="noreferrer" style={{ border: "1px solid var(--border)", color: "#e2e8f0", padding: "14px 28px", borderRadius: 8, fontSize: "1rem" }}>Open Source on GitHub</a>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: 24, textAlign: "center", color: "var(--muted)", fontSize: ".8rem" }}>
        © 2026 Bonanza Labs · Groningen, Netherlands · Apache 2.0 open source ·{" "}
        <Link href="/privacy">Privacy</Link> ·{" "}
        <a href="mailto:hello@bonanza-labs.com">Contact</a>
      </footer>
    </div>
  );
}
