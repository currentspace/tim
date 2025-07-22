/* eslint-disable no-console */
import { test } from '@playwright/test'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// Ensure screenshots directory exists
const screenshotsDir = join(process.cwd(), 'screenshots')
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true })
}

// Define all routes
const routes = [
  {
    path: '/',
    name: 'Anticipated Tariff Impact',
    screenshotName: 'anticipated-tariff-impact',
  },
  {
    path: '/country-exposure',
    name: 'Country Exposure',
    screenshotName: 'country-exposure',
  },
  {
    path: '/company-timeline',
    name: 'Company Timeline',
    screenshotName: 'company-timeline',
  },
  {
    path: '/country-timeline',
    name: 'Country Timeline',
    screenshotName: 'country-timeline',
  },
  {
    path: '/startup-universe',
    name: 'Startup Universe',
    screenshotName: 'startup-universe',
  },
]

test.describe('Capture Screenshots', () => {
  test('capture all route screenshots', async ({ page }) => {
    // Set viewport to match Figma designs
    await page.setViewportSize({ width: 1440, height: 900 })

    for (const route of routes) {
      console.log(`📸 Capturing ${route.name}...`)

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

      console.log(`✅ Captured ${route.name}`)
    }

    console.log('\n✨ All screenshots captured successfully!')
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`)
  })
})
