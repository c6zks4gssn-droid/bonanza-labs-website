/**
 * OpenSourcePackages.tsx
 * Drop this component anywhere on your site (homepage, /firewall, /products).
 * Shows all 5 Bonanza Labs open-source packages with PyPI install commands.
 *
 * Usage:
 *   import OpenSourcePackages from "@/components/OpenSourcePackages";
 *   <OpenSourcePackages />
 */

"use client";

import { useState } from "react";

const PACKAGES = [
  {
    name: "x402-firewall",
    pypi: "x402-firewall",
    github: "https://github.com/c6zks4gssn-droid/x402-firewall",
    pypiUrl: "https://pypi.org/project/x402-firewall/",
    tagline: "Spending firewall for AI agents",
    description:
      "Policy engine + human approval queue + audit log. Every x402 payment is checked before it executes.",
    code: `@guard(budget_usd=25.00, require_approval_above=5.00)
async def my_agent():
    data = await fw.pay_x402("https://api.example.com", max_usd=1.50)`,
    badge: "🛡️",
  },
  {
    name: "bonanza-agent-budget",
    pypi: "bonanza-agent-budget",
    github: "https://github.com/c6zks4gssn-droid/agent-budget",
    pypiUrl: "https://pypi.org/project/bonanza-agent-budget/",
    tagline: "One-line spending control for AI agents",
    description:
      "Track LLM API costs and x402 payments with a single decorator. Raises BudgetExceeded before money moves.",
    code: `@budget(max_usd=10.00)
async def my_agent(query: str):
    response = await llm.chat(query)  # tracked automatically`,
    badge: "💰",
  },
  {
    name: "mcp-guard",
    pypi: "bonanza-mcp-guard",
    github: "https://github.com/c6zks4gssn-droid/mcp-guard",
    pypiUrl: "https://pypi.org/project/bonanza-mcp-guard/",
    tagline: "Production MCP gateway",
    description:
      "JWT auth, rate limiting, spending controls, and audit log for any MCP server.",
    code: `# mcp-guard.yaml
policies:
  auth: jwt
  rate_limit: 100/hour
  max_spend_per_session: 10.00`,
    badge: "🔐",
  },
  {
    name: "ap2-x402-bridge",
    pypi: "ap2-x402-bridge",
    github: "https://github.com/c6zks4gssn-droid/ap2-x402-bridge",
    pypiUrl: "https://pypi.org/project/ap2-x402-bridge/",
    tagline: "Bridge between Google AP2 and Coinbase x402",
    description:
      "The only open-source bridge between Google's Agent Payment Protocol and Coinbase x402. Bidirectional.",
    code: `bridge = BridgeServer(signing_key="my-key")
result = bridge.ap2_to_x402(mandate, x402_url="https://api.example.com")`,
    badge: "🌉",
  },
  {
    name: "hermes-spend",
    pypi: "hermes-spend",
    github: "https://github.com/c6zks4gssn-droid/hermes-spend",
    pypiUrl: "https://pypi.org/project/hermes-spend/",
    tagline: "Native wallet for Hermes Agent",
    description:
      "Service registry, reputation ledger, and wallet for Hermes Agent. Stake reputation, discover services, pay in USDC.",
    code: `wallet = HermesWallet(agent_id="my-agent", private_key=key)
tx = await wallet.pay("service-id", amount_usdc=1.50)`,
    badge: "🤖",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: copied ? "#22c55e" : "#9ca3af",
        fontSize: "12px",
        padding: "2px 6px",
        borderRadius: "4px",
        transition: "color 0.2s",
      }}
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

export default function OpenSourcePackages() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section
      style={{
        background: "#0d1117",
        padding: "64px 24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span
            style={{
              display: "inline-block",
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "20px",
              padding: "4px 14px",
              fontSize: "13px",
              color: "#58a6ff",
              marginBottom: "16px",
            }}
          >
            🐙 Open Source · Apache 2.0
          </span>
          <h2
            style={{
              color: "#e6edf3",
              fontSize: "32px",
              fontWeight: 700,
              margin: "0 0 12px",
            }}
          >
            5 packages. All on PyPI. Zero dependencies.
          </h2>
          <p style={{ color: "#8b949e", fontSize: "16px", margin: 0 }}>
            The infrastructure layer for AI agent payments — free to use, audit,
            and self-host.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              style={{
                background: "#161b22",
                border: `1px solid ${expanded === pkg.name ? "#388bfd" : "#30363d"}`,
                borderRadius: "12px",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              {/* Header row */}
              <div
                onClick={() =>
                  setExpanded(expanded === pkg.name ? null : pkg.name)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "18px 20px",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "24px" }}>{pkg.badge}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        color: "#58a6ff",
                        fontWeight: 600,
                        fontSize: "15px",
                        fontFamily: "monospace",
                      }}
                    >
                      {pkg.name}
                    </span>
                    <span
                      style={{
                        color: "#8b949e",
                        fontSize: "13px",
                      }}
                    >
                      {pkg.tagline}
                    </span>
                  </div>
                </div>

                {/* Install command */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#0d1117",
                    border: "1px solid #30363d",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <code
                    style={{
                      color: "#e6edf3",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    pip install {pkg.pypi}
                  </code>
                  <CopyButton text={`pip install ${pkg.pypi}`} />
                </div>

                <span
                  style={{
                    color: "#8b949e",
                    fontSize: "12px",
                    flexShrink: 0,
                  }}
                >
                  {expanded === pkg.name ? "▲" : "▼"}
                </span>
              </div>

              {/* Expanded section */}
              {expanded === pkg.name && (
                <div
                  style={{
                    borderTop: "1px solid #21262d",
                    padding: "16px 20px 20px",
                  }}
                >
                  <p
                    style={{
                      color: "#8b949e",
                      fontSize: "14px",
                      margin: "0 0 16px",
                      lineHeight: 1.6,
                    }}
                  >
                    {pkg.description}
                  </p>
                  <pre
                    style={{
                      background: "#0d1117",
                      border: "1px solid #30363d",
                      borderRadius: "6px",
                      padding: "12px 14px",
                      color: "#e6edf3",
                      fontSize: "12px",
                      margin: "0 0 16px",
                      overflowX: "auto",
                      lineHeight: 1.6,
                    }}
                  >
                    <code>{pkg.code}</code>
                  </pre>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <a
                      href={pkg.pypiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#58a6ff",
                        fontSize: "13px",
                        textDecoration: "none",
                      }}
                    >
                      📦 PyPI ↗
                    </a>
                    <a
                      href={pkg.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#58a6ff",
                        fontSize: "13px",
                        textDecoration: "none",
                      }}
                    >
                      🐙 GitHub ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a
            href="https://github.com/c6zks4gssn-droid"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#21262d",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "10px 20px",
              color: "#e6edf3",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            🐙 View all repos on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
