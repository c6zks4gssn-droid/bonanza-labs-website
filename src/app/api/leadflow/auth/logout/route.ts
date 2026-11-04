import { NextRequest, NextResponse } from "next/server";
import { deleteLeadflowSession, LEADFLOW_COOKIE } from "@/lib/leadflow-auth";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  await deleteLeadflowSession(request.cookies.get(LEADFLOW_COOKIE)?.value);
  const response = NextResponse.json({ success: true });
  response.cookies.set(LEADFLOW_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
