import { NextRequest, NextResponse } from "next/server";
import { getLeadflowSession, LEADFLOW_COOKIE } from "@/lib/leadflow-auth";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const session = await getLeadflowSession(request.cookies.get(LEADFLOW_COOKIE)?.value);
  return NextResponse.json({ authenticated: Boolean(session), session: session ? { name: session.name, companyName: session.companyName, email: session.email } : null }, { headers: { "Cache-Control": "no-store" } });
}
