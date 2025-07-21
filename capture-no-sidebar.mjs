import { chromium } from '@playwright/test';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const screenshotsDir = join(process.cwd(), 'screenshots-no-sidebar');
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true });
}

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    await page.screenshot({
      path: join(screenshotsDir, 'anticipated-tariff-no-sidebar.png'),
      fullPage: false
    });
    
    console.log('Screenshot captured successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

captureScreenshots();