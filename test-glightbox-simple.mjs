import puppeteer from 'puppeteer';

console.log('Testing GLightbox inline feature...\n');

const browser = await puppeteer.launch({ 
  headless: false,
  devtools: true 
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

// Listen for console messages  
page.on('console', msg => {
  if (msg.text().includes('glightbox') || msg.text().includes('GLightbox') || msg.text().includes('[DEBUG]')) {
    console.log(`[Browser]: ${msg.text()}`);
  }
});

console.log('Loading shows page...');
await page.goto('http://localhost:4321/shows/', { 
  waitUntil: 'networkidle2',
  timeout: 30000 
});

// Use the new Puppeteer API
await page.waitForFunction(() => true, { timeout: 2000 }).catch(() => {});

// Check the state of GLightbox
const diagnostics = await page.evaluate(() => {
  const result = {
    glightboxLoaded: typeof window.GLightbox !== 'undefined',
    managerExists: typeof window.glightboxManager !== 'undefined',
    instanceReady: false,
    inlineAnchors: 0,
    inlineTargets: 0
  };
  
  if (window.glightboxManager && window.glightboxManager.lightbox) {
    result.instanceReady = true;
  }
  
  // Count inline anchors
  const anchors = document.querySelectorAll('a.glightbox[data-type="inline"]');
  result.inlineAnchors = anchors.length;
  
  // Count inline target divs
  const targets = document.querySelectorAll('[id^="show-"]');
  result.inlineTargets = targets.length;
  
  // Log first anchor details if exists
  if (anchors.length > 0) {
    const first = anchors[0];
    const targetId = first.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    console.log('[DEBUG] First inline anchor:', first.getAttribute('href'));
    console.log('[DEBUG] Target exists:', target !== null);
    if (target) {
      console.log('[DEBUG] Target display:', window.getComputedStyle(target).display);
    }
  }
  
  return result;
});

console.log('\n=== GLightbox Status ===');
console.log('Library loaded:', diagnostics.glightboxLoaded ? '✅' : '❌');
console.log('Manager exists:', diagnostics.managerExists ? '✅' : '❌');  
console.log('Instance ready:', diagnostics.instanceReady ? '✅' : '❌');
console.log('Inline anchors found:', diagnostics.inlineAnchors);
console.log('Inline targets found:', diagnostics.inlineTargets);

if (diagnostics.inlineAnchors > 0) {
  console.log('\n=== Testing inline click ===');
  
  // Try clicking the first inline anchor
  try {
    await page.click('a.glightbox[data-type="inline"]');
    
    // Wait a moment and check for modal
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const modalState = await page.evaluate(() => {
      const overlay = document.querySelector('.goverlay');
      const container = document.querySelector('.glightbox-container');
      const inlineContent = document.querySelector('.ginlined-content');
      
      return {
        overlayExists: overlay !== null,
        containerExists: container !== null,
        hasInlineContent: inlineContent !== null,
        overlayVisible: overlay ? window.getComputedStyle(overlay).display !== 'none' : false,
        containerVisible: container ? window.getComputedStyle(container).display !== 'none' : false
      };
    });
    
    console.log('\nModal check after click:');
    console.log('Overlay exists:', modalState.overlayExists ? '✅' : '❌');
    console.log('Container exists:', modalState.containerExists ? '✅' : '❌');
    console.log('Inline content:', modalState.hasInlineContent ? '✅' : '❌');
    
    if (modalState.overlayExists) {
      console.log('Overlay visible:', modalState.overlayVisible ? '✅' : '❌');
      console.log('Container visible:', modalState.containerVisible ? '✅' : '❌');
    }
    
  } catch (error) {
    console.log('Error during click test:', error.message);
  }
}

// Test programmatic API
console.log('\n=== Testing programmatic API ===');
const apiTest = await page.evaluate(() => {
  if (!window.glightboxManager || !window.glightboxManager.lightbox) {
    return { success: false, message: 'Manager or instance not available' };
  }
  
  try {
    // Try to get the first inline anchor's target
    const firstAnchor = document.querySelector('a.glightbox[data-type="inline"]');
    if (firstAnchor) {
      const targetId = firstAnchor.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Try opening with the actual element
        window.glightboxManager.lightbox.open({
          content: targetElement,
          type: 'inline'
        });
        return { success: true, message: 'Opened with target element' };
      } else {
        // Try with selector
        window.glightboxManager.lightbox.open({
          content: firstAnchor.getAttribute('href'),
          type: 'inline'
        });
        return { success: true, message: 'Opened with selector' };
      }
    }
    return { success: false, message: 'No inline anchors found' };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

console.log('API test result:', apiTest.success ? '✅' : '❌', '-', apiTest.message);

console.log('\n=== Test complete ===');
console.log('Browser will remain open. Press Ctrl+C to close.\n');

// Keep open for inspection
await new Promise(() => {});