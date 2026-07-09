import { cookies } from "next/headers";
import { decryptKey, encryptKey, signCookie, verifyCookie } from "./encryption";

export const BYO_COOKIE = "byo_llm_session";
export const COOKIE_TTL_SECONDS = 60 * 60 * 24; // 24h

export type ByoProvider = "ollama";

export interface ByoSession {
  provider: ByoProvider;
  apiKey: string;
  expiresAt: number;
}

export interface ByoCookiePayload {
  provider: ByoProvider;
  encKey: string; // encrypted api key
  expiresAt: number;
  sig: string;
}

export function buildCookieValue(session: { provider: ByoProvider; apiKey: string }): {
  name: string;
  value: string;
  options: {
    httpOnly: true;
    secure: boolean;
    sameSite: "lax";
    path: "/";
    maxAge: number;
  };
} {
  const expiresAt = Math.floor(Date.now() / 1000) + COOKIE_TTL_SECONDS;
  const encKey = encryptKey(session.apiKey);
  const sig = signCookie(session.provider, expiresAt);
  const payload: ByoCookiePayload = {
    provider: session.provider,
    encKey,
    expiresAt,
    sig,
  };
  return {
    name: BYO_COOKIE,
    value: encodeURIComponent(JSON.stringify(payload)),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_TTL_SECONDS,
    },
  };
}

export async function readByoSession(): Promise<ByoSession | null> {
  const store = await cookies();
  const raw = store.get(BYO_COOKIE)?.value;
  if (!raw) return null;
  let payload: ByoCookiePayload;
  try {
    payload = JSON.parse(decodeURIComponent(raw)) as ByoCookiePayload;
  } catch {
    return null;
  }
  if (payload.expiresAt < Math.floor(Date.now() / 1000)) return null;
  if (!verifyCookie(payload.provider, payload.expiresAt, payload.sig)) return null;
  let apiKey: string;
  try {
    apiKey = decryptKey(payload.encKey);
  } catch {
    return null;
  }
  return { provider: payload.provider, apiKey, expiresAt: payload.expiresAt };
}
