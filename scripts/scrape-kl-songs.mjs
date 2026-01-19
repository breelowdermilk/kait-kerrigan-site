#!/usr/bin/env node
// Minimal scraper for Kerrigan–Lowdermilk Songs index -> MDX
// No external deps: uses fetch + regex. Polite rate limiting.

import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.KL_BASE || 'http://cpanel.kerrigan-lowdermilk.com';
const INDEX_URL = new URL('/songs', BASE).toString();
const OUT_DIR = path.resolve(process.cwd(), 'src/content/songs');
const REPORT_DIR = path.resolve(process.cwd(), 'migration');
const CSV_PATH = path.join(REPORT_DIR, 'song_export_summary.csv');

const LIMIT = Number(process.env.LIMIT || '0'); // 0 = no limit
const DELAY_MS = Number(process.env.DELAY_MS || '1000'); // 1 req/sec

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function safeYaml(str = '') {
  // Escape problematic characters for YAML and strip excessive whitespace
  return String(str)
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\"/g, '"')
    .trim();
}

function stripHtml(html = '') {
  return html
    .replace(/<br\s*\/?>(\r?\n)?/gi, '\n')
    .replace(/<\/(p|div|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/[\s\n]+/g, ' ')
    .trim();
}

function excerptWords(text = '', min = 30, max = 60) {
  const words = text.split(/\s+/).filter(Boolean);
  const n = Math.min(Math.max(min, Math.min(words.length, max)), words.length);
  return words.slice(0, n).join(' ');
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'KL-Scraper/1.0 (+https://bree-site)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function getSongLinks(indexHtml) {
  // Collect unique /songs/{slug} links from the table
  const links = new Set();
  const re = /href="(\/songs\/([a-z0-9-]+))"/gi;
  let m;
  while ((m = re.exec(indexHtml))) {
    const href = m[1];
    const slug = m[2];
    // Skip index self-link
    if (slug && slug !== 'index') links.add({ href, slug });
  }
  return Array.from(links.values());
}

function parseSong(html, slug) {
  // Title
  const title = (html.match(/<div id=\"lyrics\">[\s\S]*?<h3>([\s\S]*?)<\/h3>/i) || [])[1]?.trim() || slug;
  // Albums/Shows paragraph
  const albumsBlock = (html.match(/<p class=\"albums\">([\s\S]*?)<\/p>/i) || [])[1] || '';
  const showMatch = (albumsBlock.match(/<a[^>]*>([\s\S]*?)<\/a>/i) || [])[1];
  const show = showMatch ? stripHtml(showMatch) : undefined;

  // YouTube
  const ytHref = (html.match(/href=\"https?:\/\/www\.youtube\.com\/watch\?v=([^\"&<>]+)\"/i) || [])[1];
  const youtubeId = ytHref ? ytHref : undefined;

  // Sheet music
  let sheetProvider, sheetUrl;
  const sm = html.match(/href=\"(https?:\/\/(?:www\.)?(newmusicaltheatre|musicnotes)[^\"]+)\"[^>]*>[^<]*((?:Buy )?Sheet Music)?/i);
  if (sm) {
    sheetUrl = sm[1];
    sheetProvider = sm[2] === 'newmusicaltheatre' ? 'NewMusicalTheatre' : sm[2] === 'musicnotes' ? 'Musicnotes' : undefined;
  }

  // Lyrics (text inside #lyrics after h3 and albums p)
  const lyricsBlock = (html.match(/<div id=\"lyrics\">([\s\S]*?)<div id=\"info\">/i) || [])[1] ||
                      (html.match(/<div id=\"lyrics\">([\s\S]*?)<\/div>/i) || [])[1] || '';
  const lyricsText = stripHtml(lyricsBlock.replace(/^[\s\S]*?<p[^>]*>/, ''));
  const lyricExcerpt = lyricsText ? excerptWords(lyricsText, 30, 60) : undefined;

  // Heuristic voice type
  const vt = [];
  if (/\bWOMAN\b/i.test(html) && /\bMAN\b/i.test(html)) vt.push('Duet');

  return {
    title: stripHtml(title),
    show,
    voiceTypes: vt,
    keys: [],
    moods: [],
    lyricExcerpt,
    sheetMusic: sheetUrl ? { provider: sheetProvider, url: sheetUrl } : undefined,
    media: youtubeId ? { youtubeId } : undefined,
    credits: [],
    coverImage: undefined,
    published: true,
  };
}

function toFrontmatter(obj) {
  const lines = [];
  lines.push('---');
  const pushKV = (k, v) => {
    if (v === undefined || v === null) return;
    if (typeof v === 'string') {
      const s = safeYaml(v);
      lines.push(`${k}: "${s.replace(/\"/g, '\\"')}"`);
    } else if (Array.isArray(v)) {
      if (v.length === 0) return;
      const arr = v.map((x) => (typeof x === 'string' ? `"${safeYaml(x)}"` : JSON.stringify(x)) ).join(', ');
      lines.push(`${k}: [${arr}]`);
    } else if (typeof v === 'object') {
      // simple 1-level objects
      const objStr = Object.entries(v)
        .filter(([, val]) => val !== undefined)
        .map(([kk, val]) => `${kk}: ${typeof val === 'string' ? `"${safeYaml(val)}"` : JSON.stringify(val)}`)
        .join(', ');
      lines.push(`${k}: { ${objStr} }`);
    } else {
      lines.push(`${k}: ${String(v)}`);
    }
  };
  pushKV('title', obj.title);
  pushKV('show', obj.show);
  pushKV('voiceTypes', obj.voiceTypes);
  pushKV('keys', obj.keys);
  pushKV('moods', obj.moods);
  pushKV('lyricExcerpt', obj.lyricExcerpt);
  pushKV('sheetMusic', obj.sheetMusic);
  pushKV('media', obj.media);
  pushKV('credits', obj.credits);
  pushKV('coverImage', obj.coverImage);
  pushKV('published', obj.published);
  lines.push('---');
  return lines.join('\n');
}

async function ensureDirs() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(REPORT_DIR, { recursive: true });
}

async function writeCSVHeader() {
  const header = 'slug,title,show,youtubeId,sheetMusicUrl\n';
  try {
    await fs.access(CSV_PATH);
  } catch {
    await fs.writeFile(CSV_PATH, header, 'utf8');
  }
}

async function appendCSV(row) {
  const line = [row.slug, row.title, row.show ?? '', row.youtubeId ?? '', row.sheetMusicUrl ?? '']
    .map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(',') + '\n';
  await fs.appendFile(CSV_PATH, line, 'utf8');
}

async function main() {
  await ensureDirs();
  await writeCSVHeader();
  console.log(`Fetching index: ${INDEX_URL}`);
  const indexHtml = await fetchText(INDEX_URL);
  const links = getSongLinks(indexHtml);
  console.log(`Found ${links.length} song links.`);

  const toProcess = LIMIT > 0 ? links.slice(0, LIMIT) : links;
  let count = 0;
  for (const { href, slug } of toProcess) {
    const url = new URL(href, BASE).toString();
    const outPath = path.join(OUT_DIR, `${slug}.mdx`);
    try {
      // Idempotent: skip if file exists
      await fs.access(outPath);
      console.log(`Skip (exists): ${slug}`);
      continue;
    } catch {}

    console.log(`Scrape: ${url}`);
    const html = await fetchText(url);
    const data = parseSong(html, slug);
    const fm = toFrontmatter(data);
    const body = data.lyricExcerpt ? `\n> ${safeYaml(data.lyricExcerpt)}\n` : '\n';
    await fs.writeFile(outPath, fm + '\n' + body, 'utf8');
    await appendCSV({ slug, title: data.title, show: data.show, youtubeId: data.media?.youtubeId, sheetMusicUrl: data.sheetMusic?.url });

    count++;
    await sleep(DELAY_MS);
  }

  console.log(`Done. Wrote ${count} MDX file(s). Summary: ${path.relative(process.cwd(), CSV_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

