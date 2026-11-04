import { NextRequest, NextResponse } from "next/server";
import { loginLeadflowAccount, LEADFLOW_COOKIE, leadflowCookieOptions } from "@/lib/leadflow-auth";
import { incrementRateLimit } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (await incrementRateLimit(`leadflow:login:${ip}`, 15 * 60) > 10) return NextResponse.json({ error: "Te veel inlogpogingen. Probeer het later opnieuw." }, { status: 429 });
  try {
    const body = await request.json();
    const result = await loginLeadflowAccount(String(body.email || ""), String(body.password || ""));
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
    const response = NextResponse.json({ success: true, session: { name: result.session.name, companyName: result.session.companyName, email: result.session.email } });
    response.cookies.set(LEADFLOW_COOKIE, result.token, leadflowCookieOptions);
    return response;
  } catch (error) {
    console.error("LeadFlow login failed", error);
    return NextResponse.json({ error: "Inloggen is niet gelukt." }, { status: 500 });
  }
}
