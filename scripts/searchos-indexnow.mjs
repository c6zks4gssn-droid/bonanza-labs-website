#!/usr/bin/env node
/**
 * SearchOS Publisher: IndexNow submission helper
 * Gebruik: node scripts/searchos-indexnow.mjs [--urls=url1,url2,...] [--all]
 *
 * Vereist env var SEARCHOS_SHARED_KEY (moet overeenkomen met Next.js API route)
 */

import fs from 'node:fs';
import path from 'node:path';

// Read shared key from .env.local or workspace state
const SHARED_KEY = process.env.SEARCHOS_SHARED_KEY || '847e3d95f661518d66260353ec435c35';
const SITE_BASE = 'https://www.bonanza-labs.com';
const API_PATH = '/api/indexnow';

const DEFAULT_URLS = [
  `${SITE_BASE}/`,
  `${SITE_BASE}/serveflow`,
  `${SITE_BASE}/tradeflow`,
  `${SITE_BASE}/bonanza-voice`,
  `${SITE_BASE}/pricing`,
  `${SITE_BASE}/blog`,
  `${SITE_BASE}/blog/7-processen-die-mkb-bedrijven-kunnen-automatiseren`,
  `${SITE_BASE}/blog/van-whatsapp-chaos-naar-een-strak-offerteproces`,
  `${SITE_BASE}/blog/no-shows-verminderen-zonder-gasten-te-irriteren`,
  `${SITE_BASE}/blog/wat-kost-ai-telefonie-voor-een-mkb-bedrijf`,
];

function getUrls() {
  const args = process.argv.slice(2);
  const allFlag = args.includes('--all');
  const urlArg = args.find((a) => a.startsWith('--urls='));
  if (allFlag) return DEFAULT_URLS;
  if (urlArg) {
    return urlArg
      .replace('--urls=', '')
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);
  }
  return DEFAULT_URLS;
}

async function submit(urls) {
  console.log(`[SearchOS] Submitting ${urls.length} URL(s) via IndexNow...`);
  const url = `${SITE_BASE}${API_PATH}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-searchos-key': SHARED_KEY,
    },
    body: JSON.stringify({ urls }),
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  return { ok: res.ok, data };
}

(async () => {
  const urls = getUrls();
  const { ok, data } = await submit(urls);
  process.exit(ok ? 0 : 1);
})().catch((e) => {
  console.error('[SearchOS] Submit failed:', e);
  process.exit(1);
});