#!/usr/bin/env node
// Optimize images for mobile + desktop budget. Idempotent — safe to re-run.
//
// Usage:
//   node scripts/optimize-images.mjs           # process everything
//   node scripts/optimize-images.mjs --check   # dry-run, report only
//
// Requires: `npm install --no-save sharp` (svgo is invoked via npx separately).
//
// EDIT THE CONSTANTS BELOW for the project. Anything ABOVE the "PROJECT CONFIG"
// section is generic; everything below should be tuned per-site.
//
// What this script does:
//   1. Logos (raster only): cap at MAX_LOGO_W, re-encode in original format.
//      SVG logos should be hand-cleaned with `npx svgo <paths>`.
//   2. Photos: cap at MAX_PHOTO_W, mozjpeg q82.
//   3. Hero / LCP photos: also generates `<basename>-640.jpg` mobile companion
//      for use in `srcset`.
//
// Idempotent: skips files where re-encoding produces a larger file. Also
// filters `*-640.jpg` from its own input so re-runs don't double-suffix.

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ────────────────────────────────────────────────────────────────────────────
// PROJECT CONFIG — edit for the current site
// ────────────────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Where the static assets live (the folder served as-is to the browser).
const PUBLIC_DIR = path.join(ROOT, 'public');

// Directories under PUBLIC_DIR to walk. Use paths relative to PUBLIC_DIR.
// Each entry has a `glob` pattern (matched as a regex on the relative path)
// and a `kind` of either 'logo' or 'photo'.
//
// Examples:
//   { glob: /^clients\/[^/]+\/logos\//, kind: 'logo' }
//   { glob: /^images\/heroes\//, kind: 'photo' }
//   { glob: /^assets\/photos\//, kind: 'photo' }
// kait-kerrigan: everything under public/images/ is photographic content
// (show posters, media headshots, hero shots). Treat all as 'photo'.
const TARGETS = [
  { glob: /^images\//, kind: 'photo' },
];

// kait-hero.jpg is the homepage LCP candidate.
const HERO_FILES = [
  'images/kait-hero.jpg',
];

// Skip these files entirely (relative to PUBLIC_DIR). Useful for press-kit
// downloads or files where the original size is the point.
const SKIP_FILES = [
  // 'press-kit/full-resolution.jpg',
];

// Encoding budgets.
const MAX_LOGO_W = 600;
const MAX_PHOTO_W = 1600;
const MOBILE_PHOTO_W = 640;
const PHOTO_QUALITY = 82;
const MOBILE_QUALITY = 78;
const LOGO_QUALITY = 88;

// Convert non-transparent photographic PNGs to JPG.
// Photographic content stored as PNG is the single biggest savings opportunity
// on most sites (typical: 3 MB PNG → 200 KB JPG). Default to TRUE.
//
// If true, the script:
//   1. Detects PNG files classified as 'photo' that have no alpha channel
//   2. Re-encodes them as JPG
//   3. Renames the file (.png → .jpg) and removes the old file
//   4. Scans REWRITE_REFS_DIRS for references and updates them
//
// Set to false to keep PNGs as PNGs (no rename, no ref rewrites).
const CONVERT_PNG_TO_JPG = true;

// Directories to scan for references to renamed files (relative to ROOT).
// Add 'public' if templates / RSS feeds in public/ also reference image paths.
const REWRITE_REFS_DIRS = ['src'];

// File extensions to scan inside REWRITE_REFS_DIRS for image references.
const REF_FILE_EXTS = new Set([
  '.astro', '.tsx', '.ts', '.jsx', '.js', '.mjs',
  '.html', '.htm', '.md', '.mdx', '.css', '.scss', '.json',
]);

// ────────────────────────────────────────────────────────────────────────────
// Below here: generic, no need to edit
// ────────────────────────────────────────────────────────────────────────────

const dryRun = process.argv.includes('--check');
let savedBytes = 0;
let count = 0;

const fmtKB = (b) => (b / 1024).toFixed(1) + 'KB';
const isMobileCompanion = (file) => /-640\.jpg$/i.test(file);
const isOptimizable = (file) => /\.(png|jpe?g|webp)$/i.test(file);

function classifyPath(relPath) {
  for (const t of TARGETS) {
    if (t.glob.test(relPath)) return t.kind;
  }
  return null;
}

// Tracks {oldRelPath, newRelPath} for files that changed format.
const renames = [];

async function reencodeRaster(srcPath, ext, maxWidth, isPhoto) {
  let img = sharp(srcPath);
  const meta = await img.metadata();
  if (meta.width && meta.width > maxWidth) {
    img = img.resize({ width: maxWidth, withoutEnlargement: true });
  }

  // PNG photo with no transparency → convert to JPG. Photographic content
  // stored as PNG is the single biggest win on most sites (3 MB → 200 KB).
  if (CONVERT_PNG_TO_JPG && ext === '.png' && isPhoto && !meta.hasAlpha) {
    const buf = await img.jpeg({ quality: PHOTO_QUALITY, mozjpeg: true }).toBuffer();
    return [buf, '.jpg'];
  }

  if (ext === '.webp') {
    return [await img.webp({ quality: isPhoto ? PHOTO_QUALITY : LOGO_QUALITY }).toBuffer(), ext];
  }
  if (ext === '.png') {
    return [await img.png({ compressionLevel: 9, palette: !isPhoto }).toBuffer(), ext];
  }
  return [await img.jpeg({ quality: isPhoto ? PHOTO_QUALITY : LOGO_QUALITY, mozjpeg: true }).toBuffer(), ext];
}

async function optimizeInPlace(absPath, relPath, isPhoto) {
  const ext = path.extname(absPath).toLowerCase();
  const file = path.basename(absPath);
  if (!isOptimizable(file)) return;
  if (isMobileCompanion(file)) return;
  if (SKIP_FILES.includes(relPath)) return;

  const before = fs.statSync(absPath).size;
  const maxW = isPhoto ? MAX_PHOTO_W : MAX_LOGO_W;

  let buf, newExt;
  try {
    [buf, newExt] = await reencodeRaster(absPath, ext, maxW, isPhoto);
  } catch (e) {
    console.error(`  ! ${relPath}: ${e.message}`);
    return;
  }

  // Format change (e.g. .png → .jpg): write the new file, remove the old one,
  // and track the rename so refs in src/ can be rewritten in a later pass.
  if (newExt !== ext) {
    if (buf.length < before) {
      const newPath = absPath.slice(0, -ext.length) + newExt;
      const newRel = relPath.slice(0, -ext.length) + newExt;
      if (!dryRun) {
        fs.writeFileSync(newPath, buf);
        fs.unlinkSync(absPath);
      }
      renames.push({ oldRel: relPath, newRel, oldBase: path.basename(relPath), newBase: path.basename(newRel) });
      savedBytes += before - buf.length;
      count++;
      console.log(`  ${relPath}: ${fmtKB(before)} -> ${fmtKB(buf.length)}  [FORMAT: ${ext} → ${newExt}]`);
    }
    return;
  }

  if (buf.length < before) {
    if (!dryRun) fs.writeFileSync(absPath, buf);
    savedBytes += before - buf.length;
    count++;
    console.log(`  ${relPath}: ${fmtKB(before)} -> ${fmtKB(buf.length)}`);
  }
}

async function generateMobileCompanion(absPath, relPath) {
  const ext = path.extname(absPath);
  const base = absPath.slice(0, -ext.length);
  const dest = `${base}-640.jpg`;

  const buf = await sharp(absPath)
    .resize({ width: MOBILE_PHOTO_W, withoutEnlargement: true })
    .jpeg({ quality: MOBILE_QUALITY, mozjpeg: true })
    .toBuffer();

  if (!dryRun) fs.writeFileSync(dest, buf);
  console.log(`  + mobile ${path.relative(PUBLIC_DIR, dest)}: ${fmtKB(buf.length)}`);
}

function* walk(dir, base = dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(abs, base);
    } else if (entry.isFile()) {
      yield { abs, rel: path.relative(base, abs).split(path.sep).join('/') };
    }
  }
}

