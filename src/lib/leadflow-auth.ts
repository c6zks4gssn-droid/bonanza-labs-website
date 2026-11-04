import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { isRedisConfigured, redisCommand, storageKey, storeJsonRecord } from "@/lib/server-store";

const scrypt = promisify(scryptCallback);
export const LEADFLOW_COOKIE = "bl_leadflow_session";
const SESSION_TTL = 60 * 60 * 24 * 30;
const ACCOUNT_TTL = 60 * 60 * 24 * 3650;

export interface LeadflowSession {
  userId: string;
  orgId: string;
  email: string;
  name: string;
  companyName: string;
}

interface UserRecord {
  id: string;
  orgId: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

function emailIndex(email: string) {
  return `leadflow:user-email:${createHash("sha256").update(email).digest("hex")}`;
}
function sessionKey(token: string) {
  return `leadflow:session:${createHash("sha256").update(token).digest("hex")}`;
}
async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}
async function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = (await scrypt(password, Buffer.from(saltHex, "hex"), expected.length)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function createLeadflowAccount(input: {
  name: string; email: string; password: string; companyName: string;
}): Promise<{ session: LeadflowSession; token: string } | { error: string; status: number }> {
  if (!isRedisConfigured) return { error: "Accountregistratie is tijdelijk niet beschikbaar. Opslag is niet geconfigureerd.", status: 503 };
  const name = input.name.trim().slice(0, 100);
  const email = input.email.trim().toLowerCase().slice(0, 254);
  const companyName = input.companyName.trim().slice(0, 120);
  if (name.length < 2 || companyName.length < 2) return { error: "Vul je naam en bedrijfsnaam in.", status: 400 };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Vul een geldig e-mailadres in.", status: 400 };
  if (input.password.length < 12) return { error: "Gebruik een wachtwoord van minimaal 12 tekens.", status: 400 };

  const userId = crypto.randomUUID();
  const orgId = crypto.randomUUID();
  const user: UserRecord = { id: userId, orgId, email, name, passwordHash: await hashPassword(input.password), createdAt: new Date().toISOString() };
  const claimed = await redisCommand<string>("SET", storageKey(emailIndex(email)), userId, "NX", "EX", ACCOUNT_TTL);
  if (claimed !== "OK") return { error: "Er bestaat al een account met dit e-mailadres.", status: 409 };

  try {
    await storeJsonRecord({ key: `leadflow:user:${userId}`, value: user, ttlSeconds: ACCOUNT_TTL });
    await storeJsonRecord({ key: `leadflow:org:${orgId}`, value: { id: orgId, name: companyName, ownerId: userId, createdAt: user.createdAt }, ttlSeconds: ACCOUNT_TTL });
    const session: LeadflowSession = { userId, orgId, email, name, companyName };
    const token = await createSession(session);
    return { session, token };
  } catch (error) {
    await redisCommand("DEL", storageKey(emailIndex(email)));
    throw error;
  }
}

export async function loginLeadflowAccount(emailInput: string, password: string) {
  if (!isRedisConfigured) return { error: "Inloggen is tijdelijk niet beschikbaar. Opslag is niet geconfigureerd.", status: 503 } as const;
  const email = emailInput.trim().toLowerCase();
  const userId = await redisCommand<string>("GET", storageKey(emailIndex(email)));
  if (!userId) return { error: "E-mailadres of wachtwoord is onjuist.", status: 401 } as const;
  const raw = await redisCommand<string>("GET", storageKey(`leadflow:user:${userId}`));
  if (!raw) return { error: "Account niet gevonden. Neem contact op met support.", status: 404 } as const;
  const user = JSON.parse(raw) as UserRecord;
  if (!(await verifyPassword(password, user.passwordHash))) return { error: "E-mailadres of wachtwoord is onjuist.", status: 401 } as const;
  const orgRaw = await redisCommand<string>("GET", storageKey(`leadflow:org:${user.orgId}`));
  if (!orgRaw) return { error: "Werkruimte niet gevonden.", status: 404 } as const;
  const org = JSON.parse(orgRaw) as { name: string };
  const session: LeadflowSession = { userId: user.id, orgId: user.orgId, email: user.email, name: user.name, companyName: org.name };
  const token = await createSession(session);
  return { session, token };
}

async function createSession(session: LeadflowSession) {
  const token = randomBytes(32).toString("base64url");
  await storeJsonRecord({ key: sessionKey(token), value: session, ttlSeconds: SESSION_TTL });
  return token;
}

export async function getLeadflowSession(token?: string | null): Promise<LeadflowSession | null> {
  if (!token || !isRedisConfigured) return null;
  const raw = await redisCommand<string>("GET", storageKey(sessionKey(token)));
  if (!raw) return null;
  try { return JSON.parse(raw) as LeadflowSession; } catch { return null; }
}

export async function getCurrentLeadflowSession() {
  const jar = await cookies();
  return getLeadflowSession(jar.get(LEADFLOW_COOKIE)?.value);
}

export async function deleteLeadflowSession(token?: string | null) {
  if (token) await redisCommand("DEL", storageKey(sessionKey(token)));
}

export const leadflowCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL,
};
