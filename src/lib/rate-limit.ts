import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter for TenderAI API
// Limits: 10 requests per IP per hour, 100 per day

const requestLog: Map<string, { hourly: number; daily: number; lastHourReset: number; lastDayReset: number }> = new Map();

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const HOUR = 3600000;
  const DAY = 86400000;
  
  let record = requestLog.get(ip);
  
  if (!record) {
    record = { hourly: 0, daily: 0, lastHourReset: now, lastDayReset: now };
    requestLog.set(ip, record);
  }
  
  // Reset counters if time windows have passed
  if (now - record.lastHourReset > HOUR) {
    record.hourly = 0;
    record.lastHourReset = now;
  }
  if (now - record.lastDayReset > DAY) {
    record.daily = 0;
    record.lastDayReset = now;
  }
  
  // Check limits
  if (record.hourly >= 10) {
    const retryAfter = Math.ceil((HOUR - (now - record.lastHourReset)) / 1000);
    return { allowed: false, retryAfter };
  }
  if (record.daily >= 100) {
    const retryAfter = Math.ceil((DAY - (now - record.lastDayReset)) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Increment
  record.hourly++;
  record.daily++;
  
  // Clean up old entries periodically (keep map under 10K entries)
  if (requestLog.size > 10000) {
    const cutoff = now - DAY;
    for (const [key, val] of requestLog.entries()) {
      if (val.lastDayReset < cutoff) requestLog.delete(key);
    }
  }
  
  return { allowed: true };
}

export function applyRateLimit(req: NextRequest): NextResponse | null {
  const ip = getClientIP(req);
  const result = checkRateLimit(ip);
  
  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.', retryAfter: result.retryAfter },
      { 
        status: 429,
        headers: { 'Retry-After': String(result.retryAfter || 60) }
      }
    );
  }
  
  return null; // No rate limit hit, continue
}