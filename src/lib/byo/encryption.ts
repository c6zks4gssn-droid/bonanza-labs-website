import crypto from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey(): Buffer {
  const raw = process.env.BYO_LLM_ENCRYPTION_KEY;
  if (raw) {
    // accept hex (64 chars) or base64 (44 chars) or pass phrase (hashed)
    if (/^[0-9a-f]{64}$/i.test(raw)) return Buffer.from(raw, "hex");
    if (raw.length >= 32) return Buffer.from(raw).subarray(0, 32);
    return crypto.createHash("sha256").update(raw).digest();
  }
  // dev fallback — explicit, not silent
  if (process.env.NODE_ENV !== "production") {
    return crypto.createHash("sha256").update("dev-only-do-not-ship").digest();
  }
  throw new Error("BYO_LLM_ENCRYPTION_KEY missing in production");
}

export function encryptKey(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // base64url: iv . tag . ciphertext
  return [iv, tag, enc]
    .map((b) => b.toString("base64url"))
    .join(".");
}

export function decryptKey(payload: string): string {
  const parts = payload.split(".");
  if (parts.length !== 3) throw new Error("malformed byo token");
  const [ivB64, tagB64, encB64] = parts;
  const key = getKey();
  const iv = Buffer.from(ivB64, "base64url");
  const tag = Buffer.from(tagB64, "base64url");
  const enc = Buffer.from(encB64, "base64url");
  if (iv.length !== IV_LEN) throw new Error("bad iv");
  if (tag.length !== TAG_LEN) throw new Error("bad tag");
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString("utf8");
}

// tiny HMAC signature for the cookie so it can't be tampered with
export function signCookie(provider: string, expiresAt: number): string {
  const secret = getKey();
  return crypto
    .createHmac("sha256", secret)
    .update(`${provider}:${expiresAt}`)
    .digest("base64url");
}

export function verifyCookie(
  provider: string,
  expiresAt: number,
  signature: string,
): boolean {
  const expected = signCookie(provider, expiresAt);
  // constant-time compare
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
