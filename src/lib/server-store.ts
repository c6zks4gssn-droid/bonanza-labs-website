type RedisValue = string | number;
type RedisCommand = RedisValue[];
type RedisResponse<T = unknown> = { result?: T; error?: string };

const REST_URL = (
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || ""
).replace(/\/$/, "");
const REST_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";

export const isRedisConfigured = Boolean(REST_URL && REST_TOKEN);

// Scheiding tussen test- en productiegegevens.
//
// Staat STORAGE_NAMESPACE gezet (bijvoorbeeld "test"), dan krijgt elke sleutel dat
// voorvoegsel: test:lead:…, test:rate:leads:… enzovoort. Op productie is de variabele
// leeg, dus daar verandert er niets aan bestaande sleutels of gegevens.
//
// Waarom: een testlead of testbetaling hoort nooit tussen de echte gegevens te staan,
// en de adminlijst op de testomgeving hoort alleen testgegevens te tonen.
export function storageKey(key: string): string {
  const prefix = (process.env.STORAGE_NAMESPACE || "").trim().replace(/:+$/, "");
  return prefix ? `${prefix}:${key}` : key;
}

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!isRedisConfigured) return null;

  const response = await fetch(`${REST_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as RedisResponse<T>;
  if (!response.ok || payload.error) {
    throw new Error(payload.error || `Upstash request failed with ${response.status}`);
  }

  return payload.result ?? null;
}

export async function redisCommand<T = unknown>(...command: RedisCommand): Promise<T | null> {
  const path = `/${command.map((part) => encodeURIComponent(String(part))).join("/")}`;
  return request<T>(path, { method: "POST" });
}

export async function redisPipeline(commands: RedisCommand[]): Promise<RedisResponse[]> {
  if (!isRedisConfigured) return [];

  const response = await fetch(`${REST_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });

  const payload = (await response.json()) as RedisResponse[] | RedisResponse;
  if (!response.ok || !Array.isArray(payload)) {
    const message = !Array.isArray(payload) ? payload.error : undefined;
    throw new Error(message || `Upstash pipeline failed with ${response.status}`);
  }

  const failed = payload.find((item) => item.error);
  if (failed?.error) throw new Error(failed.error);

  return payload;
}

export async function acquireLock(key: string, ttlSeconds = 60 * 60 * 24): Promise<boolean> {
  if (!isRedisConfigured) return true;
  const result = await redisCommand<string>("SET", storageKey(key), "1", "NX", "EX", ttlSeconds);
  return result === "OK";
}

export async function incrementRateLimit(key: string, windowSeconds: number): Promise<number> {
  if (!isRedisConfigured) return 1;

  const count = (await redisCommand<number>("INCR", storageKey(key))) || 1;
  if (count === 1) {
    await redisCommand("EXPIRE", storageKey(key), windowSeconds);
  }
  return count;
}

export async function storeJsonRecord(options: {
  key: string;
  value: unknown;
  ttlSeconds?: number;
  recentList?: string;
  recentValue?: string;
  recentLimit?: number;
}): Promise<boolean> {
  if (!isRedisConfigured) return false;

  const ttl = options.ttlSeconds ?? 60 * 60 * 24 * 365;
  const commands: RedisCommand[] = [
    ["SET", storageKey(options.key), JSON.stringify(options.value), "EX", ttl],
  ];

  if (options.recentList && options.recentValue) {
    const listKey = storageKey(options.recentList);
    commands.push(["LPUSH", listKey, options.recentValue]);
    commands.push(["LTRIM", listKey, 0, (options.recentLimit ?? 500) - 1]);
  }

  await redisPipeline(commands);
  return true;
}

export async function readJsonRecordsFromRecentList<T>(options: {
  recentList: string;
  keyPrefix: string;
  limit?: number;
}): Promise<T[]> {
  if (!isRedisConfigured) return [];

  const limit = Math.max(1, Math.min(options.limit ?? 100, 200));
  const ids =
    (await redisCommand<string[]>("LRANGE", storageKey(options.recentList), 0, limit - 1)) || [];

  if (ids.length === 0) return [];

  const responses = await redisPipeline(
    ids.map((id) => ["GET", `${storageKey(options.keyPrefix)}${id}`]),
  );

  return responses.flatMap((response) => {
    if (typeof response.result !== "string") return [];

    try {
      return [JSON.parse(response.result) as T];
    } catch {
      return [];
    }
  });
}
