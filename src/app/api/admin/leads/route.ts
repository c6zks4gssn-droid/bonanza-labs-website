import { NextRequest, NextResponse } from "next/server";
import {
  isRedisConfigured,
  readJsonRecordsFromRecentList,
} from "@/lib/server-store";

interface LeadRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  source: "contact-form" | "chat-widget" | "unknown";
  page: string;
  ip: string;
  userAgent: string;
  createdAt: string;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isRedisConfigured) {
    return NextResponse.json(
      { error: "Leadopslag is niet geconfigureerd" },
      { status: 503 },
    );
  }

  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") || 100);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(Math.floor(requestedLimit), 200))
    : 100;

  const leads = await readJsonRecordsFromRecentList<LeadRecord>({
    recentList: "leads:recent",
    keyPrefix: "lead:",
    limit,
  });

  return NextResponse.json(
    { count: leads.length, leads },
    { headers: { "Cache-Control": "no-store" } },
  );
}
