#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const CONFIG = {
  url: 'http://localhost:4323/media',
  screenshotsDir: './test-screenshots',
  viewports: [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 }
  ],
  timeout: 30000,
  waitForSelectors: [
    '.hero-carousel', 
    '.featured-releases',
    '.video-gallery',
    '.streaming-links'
  ]
};

class MediaPageTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      timestamp: new Date().toISOString(),
      url: CONFIG.url,
      screenshots: [],
      errors: [],
      warnings: [],
      elements: {},
      performance: {},
      responsive: {},
      accessibility: {}
    };
    
    // Ensure screenshots directory exists
    if (!fs.existsSync(CONFIG.screenshotsDir)) {
      fs.mkdirSync(CONFIG.screenshotsDir, { recursive: true });
    }
  }

  async init() {
    console.log('🚀 Starting Media Page Test Suite...');
    
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Listen for console messages and errors
    this.page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        this.results.errors.push({
          type: 'console-error',
          message: text,
          timestamp: new Date().toISOString()
        });
        console.log('❌ Console Error:', text);
      } else if (type === 'warn') {
        this.results.warnings.push({
          type: 'console-warning',
          message: text,
          timestamp: new Date().toISOString()
        });
        console.log('⚠️  Console Warning:', text);
      }
    });
    
    // Listen for page errors
    this.page.on('pageerror', error => {
      this.results.errors.push({
        type: 'page-error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.log('❌ Page Error:', error.message);
    });
    
    // Listen for failed network requests
    this.page.on('response', response => {
      if (!response.ok() && response.status() >= 400) {
        this.results.errors.push({
          type: 'network-error',
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: new Date().toISOString()
        });
        console.log(`❌ Network Error: ${response.status()} ${response.statusText()} - ${response.url()}`);
      }
    });
  }

  async navigateToPage() {
    console.log(`📍 Navigating to ${CONFIG.url}...`);
    
    try {
      await this.page.goto(CONFIG.url, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: CONFIG.timeout
      });
      
      // Wait a bit more for any dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Page loaded successfully');
    } catch (error) {
      this.results.errors.push({
        type: 'navigation-error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
      console.log('❌ Failed to load page:', error.message);
      throw error;
    }
  }

  async testElementPresence() {
    console.log('🔍 Testing element presence...');
    
    const elementsToTest = [
      { selector: '.hero-carousel', name: 'Hero Carousel' },
      { selector: '.featured-releases', name: 'Featured Releases' },
      { selector: '.video-gallery', name: 'Video Gallery' },
      { selector: '.streaming-links', name: 'Streaming Links' },
      { selector: 'nav', name: 'Navigation' },
      { selector: 'footer', name: 'Footer' },
      // Additional specific selectors
      { selector: '[data-carousel]', name: 'Carousel Container' },
      { selector: '.carousel-slide', name: 'Carousel Slides' },
      { selector: '.video-item', name: 'Video Items' },
      { selector: '.streaming-platform', name: 'Streaming Platforms' }
    ];
    
    for (const element of elementsToTest) {
      try {
        const elementExists = await this.page.$(element.selector);
        const isVisible = elementExists ? await elementExists.isIntersectingViewport() : false;
        
        this.results.elements[element.name] = {
          selector: element.selector,
          exists: !!elementExists,
          visible: isVisible,
          count: await this.page.$$(element.selector).then(els => els.length)
        };
        
        if (elementExists && isVisible) {
          console.log(`✅ ${element.name}: Found and visible`);
        } else if (elementExists) {
          console.log(`⚠️  ${element.name}: Found but not visible`);
        } else {
          console.log(`❌ ${element.name}: Not found`);
        }
      } catch (error) {
        console.log(`❌ Error testing ${element.name}:`, error.message);
        this.results.elements[element.name] = {
          selector: element.selector,
          exists: false,
          visible: false,
          error: error.message
        };
      }
    }
  }

  async testCarouselFunctionality() {
    console.log('🎠 Testing carousel functionality...');
    
    try {
      // Look for carousel controls
      const nextButton = await this.page.$('.carousel-next, .swiper-button-next, [data-carousel-next]');
      const prevButton = await this.page.$('.carousel-prev, .swiper-button-prev, [data-carousel-prev]');
      const dots = await this.page.$$('.carousel-dot, .swiper-pagination-bullet');
      
      this.results.elements['Carousel Controls'] = {
        nextButton: !!nextButton,
        prevButton: !!prevButton,
        dotsCount: dots.length
      };
      
      // Test carousel size
      const carousel = await this.page.$('.hero-carousel, [data-carousel]');
      if (carousel) {
        const boundingBox = await carousel.boundingBox();
        this.results.elements['Carousel Size'] = {
          width: boundingBox.width,
          height: boundingBox.height,
          x: boundingBox.x,
          y: boundingBox.y
        };
        
        console.log(`📏 Carousel dimensions: ${boundingBox.width}x${boundingBox.height}`);
        
        // Check if carousel is too large (taking up more than viewport height)
        const viewportHeight = await this.page.evaluate(() => window.innerHeight);
        if (boundingBox.height > viewportHeight * 0.8) {
          this.results.warnings.push({
            type: 'carousel-size',
            message: `Carousel height (${boundingBox.height}px) may be too large for viewport (${viewportHeight}px)`,
            timestamp: new Date().toISOString()
          });
          console.log('⚠️  Carousel may be too large for viewport');
        }
      }
      
      // Test carousel interaction
      if (nextButton) {
        console.log('🔄 Testing carousel navigation...');
        await nextButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Carousel next button clicked');
      }
      
    } catch (error) {
      console.log('❌ Error testing carousel:', error.message);
      this.results.errors.push({
        type: 'carousel-test-error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testResponsiveDesign() {
    console.log('📱 Testing responsive design...');
    
    for (const viewport of CONFIG.viewports) {
      console.log(`📐 Testing ${viewport.name} (${viewport.width}x${viewport.height})...`);
      
      await this.page.setViewport({
        width: viewport.width,
        height: viewport.height
      });
      
      // Wait for any responsive adjustments
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Take screenshot
      const screenshotPath = path.join(CONFIG.screenshotsDir, `media-page-${viewport.name}.png`);
      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      
      this.results.screenshots.push({
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        path: screenshotPath
      });
      
      // Test specific responsive elements
      try {
        const menuButton = await this.page.$('.mobile-menu-toggle, .hamburger, [data-mobile-menu]');
        const navigation = await this.page.$('nav');
        
        this.results.responsive[viewport.name] = {
          mobileMenuVisible: !!menuButton && await menuButton.isIntersectingViewport(),
          navigationVisible: !!navigation && await navigation.isIntersectingViewport(),
          viewportWidth: viewport.width,
          viewportHeight: viewport.height
        };
        
        // Test carousel on different viewports
        const carousel = await this.page.$('.hero-carousel, [data-carousel]');
        if (carousel) {
          const boundingBox = await carousel.boundingBox();
          this.results.responsive[viewport.name].carouselSize = {
            width: boundingBox.width,
            height: boundingBox.height
          };
        }
        
      } catch (error) {
        console.log(`❌ Error testing responsive design for ${viewport.name}:`, error.message);
      }
    }
    
    // Reset to desktop viewport
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async testPerformance() {
    console.log('⚡ Testing performance...');
    
    try {
      const metrics = await this.page.metrics();
      
      this.results.performance = {
        JSEventListeners: metrics.JSEventListeners,
        Nodes: metrics.Nodes,
        JSHeapUsedSize: Math.round(metrics.JSHeapUsedSize / 1024 / 1024 * 100) / 100 + ' MB',
        JSHeapTotalSize: Math.round(metrics.JSHeapTotalSize / 1024 / 1024 * 100) / 100 + ' MB'
      };
      
      console.log(`📊 Performance metrics captured`);
    } catch (error) {
      console.log('❌ Error collecting performance metrics:', error.message);
    }
  }

  async testAccessibility() {
    console.log('♿ Testing basic accessibility...');
    
    try {
      // Check for basic accessibility features
      const hasH1 = await this.page.$('h1');
      const hasAltTexts = await this.page.$$eval('img', imgs => 
        imgs.every(img => img.alt !== undefined)
      );
      const hasSkipLink = await this.page.$('a[href="#main"], .skip-link');
      const hasFocusableElements = await this.page.$$(':focus-visible');
      
      this.results.accessibility = {
        hasH1: !!hasH1,
        allImagesHaveAlt: hasAltTexts,
        hasSkipLink: !!hasSkipLink,
        focusableElementsCount: hasFocusableElements.length
      };
      
      console.log('✅ Basic accessibility checks completed');
    } catch (error) {
      console.log('❌ Error testing accessibility:', error.message);
    }
  }

  async generateReport() {
    console.log('📋 Generating test report...');
    
    const reportPath = path.join(CONFIG.screenshotsDir, 'media-page-test-report.json');
    const readableReportPath = path.join(CONFIG.screenshotsDir, 'media-page-test-report.md');
    
    // Save detailed JSON report
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    // Generate readable markdown report
    const report = this.generateMarkdownReport();
    fs.writeFileSync(readableReportPath, report);
    
    console.log(`📄 Reports saved:`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   Markdown: ${readableReportPath}`);
    
    return { jsonReport: reportPath, markdownReport: readableReportPath };
  }

  generateMarkdownReport() {
    const errorCount = this.results.errors.length;
    const warningCount = this.results.warnings.length;
    
    let report = `# Media Page Test Report\n\n`;
    report += `**Generated:** ${this.results.timestamp}\n`;
    report += `**URL:** ${this.results.url}\n`;
    report += `**Status:** ${errorCount === 0 ? '✅ PASS' : '❌ FAIL'} (${errorCount} errors, ${warningCount} warnings)\n\n`;
    
    // Summary
    report += `## Summary\n\n`;
    if (errorCount === 0) {
      report += `🎉 All tests passed! The media page is functioning correctly.\n\n`;
    } else {
      report += `⚠️ Found ${errorCount} error(s) and ${warningCount} warning(s) that need attention.\n\n`;
    }
    
    // Errors
    if (errorCount > 0) {
      report += `## ❌ Errors Found\n\n`;
      this.results.errors.forEach((error, index) => {
        report += `### ${index + 1}. ${error.type}\n`;
        report += `**Message:** ${error.message}\n`;
        if (error.url) report += `**URL:** ${error.url}\n`;
        if (error.status) report += `**Status:** ${error.status} ${error.statusText}\n`;
        report += `**Time:** ${error.timestamp}\n\n`;
      });
    }
    
    // Warnings
    if (warningCount > 0) {
      report += `## ⚠️ Warnings\n\n`;
      this.results.warnings.forEach((warning, index) => {
        report += `### ${index + 1}. ${warning.type}\n`;
        report += `**Message:** ${warning.message}\n`;
        report += `**Time:** ${warning.timestamp}\n\n`;
      });
    }
    
    // Element Status
    report += `## 🔍 Element Status\n\n`;
    Object.entries(this.results.elements).forEach(([name, data]) => {
      const status = data.exists && data.visible ? '✅' : data.exists ? '⚠️' : '❌';
      report += `${status} **${name}**: `;
      
      if (data.exists && data.visible) {
        report += `Found and visible`;
        if (data.count) report += ` (${data.count} elements)`;
      } else if (data.exists) {
        report += `Found but not visible`;
      } else {
        report += `Not found`;
        if (data.error) report += ` (Error: ${data.error})`;
      }
      
      report += `\n`;
      if (data.selector) report += `   - Selector: \`${data.selector}\`\n`;
      if (data.width && data.height) {
        report += `   - Dimensions: ${data.width}x${data.height}px\n`;
      }
      report += `\n`;
    });
    
    // Responsive Design
    report += `## 📱 Responsive Design\n\n`;
    Object.entries(this.results.responsive).forEach(([viewport, data]) => {
      report += `### ${viewport.charAt(0).toUpperCase() + viewport.slice(1)} (${data.viewportWidth}x${data.viewportHeight})\n`;
      report += `- Mobile menu: ${data.mobileMenuVisible ? '✅ Visible' : '❌ Not visible'}\n`;
      report += `- Navigation: ${data.navigationVisible ? '✅ Visible' : '❌ Not visible'}\n`;
      if (data.carouselSize) {
        report += `- Carousel size: ${data.carouselSize.width}x${data.carouselSize.height}px\n`;
      }
      report += `\n`;
    });
    
    // Screenshots
    report += `## 📸 Screenshots\n\n`;
    this.results.screenshots.forEach(screenshot => {
      report += `- **${screenshot.viewport}** (${screenshot.dimensions}): \`${screenshot.path}\`\n`;
    });
    
    // Performance
    if (Object.keys(this.results.performance).length > 0) {
      report += `\n## ⚡ Performance\n\n`;
      Object.entries(this.results.performance).forEach(([key, value]) => {
        report += `- **${key}**: ${value}\n`;
      });
    }
    
    // Accessibility
    if (Object.keys(this.results.accessibility).length > 0) {
      report += `\n## ♿ Accessibility\n\n`;
      Object.entries(this.results.accessibility).forEach(([key, value]) => {
        const status = value ? '✅' : '❌';
        report += `${status} **${key}**: ${value}\n`;
      });
    }
    
    report += `\n---\n*Report generated by Media Page Test Suite*\n`;
    
    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runFullTest() {
    try {
      await this.init();
      await this.navigateToPage();
      await this.testElementPresence();
      await this.testCarouselFunctionality();
      await this.testResponsiveDesign();
      await this.testPerformance();
      await this.testAccessibility();
      
      const reportPaths = await this.generateReport();
      
      // Print summary
      console.log('\n🏁 Test Complete!');
      console.log(`Errors: ${this.results.errors.length}`);
      console.log(`Warnings: ${this.results.warnings.length}`);
      console.log(`Screenshots: ${this.results.screenshots.length}`);
      
      return reportPaths;
      
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Run the test suite
async function main() {
  const tester = new MediaPageTester();
  
  try {
    const reports = await tester.runFullTest();
    console.log('\n✅ Media page testing completed successfully!');
    console.log('Check the reports for detailed findings.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Media page testing failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default MediaPageTester;