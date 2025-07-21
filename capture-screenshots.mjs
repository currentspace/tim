import { chromium } from '@playwright/test';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create screenshots directory if it doesn't exist
const screenshotsDir = join(process.cwd(), 'screenshots');
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true });
}

const visualizations = [
  { 
    name: 'anticipated-tariff-impact', 
    navText: 'Anticipated Tariff Impact'
  },
  { 
    name: 'country-exposure', 
    navText: 'Country Exposure'
  },
  { 
    name: 'company-tariff-timeline', 
    navText: 'Company Tariff Timeline'
  },
  { 
    name: 'country-tariff-timeline', 
    navText: 'Country Tariff Timeline'
  },
  { 
    name: 'startup-universe', 
    navText: 'Startup Universe'
  },
];

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  try {
    // Navigate to the app
    await page.goto('http://localhost:5173');
    
    // Wait for initial load
    await page.waitForTimeout(3000);
    
    // Capture each visualization
    for (const viz of visualizations) {
      console.log(`Capturing ${viz.name}...`);
      
      // Click on the navigation item
      await page.click(`button:has-text("${viz.navText}")`);
      
      // Wait for content to load and animations to complete
      await page.waitForTimeout(4000);
      
      // Take a screenshot
      await page.screenshot({
        path: join('screenshots', `${viz.name}.png`),
        fullPage: true,
      });
      
      console.log(`✓ Captured ${viz.name}`);
    }
    
    console.log('\nAll screenshots captured successfully!');
  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Make sure dev server is running
console.log('Make sure the dev server is running on http://localhost:5173');
console.log('Starting screenshot capture...\n');

captureScreenshots();