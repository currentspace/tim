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
  { path: '/', name: 'anticipated-tariff-impact' },
  { path: '/country-exposure', name: 'country-exposure' },
  { path: '/company-timeline', name: 'company-timeline' },
  { path: '/country-timeline', name: 'country-timeline' },
  { path: '/startup-universe', name: 'startup-universe' },
]

test.describe('Simple Screenshot Capture', () => {
  test('capture all routes', async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1440, height: 900 })

    for (const route of routes) {
      console.log(`Capturing ${route.name}...`)

      // Navigate to route
      await page.goto(route.path)

      // Wait for basic load
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(3000) // Wait 3 seconds for animations

      // Capture full page
      await page.screenshot({
        path: join(screenshotsDir, `${route.name}-full.png`),
        fullPage: true,
      })

      // Capture main content - use first main element
      const main = page.locator('main').first()
      await main.screenshot({
        path: join(screenshotsDir, `${route.name}-component.png`),
      })

      console.log(`✓ Captured ${route.name}`)
    }
  })
})
