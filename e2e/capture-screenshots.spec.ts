import { test, expect } from '@playwright/test'
import { mkdir } from 'fs/promises'
import { join } from 'path'

const visualizations = [
  {
    name: 'anticipated-tariff-impact',
    navText: 'Anticipated Tariff Impact',
    selector: '.anticipated-tariff-impact',
  },
  {
    name: 'country-exposure',
    navText: 'Country Exposure',
    selector: '.country-exposure',
  },
  {
    name: 'tariff-rate-timeline',
    navText: 'Tariff Rate Timeline',
    selector: '.tariff-rate-timeline',
  },
  {
    name: 'country-tariff-timeline',
    navText: 'Country Tariff Timeline',
    selector: '.country-tariff-timeline',
  },
  {
    name: 'startup-universe',
    navText: 'Startup Universe',
    selector: '.startup-universe',
  },
  {
    name: 'notification-settings',
    navText: 'Notification Settings',
    selector: '.notification-settings',
  },
]

test.describe('Capture visualization screenshots', () => {
  test.beforeAll(async () => {
    await mkdir('screenshots', { recursive: true })
  })

  test.beforeEach(async ({ page }) => {
    // Set a consistent viewport size
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  for (const viz of visualizations) {
    test(`capture ${viz.name}`, async ({ page }) => {
      // Navigate to the app
      await page.goto('/')

      // Click on the navigation item
      await page.click(`text="${viz.navText}"`)

      // Wait for the visualization to load
      await page.waitForSelector(viz.selector, { timeout: 10000 })

      // Give D3 visualizations time to render and animations to complete
      await page.waitForTimeout(3000)

      // Take a screenshot of the entire page
      await page.screenshot({
        path: join('screenshots', `${viz.name}-full.png`),
        fullPage: true,
      })

      // Take a screenshot of just the visualization component
      const element = await page.locator(viz.selector)
      await element.screenshot({
        path: join('screenshots', `${viz.name}-component.png`),
      })

      console.log(`✓ Captured screenshots for ${viz.name}`)
    })
  }

  test('capture navigation menu', async ({ page }) => {
    await page.goto('/')

    // Capture navigation on desktop
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.screenshot({
      path: join('screenshots', 'navigation-desktop.png'),
    })

    // Capture navigation on mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.click('.mobile-menu-toggle')
    await page.waitForSelector('.navigation-wrapper.open')
    await page.screenshot({
      path: join('screenshots', 'navigation-mobile.png'),
    })
  })
})
