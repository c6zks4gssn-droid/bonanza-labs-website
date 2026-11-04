import { NextRequest, NextResponse } from "next/server";
import { createLeadflowAccount, LEADFLOW_COOKIE, leadflowCookieOptions } from "@/lib/leadflow-auth";
import { incrementRateLimit } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (await incrementRateLimit(`leadflow:signup:${ip}`, 60 * 60) > 5) return NextResponse.json({ error: "Te veel registratiepogingen. Probeer het later opnieuw." }, { status: 429 });
  try {
    const body = await request.json();
    const result = await createLeadflowAccount({ name: String(body.name || ""), email: String(body.email || ""), password: String(body.password || ""), companyName: String(body.companyName || "") });
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
    const response = NextResponse.json({ success: true, session: { name: result.session.name, companyName: result.session.companyName, email: result.session.email } });
    response.cookies.set(LEADFLOW_COOKIE, result.token, leadflowCookieOptions);
    return response;
  } catch (error) {
    console.error("LeadFlow signup failed", error);
    return NextResponse.json({ error: "Registratie kon niet worden afgerond." }, { status: 500 });
  }
}
