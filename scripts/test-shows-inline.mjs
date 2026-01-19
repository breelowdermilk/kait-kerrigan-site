#!/usr/bin/env node
import puppeteer from 'puppeteer';
import fs from 'node:fs';

const guessUrls = [
  'http://localhost:4321/shows',
  'http://localhost:4322/shows',
  'http://localhost:4323/shows',
  'http://localhost:4600/shows',
];

const target = process.argv[2] || process.env.URL || '';

async function tryUrl(url) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  console.log(`Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle0' });

  const diag = await page.evaluate(() => ({
    anchors: document.querySelectorAll('a.glightbox[data-type="inline"]').length,
    hasGLGlobal: !!window.GLightbox,
    hasManager: !!window.glightboxManager,
    managerHasLightbox: !!(window.glightboxManager && window.glightboxManager.lightbox),
  }));
  console.log('Diagnosis:', diag);

  if (diag.anchors === 0) {
    throw new Error('No inline glightbox anchors found on page.');
  }

  // Click first anchor
  await page.click('a.glightbox[data-type="inline"]');

  let appeared = false;
  try {
    await page.waitForSelector('.glightbox-container, .goverlay', { timeout: 5000 });
    appeared = true;
  } catch {}
  console.log('Modal appeared after click:', appeared);

  // Programmatic fallback attempt
  if (!appeared) {
    await page.evaluate(() => {
      const a = document.querySelector('a.glightbox[data-type="inline"]');
      const href = a && a.getAttribute('href');
      if (href && window.glightboxManager && window.glightboxManager.lightbox) {
        window.glightboxManager.lightbox.open({ href, type: 'inline', title: a.getAttribute('data-title') || undefined });
      }
    });
    try {
      await page.waitForSelector('.glightbox-container, .goverlay', { timeout: 5000 });
      appeared = true;
    } catch {}
    console.log('Modal appeared after programmatic open:', appeared);
  }

  // Save screenshot
  try { fs.mkdirSync('site/tmp', { recursive: true }); } catch {}
  await page.screenshot({ path: 'site/tmp/shows-inline.png' });

  await browser.close();
  return appeared;
}

(async () => {
  const urls = target ? [target] : guessUrls;
  let success = false;
  for (const url of urls) {
    try {
      const ok = await tryUrl(url);
      success = ok;
      if (ok) break;
    } catch (err) {
      console.warn(`Attempt failed for ${url}:`, err.message);
    }
  }
  if (!success) {
    console.error('Inline GLightbox did not open in automated test. See site/tmp/shows-inline.png for state.');
    process.exit(1);
  } else {
    console.log('✅ Inline GLightbox opened successfully. Screenshot saved to site/tmp/shows-inline.png');
  }
})();

