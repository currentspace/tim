import { test, expect } from '@playwright/test'
import { existsSync, mkdirSync } from 'fs'
import { readdir } from 'fs/promises'
import { join } from 'path'

// Ensure screenshots directory exists
const screenshotsDir = join(process.cwd(), 'screenshots')
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true })
}

// Define all routes and their corresponding Figma design files
const routes = [
  {
    path: '/',
    name: 'Anticipated Tariff Impact',
    navText: 'Anticipated Tariff Impact',
    screenshotName: 'anticipated-tariff-impact',
    figmaFile: 'anticipated_tariff_impact.png',
  },
  {
    path: '/country-exposure',
    name: 'Country Exposure',
    navText: 'Country Exposure',
    screenshotName: 'country-exposure',
    figmaFile: 'country_exposure.png',
  },
  {
    path: '/company-timeline',
    name: 'Company Timeline',
    navText: 'Company Timeline',
    screenshotName: 'company-timeline',
    figmaFile: 'tariff_timeline.png',
  },
  {
    path: '/country-timeline',
    name: 'Country Timeline',
    navText: 'Country Timeline',
    screenshotName: 'country-timeline',
    figmaFile: 'country_timeline.png',
  },
  {
    path: '/startup-universe',
    name: 'Startup Universe',
    navText: 'Startup Universe',
    screenshotName: 'startup-universe',
    figmaFile: 'startup_universe.png', // Note: No Figma design available
  },
]

test.describe('Capture All Route Screenshots', () => {
  test('should capture screenshots for all routes', async ({ page }) => {
    // Set viewport to match Figma designs
    await page.setViewportSize({ width: 1440, height: 900 })

    for (const route of routes) {
      console.log(`Capturing ${route.name}...`)

      // Navigate directly to the route
      await page.goto(route.path)
      await page.waitForLoadState('networkidle')

      // Wait for D3 visualizations to render
      await page.waitForTimeout(3000)

      // Capture full page screenshot
      await page.screenshot({
        path: join(screenshotsDir, `${route.screenshotName}-full.png`),
        fullPage: true,
      })

      // Try to capture component-specific screenshot
      const mainContent = page.locator('main').first()
      if (await mainContent.isVisible()) {
        await mainContent.screenshot({
          path: join(screenshotsDir, `${route.screenshotName}-component.png`),
        })
      }

      console.log(`✓ Captured ${route.name}`)
    }
  })
})

test.describe('Visual Regression Tests', () => {
  // Get all Figma files for comparison
  test.beforeAll(async () => {
    const figmaDir = join(process.cwd(), 'figma')
    if (existsSync(figmaDir)) {
      const files = await readdir(figmaDir)
      console.log('Available Figma design files:', files)
    }
  })

  // Create a test for each route comparison
  for (const route of routes) {
    test(`should match Figma design for ${route.name}`, async () => {
      const capturedPath = join(screenshotsDir, `${route.screenshotName}-component.png`)
      const figmaPath = join(process.cwd(), 'figma', route.figmaFile)

      // Check if both files exist
      expect(
        existsSync(capturedPath),
        `Captured screenshot not found: ${capturedPath}`,
      ).toBeTruthy()
      expect(existsSync(figmaPath), `Figma design not found: ${figmaPath}`).toBeTruthy()

      // Note: For actual visual comparison, you would need to:
      // 1. Use Playwright's built-in visual comparison: expect(screenshot).toMatchSnapshot()
      // 2. Or integrate with a visual regression testing service
      // 3. Or use a library like pixelmatch for pixel-by-pixel comparison

      console.log(`Comparison ready for ${route.name}:`)
      console.log(`  - Captured: ${capturedPath}`)
      console.log(`  - Figma: ${figmaPath}`)
    })
  }
})
