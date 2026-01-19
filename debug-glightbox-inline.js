const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting GLightbox inline feature debug...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });
  
  // Listen to console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log(`[CONSOLE ERROR]: ${text}`);
    } else if (text.includes('glightbox') || text.includes('GLightbox')) {
      console.log(`[GLIGHTBOX LOG]: ${text}`);
    }
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR]: ${error.message}`);
  });
  
  // Listen to request failures
  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED]: ${request.url()}`);
  });
  
  console.log('Navigating to shows page...');
  await page.goto('http://localhost:4321/shows/', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  
  // Wait a bit for any async initialization
  await page.waitForTimeout(2000);
  
  // Check if GLightbox is loaded
  console.log('\n=== Checking GLightbox initialization ===');
  
  const glightboxInfo = await page.evaluate(() => {
    const info = {
      glightboxLoaded: typeof window.GLightbox !== 'undefined',
      glightboxManagerExists: typeof window.glightboxManager !== 'undefined',
      glightboxInstance: null,
      glightboxAnchors: [],
      inlineContent: [],
      errors: []
    };
    
    // Check if GLightbox constructor exists
    if (info.glightboxLoaded) {
      console.log('[DEBUG] GLightbox library is loaded');
    } else {
      console.error('[DEBUG] GLightbox library NOT loaded');
    }
    
    // Check if manager exists and has instance
    if (info.glightboxManagerExists) {
      console.log('[DEBUG] GLightbox manager exists');
      info.glightboxInstance = window.glightboxManager.lightbox ? 'Initialized' : 'Not initialized';
      
      if (window.glightboxManager.lightbox) {
        console.log('[DEBUG] GLightbox instance is initialized');
      }
    }
    
    // Find all glightbox anchors
    const anchors = document.querySelectorAll('a.glightbox');
    anchors.forEach((anchor, i) => {
      const anchorInfo = {
        index: i,
        href: anchor.getAttribute('href'),
        dataType: anchor.getAttribute('data-type'),
        dataTitle: anchor.getAttribute('data-title'),
        hasInlineTarget: false,
        inlineTargetExists: false
      };
      
      // Check if it's an inline type
      if (anchorInfo.dataType === 'inline' && anchorInfo.href && anchorInfo.href.startsWith('#')) {
        anchorInfo.hasInlineTarget = true;
        const targetId = anchorInfo.href.substring(1);
        const targetElement = document.getElementById(targetId);
        anchorInfo.inlineTargetExists = targetElement !== null;
        
        if (!targetElement) {
          info.errors.push(`Inline target missing: ${anchorInfo.href}`);
        }
      }
      
      info.glightboxAnchors.push(anchorInfo);
    });
    
    // Find all inline content divs
    const inlineContents = document.querySelectorAll('[id^="show-"]');
    inlineContents.forEach(elem => {
      info.inlineContent.push({
        id: elem.id,
        display: window.getComputedStyle(elem).display,
        hidden: elem.style.display === 'none',
        hasContent: elem.innerHTML.length > 0
      });
    });
    
    return info;
  });
  
  console.log('\nGLightbox Status:');
  console.log('- Library loaded:', glightboxInfo.glightboxLoaded);
  console.log('- Manager exists:', glightboxInfo.glightboxManagerExists);
  console.log('- Instance status:', glightboxInfo.glightboxInstance);
  console.log('\nFound', glightboxInfo.glightboxAnchors.length, 'glightbox anchors');
  console.log('Found', glightboxInfo.inlineContent.length, 'inline content elements');
  
  if (glightboxInfo.errors.length > 0) {
    console.log('\n⚠️  ERRORS FOUND:');
    glightboxInfo.errors.forEach(err => console.log('  -', err));
  }
  
  // Log detailed info about inline anchors
  const inlineAnchors = glightboxInfo.glightboxAnchors.filter(a => a.dataType === 'inline');
  if (inlineAnchors.length > 0) {
    console.log('\n=== Inline Anchors Details ===');
    inlineAnchors.forEach(anchor => {
      console.log(`\nAnchor #${anchor.index}:`);
      console.log('  href:', anchor.href);
      console.log('  title:', anchor.dataTitle);
      console.log('  target exists:', anchor.inlineTargetExists);
    });
  }
  
  // Try clicking the first inline anchor
  if (inlineAnchors.length > 0) {
    console.log('\n=== Testing click on first inline anchor ===');
    
    try {
      // Set up promise to wait for modal
      const modalPromise = page.evaluate(() => {
        return new Promise((resolve) => {
          // Check for modal appearance
          let checkCount = 0;
          const checkInterval = setInterval(() => {
            const modalOverlay = document.querySelector('.goverlay');
            const modalContainer = document.querySelector('.glightbox-container');
            checkCount++;
            
            if (modalOverlay || modalContainer) {
              clearInterval(checkInterval);
              resolve({
                success: true,
                overlayVisible: modalOverlay && window.getComputedStyle(modalOverlay).display !== 'none',
                containerVisible: modalContainer && window.getComputedStyle(modalContainer).display !== 'none'
              });
            } else if (checkCount > 20) { // 2 seconds timeout
              clearInterval(checkInterval);
              resolve({ success: false, message: 'Modal did not appear after 2 seconds' });
            }
          }, 100);
        });
      });
      
      // Click the first inline anchor
      await page.click('a.glightbox[data-type="inline"]');
      
      // Wait for modal check
      const modalResult = await modalPromise;
      
      if (modalResult.success) {
        console.log('✅ Modal appeared!');
        console.log('  Overlay visible:', modalResult.overlayVisible);
        console.log('  Container visible:', modalResult.containerVisible);
        
        // Check what content is displayed
        const modalContent = await page.evaluate(() => {
          const container = document.querySelector('.glightbox-container');
          if (container) {
            const contentElem = container.querySelector('.ginlined-content');
            const iframeElem = container.querySelector('iframe');
            const videoElem = container.querySelector('video');
            
            return {
              hasInlineContent: contentElem !== null,
              hasIframe: iframeElem !== null,
              hasVideo: videoElem !== null,
              visibleText: contentElem ? contentElem.innerText.substring(0, 100) : null
            };
          }
          return null;
        });
        
        if (modalContent) {
          console.log('\nModal content:');
          console.log('  Has inline content:', modalContent.hasInlineContent);
          console.log('  Has iframe:', modalContent.hasIframe);
          console.log('  Has video:', modalContent.hasVideo);
          if (modalContent.visibleText) {
            console.log('  Content preview:', modalContent.visibleText + '...');
          }
        }
        
        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
      } else {
        console.log('❌ Modal did not appear');
        console.log('  ', modalResult.message);
        
        // Check if there were any JavaScript errors
        const jsErrors = await page.evaluate(() => {
          return window.__errors || [];
        });
        
        if (jsErrors.length > 0) {
          console.log('\nJavaScript errors detected:');
          jsErrors.forEach(err => console.log('  -', err));
        }
      }
      
    } catch (error) {
      console.log('❌ Error clicking inline anchor:', error.message);
    }
  }
  
  // Check for any GLightbox-specific issues
  console.log('\n=== Checking GLightbox binding ===');
  const bindingCheck = await page.evaluate(() => {
    const anchors = document.querySelectorAll('a.glightbox[data-type="inline"]');
    const results = [];
    
    anchors.forEach((anchor, i) => {
      // Check if anchor has click handlers
      const handlers = window.getEventListeners ? window.getEventListeners(anchor) : null;
      results.push({
        index: i,
        href: anchor.href,
        hasClickHandler: handlers && handlers.click && handlers.click.length > 0,
        dataset: Object.assign({}, anchor.dataset)
      });
    });
    
    return results;
  });
  
  if (bindingCheck.length > 0) {
    console.log('Event binding check:');
    bindingCheck.forEach(item => {
      console.log(`  Anchor #${item.index}: ${item.href}`);
      // Note: getEventListeners only works in Chrome DevTools console, not in evaluate
    });
  }
  
  // Final check - try manual GLightbox API call
  console.log('\n=== Testing manual GLightbox API ===');
  const manualTest = await page.evaluate(() => {
    if (window.glightboxManager && window.glightboxManager.lightbox) {
      try {
        // Try to open modal programmatically
        window.glightboxManager.lightbox.open({
          content: '<div style="padding: 20px;"><h2>Test Content</h2><p>This is a test of the inline modal.</p></div>',
          type: 'inline'
        });
        
        // Check if it opened
        setTimeout(() => {
          const modalVisible = document.querySelector('.glightbox-container');
          if (modalVisible) {
            console.log('[TEST] Manual API call successful - modal opened');
            window.glightboxManager.lightbox.close();
          }
        }, 500);
        
        return { success: true, message: 'API call executed' };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      return { success: false, message: 'GLightbox manager or instance not available' };
    }
  });
  
  console.log('Manual API test:', manualTest.success ? '✅' : '❌', manualTest.message);
  
  console.log('\n=== Debug session complete ===');
  console.log('Browser will remain open for manual inspection.');
  console.log('Press Ctrl+C to close.\n');
  
  // Keep browser open for manual inspection
  await new Promise(() => {});
})();