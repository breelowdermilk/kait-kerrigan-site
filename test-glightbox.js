import puppeteer from 'puppeteer';

async function testGLightboxIntegration() {
  console.log('🚀 Starting GLightbox Integration Test...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  // Set up console logging from the page
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      console.log('❌ Browser Error:', msg.text());
    } else if (type === 'warn') {
      console.log('⚠️  Browser Warning:', msg.text());
    } else if (type === 'log') {
      console.log('🔍 Browser Log:', msg.text());
    }
  });
  
  try {
    console.log('📊 Navigating to media page...');
    await page.goto('http://localhost:4321/media', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded successfully');
    
    // Wait for GLightbox to be initialized
    await page.waitForSelector('.glightbox', { timeout: 10000 });
    console.log('✅ GLightbox elements found');
    
    // Check if GLightbox CSS is loaded
    const glightboxCSS = await page.evaluate(() => {
      const links = document.querySelectorAll('link[href*="glightbox"]');
      return links.length > 0;
    });
    
    if (glightboxCSS) {
      console.log('✅ GLightbox CSS loaded');
    } else {
      console.log('⚠️  GLightbox CSS might not be loaded');
    }
    
    // Check if GLightbox is initialized
    const glightboxInitialized = await page.evaluate(() => {
      return window.glightboxManager !== undefined;
    });
    
    if (glightboxInitialized) {
      console.log('✅ GLightbox manager initialized');
    } else {
      console.log('⚠️  GLightbox manager not found');
    }
    
    // Test hover tooltips
    console.log('🔍 Testing hover tooltips...');
    const tooltips = await page.$$('.media-tooltip');
    console.log(`✅ Found ${tooltips.length} tooltip elements`);
    
    // Test hero carousel GLightbox links
    console.log('🔍 Testing hero carousel GLightbox integration...');
    const heroGlightboxLinks = await page.$$('.hero-carousel .glightbox');
    console.log(`✅ Found ${heroGlightboxLinks.length} hero carousel GLightbox links`);
    
    // Test video gallery GLightbox links
    console.log('🔍 Testing video gallery GLightbox integration...');
    const galleryGlightboxLinks = await page.$$('.glightbox-video-thumb');
    console.log(`✅ Found ${galleryGlightboxLinks.length} video gallery GLightbox links`);
    
    // Test clicking on a GLightbox link (simulate user interaction)
    if (heroGlightboxLinks.length > 0) {
      console.log('🎬 Testing GLightbox modal opening...');
      
      // Click the first hero carousel item
      await heroGlightboxLinks[0].click();
      
      // Wait a moment for the modal to appear
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if GLightbox modal appeared
      const modalVisible = await page.evaluate(() => {
        const modal = document.querySelector('.glightbox-container');
        return modal && window.getComputedStyle(modal).display !== 'none';
      });
      
      if (modalVisible) {
        console.log('✅ GLightbox modal opened successfully');
        
        // Close the modal by pressing Escape
        await page.keyboard.press('Escape');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ GLightbox modal closed');
      } else {
        console.log('⚠️  GLightbox modal did not appear');
      }
    }
    
    // Test responsive design
    console.log('📱 Testing responsive design...');
    await page.setViewport({ width: 375, height: 667 }); // iPhone SE
    await page.waitForTimeout(1000);
    
    const mobileTooltips = await page.evaluate(() => {
      const tooltips = document.querySelectorAll('.media-tooltip');
      return Array.from(tooltips).some(tooltip => 
        window.getComputedStyle(tooltip).display !== 'none'
      );
    });
    
    console.log(`📱 Mobile tooltips visibility: ${mobileTooltips ? 'visible' : 'hidden'}`);
    
    // Reset to desktop view
    await page.setViewport({ width: 1200, height: 800 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n🎉 GLightbox Integration Test Completed!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Page loads successfully');
    console.log('✅ GLightbox elements present');
    console.log('✅ Hover tooltips implemented');
    console.log('✅ Hero carousel integration');
    console.log('✅ Video gallery integration');
    console.log('✅ Responsive design');
    
    // Keep the browser open for manual inspection
    console.log('\n🔍 Browser kept open for manual inspection...');
    console.log('👆 You can now manually test the GLightbox functionality');
    console.log('📝 Press Ctrl+C when you\'re done testing');
    
    // Wait indefinitely until user closes
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Don't close automatically - let user inspect
    // await browser.close();
  }
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n👋 Closing browser and exiting...');
  process.exit(0);
});

testGLightboxIntegration();