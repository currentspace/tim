/* eslint-disable no-console */
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
    navText: 'Anticipated Tariff Impact',
    selector: '.anticipated-tariff-impact',
    waitFor: '.sankey-diagram',
  },
  {
    name: 'country-exposure',
    navText: 'Country Exposure',
    selector: '.country-exposure',
    waitFor: '.radial-chart svg',
  },
  {
    name: 'company-tariff-timeline',
    navText: 'Company Tariff Timeline',
    selector: '.tariff-rate-timeline',
    waitFor: '.timeline-container svg',
  },
  {
    name: 'country-tariff-timeline',
    navText: 'Country Tariff Timeline',
    selector: '.country-tariff-timeline',
    waitFor: '.timeline svg',
  },
  {
    name: 'startup-universe',
    navText: 'Startup Universe',
    selector: '.startup-universe',
    waitFor: '#network-svg',
  },
]

test.describe('Capture Visualizations', () => {
  test.beforeEach(async ({ page }) => {
    // Set a consistent viewport size (1440x900 as per the design)
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  for (const viz of visualizations) {
    test(`capture ${viz.name}`, async ({ page }) => {
      // Navigate to the app
      await page.goto('/')

      // Wait for navigation to load
      await page.waitForSelector('.navigation', { timeout: 10000 })

      // Click on the navigation item
      await page.click(`a:has-text("${viz.navText}")`)

      // Wait for the visualization to load
      await page.waitForSelector(viz.selector, { timeout: 10000 })

      // Wait for specific visualization element (like SVG) to be rendered
      if (viz.waitFor) {
        await page.waitForSelector(viz.waitFor, { timeout: 10000 })
      }

      // Give animations time to complete
      await page.waitForTimeout(2000)

      // Take a screenshot of the full page
      await page.screenshot({
        path: join('screenshots', `${viz.name}-full.png`),
        fullPage: true,
      })

      // Take a screenshot of just the visualization component
      const element = page.locator(viz.selector).first()
      await element.screenshot({
        path: join('screenshots', `${viz.name}-component.png`),
      })

      console.log(`✓ Captured screenshots for ${viz.name}`)
    })
  }
})