function rewriteReferences() {
  if (renames.length === 0) return;
  console.log('\n== REWRITING REFERENCES ==');
  let filesTouched = 0;
  let totalReplacements = 0;

  // Build a single regex that matches any of the renamed files' basenames.
  // Match the basename only (not any partial path) to avoid false positives.
  const escapedBases = renames.map((r) => r.oldBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const renameMap = new Map(renames.map((r) => [r.oldBase, r.newBase]));

  for (const refDirRel of REWRITE_REFS_DIRS) {
    const refDir = path.join(ROOT, refDirRel);
    if (!fs.existsSync(refDir)) continue;
    for (const { abs } of walk(refDir)) {
      if (!REF_FILE_EXTS.has(path.extname(abs).toLowerCase())) continue;
      let content;
      try {
        content = fs.readFileSync(abs, 'utf8');
      } catch {
        continue;
      }
      let modified = content;
      let touched = false;
      for (const oldBase of escapedBases) {
        const re = new RegExp(`(^|[/"' \`(])${oldBase}(?=$|["' \`)\\s>])`, 'g');
        modified = modified.replace(re, (m, prefix) => {
          touched = true;
          totalReplacements++;
          return prefix + renameMap.get(m.slice(prefix.length));
        });
      }
      if (touched) {
        if (!dryRun) fs.writeFileSync(abs, modified);
        filesTouched++;
        console.log(`  ${path.relative(ROOT, abs)}`);
      }
    }
  }
  console.log(`  → ${filesTouched} files updated, ${totalReplacements} references rewritten`);
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`PUBLIC_DIR does not exist: ${PUBLIC_DIR}`);
    process.exit(1);
  }

  console.log(`\n== ${dryRun ? '[DRY RUN] ' : ''}Optimizing ${PUBLIC_DIR} ==`);

  for (const { abs, rel } of walk(PUBLIC_DIR)) {
    const kind = classifyPath(rel);
    if (!kind) continue;
    await optimizeInPlace(abs, rel, kind === 'photo');
  }

  if (HERO_FILES.length > 0) {
    console.log('\n== HERO COMPANIONS ==');
    for (const rel of HERO_FILES) {
      const abs = path.join(PUBLIC_DIR, rel);
      if (!fs.existsSync(abs)) {
        console.error(`  ! ${rel}: not found`);
        continue;
      }
      try {
        await generateMobileCompanion(abs, rel);
      } catch (e) {
        console.error(`  ! ${rel}: ${e.message}`);
      }
    }
  }

  rewriteReferences();

  console.log(
    `\n== ${dryRun ? '[DRY RUN] ' : ''}${count} files modified, ${fmtKB(savedBytes)} saved ==`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
