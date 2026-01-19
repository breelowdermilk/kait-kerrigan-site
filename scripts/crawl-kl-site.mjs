#!/usr/bin/env node
// Crawl and mirror selected parts of kerrigan-lowdermilk.com
// Polite: 1 req/sec by default, domain-restricted, allowlist paths.
// Outputs:
//  - migration/html/<path>/index.html
//  - migration/sitemap.json (list of visited URLs)

import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.KL_BASE || 'http://cpanel.kerrigan-lowdermilk.com';
const START = [
  '/',
  '/about',
  '/shows',
  '/albums',
  '/news',
  '/sheet-music',
  '/connect',
];
const ALLOW_PREFIXES = new Set(START.concat(['/shows/', '/albums/', '/news/']));
const DENY_PREFIXES = new Set(['/songs', '/admin', '/wp-admin', '/login']);

const OUT_ROOT = path.resolve(process.cwd(), 'migration');
const HTML_ROOT = path.join(OUT_ROOT, 'html');
const MAP_PATH = path.join(OUT_ROOT, 'sitemap.json');

const DELAY_MS = Number(process.env.DELAY_MS || '1000');
const MAX_PAGES = Number(process.env.MAX_PAGES || '0'); // 0 = unlimited

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function normalizeUrl(u) {
  try {
    const url = new URL(u, BASE);
    // stay on the same host
    const baseHost = new URL(BASE).host;
    if (url.host !== baseHost) return null;
    // strip hash
    url.hash = '';
    // enforce pathname only for filtering
    return url;
  } catch {
    return null;
  }
}

function isAllowed(url) {
  const p = url.pathname;
  for (const d of DENY_PREFIXES) if (p === d || p.startsWith(d + '/')) return false;
  for (const a of ALLOW_PREFIXES) if (p === a || p.startsWith(a)) return true;
  return false;
}

function toFilePath(url) {
  // Map URL path to local path under HTML_ROOT
  let p = url.pathname;
  if (!p.endsWith('/')) p = p + '/';
  const dir = path.join(HTML_ROOT, p);
  const file = path.join(dir, 'index.html');
  return { dir, file };
}

async function saveHtml(url, html) {
  const { dir, file } = toFilePath(url);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(file, html, 'utf8');
}

function extractLinks(html, base) {
  const links = new Set();
  // Anchors
  const re = /<a[^>]+href=["']([^"'#]+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = m[1];
    const nu = normalizeUrl(href);
    if (!nu) continue;
    if (!isAllowed(nu)) continue;
    links.add(nu.toString());
  }
  return Array.from(links.values());
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'KL-Crawler/1.0 (+site migration)'
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

async function main() {
  await fs.mkdir(HTML_ROOT, { recursive: true });
  const base = new URL(BASE);

  const queue = [];
  const visited = new Set();
  const outMap = [];

  for (const s of START) {
    const u = normalizeUrl(s);
    if (u && isAllowed(u)) queue.push(u.toString());
  }

  while (queue.length) {
    if (MAX_PAGES && visited.size >= MAX_PAGES) break;
    const next = queue.shift();
    if (!next || visited.has(next)) continue;
    const url = new URL(next);
    try {
      const html = await fetchText(url.toString());
      await saveHtml(url, html);
      outMap.push({ url: url.toString(), path: url.pathname });
      visited.add(next);

      // enqueue new links
      for (const l of extractLinks(html, base)) {
        if (!visited.has(l)) queue.push(l);
      }
      console.log(`Saved: ${url.pathname}`);
      await sleep(DELAY_MS);
    } catch (e) {
      console.warn(`Skip (${e.message}): ${url}`);
    }
  }

  await fs.mkdir(OUT_ROOT, { recursive: true });
  await fs.writeFile(MAP_PATH, JSON.stringify(outMap, null, 2), 'utf8');
  console.log(`Done. Visited ${visited.size} page(s). Sitemap: ${path.relative(process.cwd(), MAP_PATH)}`);
}

main().catch((err) => { console.error(err); process.exit(1); });

