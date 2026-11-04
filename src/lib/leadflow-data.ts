import { redisCommand, storeJsonRecord, readJsonRecordsFromRecentList } from "@/lib/server-store";

export const LEAD_STATUSES = ["nieuw", "gekwalificeerd", "benaderd", "gesprek", "klant", "verloren"] as const;
export type LeadStatus = typeof LEAD_STATUSES[number];
export const LEAD_PRODUCTS = ["TradeFlow", "ServeFlow", "Bonanza Voice", "Nog bepalen"] as const;
export type LeadProduct = typeof LEAD_PRODUCTS[number];

export interface LeadRecord {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  province: string;
  industry: string;
  product: LeadProduct;
  status: LeadStatus;
  source: string;
  notes: string;
  score: number;
  scoreReasons: string[];
  createdAt: string;
  updatedAt: string;
}

export type LeadInput = Partial<Omit<LeadRecord, "id" | "score" | "scoreReasons" | "createdAt" | "updatedAt">> & { company: string };

const provinces = ["Groningen", "Friesland", "Drenthe", "Overijssel"];
export function scoreLead(lead: Pick<LeadRecord, "industry" | "province" | "email" | "phone" | "website" | "product">) {
  let score = 25;
  const reasons: string[] = [];
  const industry = lead.industry.toLowerCase();
  if (lead.product === "ServeFlow" || /horeca|restaurant|hotel|catering|café|cafe/.test(industry)) {
    if (/horeca|restaurant|hotel|catering|café|cafe/.test(industry)) { score += 30; reasons.push("Branche sluit aan op ServeFlow"); }
  } else if (lead.product === "TradeFlow" || /bouw|install|techniek|construct|aannem/.test(industry)) {
    if (/bouw|install|techniek|construct|aannem/.test(industry)) { score += 30; reasons.push("Branche sluit aan op TradeFlow"); }
  } else if (lead.product === "Bonanza Voice") {
    score += 20; reasons.push("Geselecteerd voor Bonanza Voice");
  }
  if (provinces.includes(lead.province)) { score += 20; reasons.push("In een primaire doelprovincie"); }
  if (lead.email || lead.phone) { score += 10; reasons.push("Direct contactgegeven beschikbaar"); }
  if (lead.website) { score += 10; reasons.push("Website beschikbaar"); }
  return { score: Math.min(100, score), scoreReasons: reasons };
}

function clean(value: unknown, max = 500) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
export function normalizeLead(input: LeadInput, existing?: LeadRecord): LeadRecord | null {
  const company = clean(input.company ?? existing?.company, 160);
  if (company.length < 2) return null;
  const product = LEAD_PRODUCTS.includes(input.product as LeadProduct) ? input.product as LeadProduct : existing?.product ?? "Nog bepalen";
  const status = LEAD_STATUSES.includes(input.status as LeadStatus) ? input.status as LeadStatus : existing?.status ?? "nieuw";
  const lead = {
    id: existing?.id ?? crypto.randomUUID(),
    company,
    contactName: clean(input.contactName ?? existing?.contactName, 120),
    email: clean(input.email ?? existing?.email, 254).toLowerCase(),
    phone: clean(input.phone ?? existing?.phone, 60),
    website: clean(input.website ?? existing?.website, 300),
    city: clean(input.city ?? existing?.city, 100),
    province: clean(input.province ?? existing?.province, 80),
    industry: clean(input.industry ?? existing?.industry, 100),
    product,
    status,
    source: clean(input.source ?? existing?.source ?? "Handmatig", 80),
    notes: clean(input.notes ?? existing?.notes, 3000),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const scored = scoreLead(lead);
  return { ...lead, ...scored };
}

export async function listOrgLeads(orgId: string) {
  return readJsonRecordsFromRecentList<LeadRecord>({
    recentList: `leadflow:org:${orgId}:leads`,
    keyPrefix: `leadflow:org:${orgId}:lead:`,
    limit: 500,
  });
}

export async function createOrgLead(orgId: string, input: LeadInput) {
  const lead = normalizeLead(input);
  if (!lead) return null;
  const ok = await storeJsonRecord({
    key: `leadflow:org:${orgId}:lead:${lead.id}`,
    value: lead,
    ttlSeconds: 60 * 60 * 24 * 3650,
    recentList: `leadflow:org:${orgId}:leads`,
    recentValue: lead.id,
    recentLimit: 5000,
  });
  return ok ? lead : null;
}

export async function updateOrgLead(orgId: string, id: string, input: Partial<LeadInput>) {
  const key = `leadflow:org:${orgId}:lead:${id}`;
  const raw = await redisCommand<string>("GET", (await import("@/lib/server-store")).storageKey(key));
  if (!raw) return null;
  const existing = JSON.parse(raw) as LeadRecord;
  const lead = normalizeLead({ ...existing, ...input, company: input.company ?? existing.company }, existing);
  if (!lead) return null;
  const ok = await storeJsonRecord({ key, value: lead, ttlSeconds: 60 * 60 * 24 * 3650 });
  return ok ? lead : null;
}

export async function deleteOrgLead(orgId: string, id: string) {
  const { storageKey } = await import("@/lib/server-store");
  const key = `leadflow:org:${orgId}:lead:${id}`;
  const removed = await redisCommand<number>("DEL", storageKey(key));
  if (removed) await redisCommand("LREM", storageKey(`leadflow:org:${orgId}:leads`), 0, id);
  return Boolean(removed);
}
