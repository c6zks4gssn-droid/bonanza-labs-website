/**
 * reservations.ts — server-side reservation store voor de ServeFlow
 * voice-agent. Gebruikt dezelfde interface als de client-store maar schrijft
 * naar Upstash Redis (productie) OF een lokaal JSON-bestand (dev/test),
 * zodat een Next.js API-route (en dus de ElevenLabs webhook/tool) echt
 * kan werken zonder een browser.
 *
 * Vervang localStorage in de client-store (reservation-store.ts) niet:
 * die is voor een optionele beheerders-UI. Dit is de store die de API draait.
 */
import { promises as fs } from "fs";
import path from "path";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface Reservation {
  id: string;
  requestedAt: string;
  partySize: number;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  confirmedSlot?: string | null;
  status: ReservationStatus;
  createdAt: string;
  source: "voice-agent" | "manual";
}

const REDIS_ENABLED = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

async function redisGet(key: string): Promise<string | null> {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result?: string };
  return data.result ?? null;
}

async function redisSet(key: string, value: string): Promise<void> {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/${encodeURIComponent(key)}`;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  });
}

const LIST_KEY = "serveflow:reservations";
const FILE = path.join(process.cwd(), "data", "reservations.json");

async function fileRead(): Promise<Reservation[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Reservation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function fileWrite(list: Reservation[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

async function readAll(): Promise<Reservation[]> {
  if (REDIS_ENABLED) {
    const raw = await redisGet(LIST_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as Reservation[];
      } catch {
        return [];
      }
    }
    return [];
  }
  return fileRead();
}

async function writeAll(list: Reservation[]): Promise<void> {
  if (REDIS_ENABLED) {
    await redisSet(LIST_KEY, JSON.stringify(list));
  } else {
    await fileWrite(list);
  }
}

export async function listReservations(): Promise<Reservation[]> {
  const all = await readAll();
  return all.sort((a, b) => (a.requestedAt < b.requestedAt ? 1 : -1));
}

export async function createReservation(
  input: Omit<Reservation, "id" | "createdAt" | "status">,
): Promise<Reservation> {
  const record: Reservation = {
    ...input,
    id: `rv_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const all = await readAll();
  all.push(record);
  await writeAll(all);
  return record;
}

export async function getReservation(id: string): Promise<Reservation | null> {
  const all = await readAll();
  return all.find((r) => r.id === id) ?? null;
}

export async function confirmReservation(
  id: string,
  slot: string,
): Promise<Reservation | null> {
  const all = await readAll();
  const found = all.find((r) => r.id === id);
  if (!found) return null;
  found.status = "confirmed";
  found.confirmedSlot = slot;
  await writeAll(all);
  return found;
}

export async function cancelReservation(id: string): Promise<Reservation | null> {
  const all = await readAll();
  const found = all.find((r) => r.id === id);
  if (!found) return null;
  found.status = "cancelled";
  await writeAll(all);
  return found;
}

export function isWithinBusinessHours(requestedAtIso: string): boolean {
  const d = new Date(requestedAtIso);
  const hour = d.getHours();
  return hour >= 12 && hour < 22;
}
