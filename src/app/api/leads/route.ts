import { NextRequest, NextResponse } from "next/server";

interface Lead {
  name: string;
  email: string;
  message?: string;
  source: string; // "contact-form" | "chat-widget"
  page: string; // URL waar de lead vandaan komt
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, source, page } = body;

    // Validatie
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Naam is vereist" }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geldig e-mailadres vereist" }, { status: 400 });
    }

    // Rate limiting (basic — voor productie: Vercel KV)
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    // TODO: implement KV-based rate limiting

    const lead: Lead = {
      name: name.trim(),
      email: email.trim(),
      message: message?.trim() || "",
      source: source || "unknown",
      page: page || "",
      timestamp: new Date().toISOString(),
    };

    // Opslag: log + email notificatie (voor productie: opslaan in KV/database + email sturen)
    console.log("New lead:", JSON.stringify(lead));

    // Stuur notificatie email (via Vercel's email service of een eenvoudige webhook)
    // TODO: implement email notification

    return NextResponse.json({ success: true, id: `lead-${Date.now()}` });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ error: "Interne fout" }, { status: 500 });
  }
}