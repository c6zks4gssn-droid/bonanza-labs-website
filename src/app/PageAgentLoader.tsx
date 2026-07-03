"use client";

import { useEffect } from "react";

export default function PageAgentLoader() {
  useEffect(() => {
    if (window.PageAgent || document.getElementById("page-agent-script")) return;

    const script = document.createElement("script");
    script.id = "page-agent-script";
    // Use the non-demo bundle — no auto-init, we configure manually
    script.src = "https://cdn.jsdelivr.net/npm/page-agent@1.10.0/dist/iife/page-agent.js";
    script.crossOrigin = "true";
    script.async = true;

    script.onload = () => {
      console.log("✅ PageAgent loaded, initializing with en-US");
      try {
        new window.PageAgent({
          model: "qwen3.5-plus",
          baseURL: "https://page-ag-testing-ohftxirgbn.cn-shanghai.fcapp.run",
          apiKey: "demo",
          language: "en-US",
        });
      } catch (e) {
        console.error("PageAgent init error:", e.message);
      }
    };

    document.head.appendChild(script);
  }, []);

  return null;
}