import { NextRequest, NextResponse } from "next/server";
import { getLeadflowSession, LEADFLOW_COOKIE } from "@/lib/leadflow-auth";
import { deleteOrgLead, updateOrgLead } from "@/lib/leadflow-data";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  const session = await getLeadflowSession(request.cookies.get(LEADFLOW_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Ongeldige lead." }, { status: 400 });
  try {
    const body = await request.json();
    const lead = await updateOrgLead(session.orgId, id, body);
    return lead ? NextResponse.json({ success: true, lead }) : NextResponse.json({ error: "Lead niet gevonden." }, { status: 404 });
  } catch (error) {
    console.error("LeadFlow update failed", error);
    return NextResponse.json({ error: "Lead kon niet worden bijgewerkt." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const session = await getLeadflowSession(request.cookies.get(LEADFLOW_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Ongeldige lead." }, { status: 400 });
  const deleted = await deleteOrgLead(session.orgId, id);
  return deleted ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Lead niet gevonden." }, { status: 404 });
}
