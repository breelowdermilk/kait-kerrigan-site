#!/usr/bin/env node
// Extract albums (recordings) into MDX from mirrored HTML (or live fallback)

import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.KL_BASE || 'http://cpanel.kerrigan-lowdermilk.com';
const HTML_ROOT = path.resolve(process.cwd(), 'migration/html');
const OUT_DIR = path.resolve(process.cwd(), 'src/content/recordings');
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

function safe(str=''){ return String(str).replace(/\r/g,'').replace(/\n/g,' ').trim(); }

async function readHtmlOrFetch(pathname){
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

function parseAlbumSlugs(indexHtml){
  const slugs = new Set();
  const re = /<a[^>]+href=["'](\/albums\/([a-z0-9-]+))["']/gi;
  let m; while ((m = re.exec(indexHtml))) { slugs.add(m[2]); }
  return Array.from(slugs.values());
}

function parseAlbum(html){
  const title = (html.match(/<h3>([\s\S]*?)<\/h3>/i)||[])[1]?.trim();
  const photo = (html.match(/<div id=\"photo\">[\s\S]*?<img[^>]+src=\"([^\"]+)/i)||[])[1];
  const descBlock = (html.match(/<h3>[\s\S]*?<\/h3>([\s\S]*?)<h2>/i)||[])[1] || '';
  const description = stripHtml(descBlock);
  const apple = (html.match(/href=\"(https?:\/\/itunes\.apple\.com[^\"]+)\"/i)||[])[1];
  return { title: title? stripHtml(title) : undefined, coverImage: photo, description: description || undefined, streamLinks: apple? { apple } : undefined };
}

function frontmatter(obj){
  const lines = ['---'];
  const kv = (k,v)=>{ if(v===undefined||v===null||v==='') return; if(typeof v==='string'){lines.push(`${k}: "${safe(v).replace(/\"/g,'\\"')}"`);} else { lines.push(`${k}: ${JSON.stringify(v)}`);} };
  kv('title', obj.title);
  kv('coverImage', obj.coverImage);
  kv('streamLinks', obj.streamLinks);
  lines.push('tracks: []');
  lines.push('credits: []');
  lines.push('---');
  return lines.join('\n');
}

async function main(){
  await fs.mkdir(OUT_DIR, { recursive: true });
  const albumsIndex = await readHtmlOrFetch('/albums');
  const slugs = parseAlbumSlugs(albumsIndex);
  const target = LIMIT>0? slugs.slice(0,LIMIT) : slugs;
  let count=0;
  for (const slug of target){
    const outPath = path.join(OUT_DIR, `${slug}.mdx`);
    try { await fs.access(outPath); console.log(`Skip (exists): ${slug}`); continue; } catch {}
    const html = await readHtmlOrFetch(`/albums/${slug}`);
    const data = parseAlbum(html);
    if (!data.title) { console.warn(`No title for album ${slug}`); continue; }
    const fm = frontmatter(data);
    const body = data.description? `\n${data.description}\n` : '\n';
    await fs.writeFile(outPath, fm + '\n' + body, 'utf8');
    console.log(`Wrote album: ${slug}`);
    count++;
    await sleep(DELAY_MS);
  }
  console.log(`Done. Wrote ${count} album file(s).`);
}

main().catch(err=>{ console.error(err); process.exit(1); });

