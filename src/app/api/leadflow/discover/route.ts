import { NextRequest, NextResponse } from "next/server";
import { getLeadflowSession, LEADFLOW_COOKIE } from "@/lib/leadflow-auth";
import { incrementRateLimit } from "@/lib/server-store";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getLeadflowSession(request.cookies.get(LEADFLOW_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Log in om bedrijven te zoeken." }, { status: 401 });
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Bedrijfszoekfunctie is nog niet gekoppeld. Voeg GOOGLE_MAPS_API_KEY toe in Vercel om Google Places te activeren. Je kunt nu al leads handmatig toevoegen of via CSV importeren." }, { status: 503 });
  if (await incrementRateLimit(`leadflow:discover:${session.orgId}`, 60) > 20) return NextResponse.json({ error: "Zoeklimiet bereikt. Probeer het later opnieuw." }, { status: 429 });
  try {
    const body = await request.json();
    const query = typeof body.query === "string" ? body.query.trim().slice(0, 120) : "";
    const region = typeof body.region === "string" ? body.region.trim().slice(0, 80) : "Nederland";
    if (query.length < 2) return NextResponse.json({ error: "Vul een branche of zoekterm in." }, { status: 400 });
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.primaryTypeDisplayName" },
      body: JSON.stringify({ textQuery: `${query} in ${region}`, pageSize: 10, languageCode: "nl", regionCode: "NL" }),
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ error: "De bedrijfsbron kon de zoekopdracht niet uitvoeren." }, { status: 502 });
    const payload = await response.json() as { places?: Array<{ id?: string; displayName?: { text?: string }; formattedAddress?: string; websiteUri?: string; nationalPhoneNumber?: string; primaryTypeDisplayName?: { text?: string } }> };
    const places = (payload.places || []).map((place) => ({
      placeId: place.id || "",
      company: place.displayName?.text || "Onbekend bedrijf",
      address: place.formattedAddress || "",
      website: place.websiteUri || "",
      phone: place.nationalPhoneNumber || "",
      industry: place.primaryTypeDisplayName?.text || query,
      source: "Google Places",
    }));
    return NextResponse.json({ results: places }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("LeadFlow discovery failed", error);
    return NextResponse.json({ error: "Zoeken is tijdelijk niet beschikbaar." }, { status: 500 });
  }
}
