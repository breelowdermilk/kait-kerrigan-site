#!/usr/bin/env node
// Extract KL News posts into AstroWind blog posts (src/data/post)

import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.KL_BASE || 'http://cpanel.kerrigan-lowdermilk.com';
const HTML_ROOT = path.resolve(process.cwd(), 'migration/html');
const OUT_DIR = path.resolve(process.cwd(), 'src/data/post');
const LIMIT = Number(process.env.LIMIT || '0');
const DELAY_MS = Number(process.env.DELAY_MS || '600');

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function stripHtml(html=''){
  return html
    .replace(/<br\s*\/?>(\r?\n)?/gi, '\n')
    .replace(/<\/(p|div|h\d|address|em|strong)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[\s\n]+/g, ' ')
    .trim();
}

function safe(str=''){ return String(str).replace(/\r/g,'').trim(); }

async function readHtml(pathname){
  const local = path.join(HTML_ROOT, pathname.endsWith('/')? pathname : pathname + '/', 'index.html');
  try {
    return await fs.readFile(local, 'utf8');
  } catch {
    const url = new URL(pathname, BASE).toString();
    const res = await fetch(url, { headers: { 'User-Agent': 'KL-Extract/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  }
}

function findNewsLinks(indexHtml){
  // Find /news/YYYY/MM/DD/slug links
  const links = new Set();
  const re = /href=["'](\/news\/(\d{4})\/(\d{2})\/(\d{2})\/([a-z0-9-]+))["']/gi;
  let m; while ((m = re.exec(indexHtml))) { links.add(m[1]); }
  return Array.from(links.values());
}

function parseNews(html){
  const title = (html.match(/<h2 class=\"news-title\">([\s\S]*?)<\/h2>/i)||[])[1]?.trim();
  const dateText = (html.match(/<p class=\"news-date\">([\s\S]*?)<\/p>/i)||[])[1]?.trim();
  const bodyBlock = (html.match(/<div class=\"box pad\">([\s\S]*?)<\/div>\s*<\/div>\s*<div id=\"sidebar\">/i)||[])[1] || (html.match(/<div class=\"box pad\">([\s\S]*?)<\/div>/i)||[])[1] || '';
  // Remove the title + date + first thumb from body
  const bodyAfterHeader = bodyBlock.replace(/^[\s\S]*?<p class=\"news-date\">[\s\S]*?<\/p>/i,'').trim();
  // Extract first <img ... class="thumb"> as main image
  const image = (bodyBlock.match(/<img[^>]+class=\"thumb\"[^>]+src=\"([^\"]+)/i)||[])[1];
  const excerpt = stripHtml(bodyAfterHeader).split(/\s+/).slice(0, 40).join(' ');
  return { title, dateText, bodyHtml: bodyAfterHeader, image, excerpt };
}

function toMD(post){
  // AstroWind post collection requires at least title; publishDate optional
  const lines = ['---'];
  lines.push(`title: "${safe(post.title).replace(/\"/g,'\\"')}"`);
  if (post.dateISO) lines.push(`publishDate: ${post.dateISO}`);
  if (post.image) lines.push(`image: "${post.image}"`);
  lines.push(`excerpt: "${safe(post.excerpt).replace(/\"/g,'\\"')}"`);
  lines.push('category: "News"');
  lines.push('---');
  lines.push('');
  lines.push(post.bodyHtml);
  lines.push('');
  return lines.join('\n');
}

function dateToISO(text){
  // Example: May 21, 2018
  const d = new Date(text);
  if (!isNaN(d)) return d.toISOString();
  return undefined;
}

async function main(){
  await fs.mkdir(OUT_DIR, { recursive: true });
  const indexHtml = await readHtml('/news');
  const links = findNewsLinks(indexHtml);
  const target = LIMIT>0? links.slice(0,LIMIT) : links;
  let count=0;
  for (const href of target){
    const slug = href.split('/').filter(Boolean).slice(-1)[0];
    const outPath = path.join(OUT_DIR, `${slug}.md`);
    try { await fs.access(outPath); console.log(`Skip (exists): ${slug}`); continue; } catch {}
    const html = await readHtml(href);
    const p = parseNews(html);
    if (!p.title) { console.warn(`No title for ${href}`); continue; }
    p.dateISO = p.dateText ? dateToISO(p.dateText) : undefined;
    await fs.writeFile(outPath, toMD(p), 'utf8');
    console.log(`Wrote post: ${slug}`);
    count++;
    await sleep(DELAY_MS);
  }
  console.log(`Done. Wrote ${count} post(s).`);
}

main().catch(err=>{ console.error(err); process.exit(1); });

