import { test } from '@playwright/test'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// Create screenshots directory if it doesn't exist
const screenshotsDir = join(process.cwd(), 'screenshots')
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true })
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
]

test.describe('Capture Screenshots', () => {
  test('capture all visualizations', async ({ page }) => {
    // Set viewport to match design specs
    await page.setViewportSize({ width: 1440, height: 900 })
    
    // Navigate to the app
    await page.goto('/')
    
    // Wait for initial load
    await page.waitForTimeout(3000)
    
    // Capture each visualization
    for (const viz of visualizations) {
      console.log(`Capturing ${viz.name}...`)
      
      // Click on the navigation item
      await page.click(`button:has-text("${viz.navText}")`)
      
      // Wait for content to load and animations to complete
      await page.waitForTimeout(4000)
      
      // Take a screenshot
      await page.screenshot({
        path: join('screenshots', `${viz.name}.png`),
        fullPage: true,
      })
      
      console.log(`✓ Captured ${viz.name}`)
    }
  })
})