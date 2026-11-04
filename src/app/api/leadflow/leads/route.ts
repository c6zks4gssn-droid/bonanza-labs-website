import { NextRequest, NextResponse } from "next/server";
import { getLeadflowSession, LEADFLOW_COOKIE } from "@/lib/leadflow-auth";
import { createOrgLead, listOrgLeads, type LeadInput } from "@/lib/leadflow-data";
import { incrementRateLimit } from "@/lib/server-store";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getLeadflowSession(request.cookies.get(LEADFLOW_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  const leads = await listOrgLeads(session.orgId);
  return NextResponse.json({ leads, count: leads.length }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const session = await getLeadflowSession(request.cookies.get(LEADFLOW_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  if (await incrementRateLimit(`leadflow:create:${session.orgId}`, 60) > 100) return NextResponse.json({ error: "Te veel wijzigingen. Probeer het later opnieuw." }, { status: 429 });
  try {
    const body = await request.json();
    const inputs: LeadInput[] = Array.isArray(body.leads) ? body.leads.slice(0, 200) : [body];
    const created = [];
    for (const input of inputs) {
      if (!input || typeof input !== "object" || typeof input.company !== "string") continue;
      const lead = await createOrgLead(session.orgId, input);
      if (lead) created.push(lead);
    }
    if (!created.length) return NextResponse.json({ error: "Geen geldige leads gevonden. Bedrijfsnaam is verplicht." }, { status: 400 });
    return NextResponse.json({ success: true, created: created.length, leads: created }, { status: 201 });
  } catch (error) {
    console.error("LeadFlow create lead failed", error);
    return NextResponse.json({ error: "Leads konden niet worden opgeslagen." }, { status: 500 });
  }
}
