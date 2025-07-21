import { chromium } from '@playwright/test';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create comparison directory
const comparisonDir = join(process.cwd(), 'navigation-comparison');
if (!existsSync(comparisonDir)) {
  mkdirSync(comparisonDir, { recursive: true });
}

async function captureNavigationScreenshots() {
  const browser = await chromium.launch({ headless: false }); // Show browser for visual comparison
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  try {
    // Navigate to the app
    await page.goto('http://localhost:5173');
    
    // Wait for navigation to load
    await page.waitForSelector('.navigation', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Capture full page
    await page.screenshot({
      path: join(comparisonDir, 'current-full-page.png'),
      fullPage: false // Just viewport
    });
    
    // Capture just the navigation sidebar
    const navigation = await page.locator('.navigation');
    await navigation.screenshot({
      path: join(comparisonDir, 'current-navigation-sidebar.png')
    });
    
    // Capture header area (with tabs and controls)
    const header = await page.locator('.header').first();
    if (await header.isVisible()) {
      await header.screenshot({
        path: join(comparisonDir, 'current-header.png')
      });
    }
    
    // Navigate through each visualization to capture their headers
    const visualizations = [
      { name: 'anticipated-tariff-impact', navText: 'Anticipated Tariff Impact' },
      { name: 'country-exposure', navText: 'Country Exposure' },
      { name: 'company-timeline', navText: 'Company Tariff Timeline' },
      { name: 'country-timeline', navText: 'Country Tariff Timeline' },
    ];
    
    for (const viz of visualizations) {
      console.log(`Capturing header for ${viz.name}...`);
      
      // Click on the navigation item
      await page.click(`button:has-text("${viz.navText}")`);
      await page.waitForTimeout(2000);
      
      // Capture the header for this visualization
      const vizHeader = await page.locator('.header').first();
      if (await vizHeader.isVisible()) {
        await vizHeader.screenshot({
          path: join(comparisonDir, `${viz.name}-header.png`)
        });
      }
    }
    
    console.log('\nScreenshots saved to:', comparisonDir);
    console.log('\nNow compare these with the design images to identify differences.');
    
    // Keep browser open for manual comparison
    console.log('\nBrowser will stay open for manual comparison. Press Ctrl+C to close.');
    await new Promise(() => {}); // Keep running indefinitely
    
  } catch (error) {
    console.error('Error capturing screenshots:', error);
  }
}

console.log('Starting navigation comparison...');
console.log('Make sure the dev server is running on http://localhost:5173\n');

captureNavigationScreenshots();